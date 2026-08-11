#!/usr/bin/env python3
"""Browser regressions for the canonical static entry point."""

from __future__ import annotations

import contextlib
import http.server
import json
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
VIEWPORTS = (320, 375, 768, 1024, 1440)
FIXTURE = {
    "version": 1,
    "profile": {"name": "Returning learner", "currentDay": 4, "theme": "light"},
    "firstSuccess": {"completed": True, "challengeTitle": "Shopping list"},
    "results": [{"day": 1, "accuracy": 80}],
    "reviews": [],
    "palaces": [],
    "majorSystem": [],
    "pao": [],
    "symbols": [],
    "nameImages": [],
    "missions": [],
    "achievements": [],
}


class ProjectHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        if path.startswith("/MemoryMastery/"):
            path = path[len("/MemoryMastery") :]
        return super().translate_path(path)

    def send_error(self, code: int, message: str | None = None, explain: str | None = None) -> None:
        if code == 404:
            body = (ROOT / "404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, _format: str, *args: object) -> None:
        pass


@contextlib.contextmanager
def serve():
    handler = lambda *args, **kwargs: ProjectHandler(*args, directory=ROOT, **kwargs)
    with socketserver.ThreadingTCPServer(("127.0.0.1", 0), handler) as server:
        server.daemon_threads = True
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{server.server_address[1]}"
        finally:
            server.shutdown()
            thread.join()


def assert_shell(page, expected_hash: str) -> None:
    page.wait_for_selector("#main h1")
    assert page.url.endswith(expected_hash), page.url
    assert page.locator("#main").count() == 1
    assert page.locator("#nav > a").count() == 4
    assert page.locator("#nav a[aria-current='page']").count() == 1
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")


def run() -> None:
    shell_sources = [
        name
        for name in ("index.html", "app.html", "404.html")
        if 'id="main"' in (ROOT / name).read_text()
    ]
    assert shell_sources == ["index.html"], shell_sources

    with serve() as origin, sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        page.goto(f"{origin}/index.html#learn")
        assert_shell(page, "#learn")
        page.evaluate("value => localStorage.setItem('memoryDojo.v1', value)", json.dumps(FIXTURE))
        page.reload()
        assert_shell(page, "#learn")
        stored = page.evaluate("localStorage.getItem('memoryDojo.v1')")

        for entry in (
            "/?entry=root#library",
            "/index.html?entry=index#progress",
            "/app.html?entry=legacy#learn",
            "/missing?entry=fallback#dashboard",
            "/MemoryMastery/missing?entry=project-fallback#library",
        ):
            expected_hash = entry[entry.index("#") :]
            page.goto(f"{origin}{entry}")
            assert_shell(page, expected_hash)
            assert page.evaluate("localStorage.getItem('memoryDojo.v1')") == stored
            assert "entry=" in page.url
            page.reload()
            assert_shell(page, expected_hash)

        page.goto(f"{origin}/index.html#dashboard")
        page.locator("#nav a[href='#learn']").click()
        page.locator("#nav a[href='#library']").click()
        page.go_back()
        assert_shell(page, "#learn")
        page.go_forward()
        assert_shell(page, "#library")

        page.goto(f"{origin}/index.html#library")
        for _ in range(20):
            page.keyboard.press("Tab")
            if page.locator(".skip").evaluate("element => element === document.activeElement"):
                break
        assert page.locator(".skip").evaluate("element => element === document.activeElement")
        assert page.locator(".skip").evaluate(
            "element => getComputedStyle(element).outlineStyle !== 'none'"
        )
        page.keyboard.press("Enter")
        assert page.locator("#main").evaluate("element => element === document.activeElement")

        initial_theme = page.locator("body").get_attribute("class") or ""
        page.locator("#theme").click()
        toggled_theme = page.locator("body").get_attribute("class") or ""
        assert toggled_theme != initial_theme
        page.locator("#theme").click()
        assert (page.locator("body").get_attribute("class") or "") == initial_theme

        context.close()

        for width in VIEWPORTS:
            responsive = browser.new_context(
                viewport={"width": width, "height": 900},
                reduced_motion="reduce",
                color_scheme="light",
            )
            view = responsive.new_page()
            view.goto(f"{origin}/app.html?viewport={width}#dashboard")
            assert_shell(view, "#dashboard")
            assert view.evaluate("document.documentElement.scrollWidth <= innerWidth")
            assert view.locator("h1").evaluate(
                "element => element.getBoundingClientRect().right <= innerWidth"
            )
            assert view.locator("#nav a").evaluate_all(
                "elements => elements.every(element => element.getBoundingClientRect().height >= 44)"
            )
            transition = view.locator(".note-drawer").evaluate(
                "element => getComputedStyle(element).transitionDuration"
            )
            assert transition in ("0s", "0ms"), transition
            responsive.close()

        browser.close()

    print("entry-point browser checks ok")


if __name__ == "__main__":
    run()
