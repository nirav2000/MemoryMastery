#!/usr/bin/env python3
"""Deterministic, cross-browser checks for Memory Mastery's critical journeys."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

from playwright.sync_api import Browser, Page, Playwright, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "test-results" / "critical-journeys"
AXE_PATH = ROOT / "node_modules" / "axe-core" / "axe.min.js"
NOW = 1_786_253_400_000
MATERIAL = ["Bread", "Milk", "Bananas", "Eggs", "Tomatoes", "Pasta", "Soap", "Tea"]


def load_entry_support():
    spec = importlib.util.spec_from_file_location("entry_points", ROOT / "tests" / "entry-points.spec.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def keyboard_activate(page: Page, selector: str) -> None:
    target = page.locator(selector)
    target.focus()
    assert target.evaluate("element => element === document.activeElement")
    page.keyboard.press("Enter" if target.evaluate("element => element.tagName === 'A'") else "Space")


def stored(page: Page) -> dict:
    return json.loads(page.evaluate("localStorage.getItem('memoryDojo.v1')"))


def assert_shell(page: Page, hash_value: str, primary: bool = True) -> None:
    page.wait_for_selector("#main h1")
    assert page.url.endswith(hash_value), page.url
    assert page.locator("#nav > a").count() == 4
    assert page.locator("#nav a[aria-current='page']").count() == (1 if primary else 0)
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")


def complete_first_success(page: Page, origin: str) -> None:
    page.goto(f"{origin}/index.html#learn")
    assert_shell(page, "#learn")
    page.locator("[data-challenge='shopping']").click()

    source = page.locator("[data-hide-source]").locator("xpath=preceding-sibling::*[1]")
    assert source.is_visible()
    source_element = source.element_handle()
    assert source_element
    page.locator("[data-hide-source]").click()
    assert source_element.is_hidden()
    assert source_element.get_attribute("hidden") is not None
    page.keyboard.press("Tab")
    assert page.locator(":focus").count() == 1
    assert page.locator(":focus").evaluate("element => getComputedStyle(element).outlineStyle !== 'none'")

    page.locator("[data-recall-item]").first.fill("Bread")
    page.locator(".recall-form button").click()
    page.locator("[data-journey]").click()
    page.locator("[data-journey]").click()

    assert "Bread" not in page.locator("#main").inner_text()
    for index, value in enumerate(MATERIAL):
        page.locator("[data-recall-item]").nth(index).fill(value)
    page.locator(".recall-form button").click()
    page.locator("#firstProject").select_option(label="Names")
    completion_time = page.evaluate("Date.now()")
    page.evaluate("document.querySelector('[data-complete-first]').click()")
    page.wait_for_timeout(100)
    if not stored(page)["firstSuccess"].get("completed"):
        raise AssertionError(f"completion handler did not persist: {page.locator('#toast').inner_text()!r}")
    page.wait_for_function("JSON.parse(localStorage.getItem('memoryDojo.v1')).firstSuccess.completed === true")

    state = stored(page)
    assert state["firstSuccess"]["completed"] is True
    assert state["firstSuccess"]["project"] == "Names"
    assert state["firstSuccess"]["final"]["accuracy"] == 100
    assert len(state["results"]) == 1
    assert len(state["reviews"]) == 1
    assert completion_time + 20 * 60_000 <= state["reviews"][0]["nextReviewAt"] <= completion_time + 20 * 60_000 + 5_000

    page.reload()
    page.wait_for_selector("#main h1")
    reloaded = stored(page)
    assert reloaded["firstSuccess"] == state["firstSuccess"]
    assert reloaded["results"] == state["results"]
    assert reloaded["reviews"] == state["reviews"]


def check_due_review(page: Page, origin: str) -> None:
    fixture = {
        "version": 1,
        "profile": {"name": "Review learner", "currentDay": 2, "theme": "light"},
        "firstSuccess": {"completed": True, "challengeTitle": "Shopping list"},
        "results": [{"day": 0, "date": NOW - 3_600_000, "accuracy": 75}],
        "reviews": [{
            "id": "review-fixture",
            "sessionDay": 0,
            "title": "First success: Shopping list",
            "material": MATERIAL,
            "answers": MATERIAL,
            "createdAt": NOW - 3_600_000,
            "immediateScore": 75,
            "intervalIndex": 0,
            "nextReviewAt": NOW - 1,
            "lastReviewAt": None,
            "reviewScore": None,
            "strength": "growing",
            "status": "active",
        }],
        "palaces": [], "majorSystem": [], "pao": [], "symbols": [], "nameImages": [],
        "missions": [], "achievements": [], "notes": [], "settings": {"intervals": [20, 1440]},
    }
    page.goto(origin)
    page.evaluate("value => localStorage.setItem('memoryDojo.v1', value)", json.dumps(fixture))
    page.goto(f"{origin}/index.html#reviews")
    assert_shell(page, "#reviews", primary=False)
    page.locator("[data-review-card] summary").click()
    answer = page.locator("[data-review-answer='review-fixture']")
    assert "Bread" not in page.locator("[data-review-card]").inner_text()
    answer.fill("\n".join(MATERIAL))
    review_time = page.evaluate("Date.now()")
    keyboard_activate(page, "[data-review-form='review-fixture'] button")
    result = page.locator("#review-result-review-fixture")
    assert "100% recalled" in result.inner_text()
    state = stored(page)
    review = next(item for item in state["reviews"] if item["id"] == "review-fixture")
    assert review["reviewScore"] == 100
    assert review["intervalIndex"] == 1
    assert review_time + 1440 * 60_000 <= review["nextReviewAt"] <= review_time + 1440 * 60_000 + 5_000


def check_settings_portability(page: Page, origin: str) -> None:
    page.goto(f"{origin}/index.html#settings")
    assert_shell(page, "#settings", primary=False)
    assert page.locator("#authPanel").is_visible()
    assert "guest progress" in page.locator("#authPanel").inner_text().lower()
    assert page.locator("#googleSignIn").is_visible()

    before = stored(page)
    with page.expect_download() as download_info:
        keyboard_activate(page, "#exportJson")
    exported = json.loads(Path(download_info.value.path()).read_text())
    assert exported["firstSuccess"] == before["firstSuccess"]
    assert exported["results"] == before["results"]
    assert exported["reviews"] == before["reviews"]

    imported = dict(exported)
    imported["profile"] = dict(exported["profile"], name="Imported learner")
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#importJson").set_input_files({
        "name": "valid-backup.json",
        "mimeType": "application/json",
        "buffer": json.dumps(imported).encode(),
    })
    page.wait_for_function("localStorage.getItem('memoryDojo.v1').includes('Imported learner')")
    after = stored(page)
    assert after["profile"]["name"] == "Imported learner"
    assert after["results"] == before["results"]
    assert after["reviews"] == before["reviews"]

    page.locator("#importJson").set_input_files({
        "name": "invalid-backup.json",
        "mimeType": "application/json",
        "buffer": b'{"version":2}',
    })
    page.wait_for_timeout(100)
    assert stored(page) == after


def check_navigation_and_accessibility(page: Page, origin: str, axe_source: str) -> None:
    page.goto(f"{origin}/app.html?journey=navigation#dashboard")
    assert_shell(page, "#dashboard")
    for hash_value in ("#learn", "#library", "#progress"):
        keyboard_activate(page, f"#nav a[href='{hash_value}']")
        assert_shell(page, hash_value)
        assert page.locator("#main").evaluate("element => element === document.activeElement")
    page.go_back()
    assert_shell(page, "#library")
    page.go_forward()
    assert_shell(page, "#progress")

    for dark in (False, True):
        if ("dark" in (page.locator("body").get_attribute("class") or "")) != dark:
            keyboard_activate(page, "#theme")
        page.add_script_tag(content=axe_source)
        result = page.evaluate(
            "axe.run(document, {runOnly: {type: 'tag', values: ['wcag2aa', 'wcag21aa', 'wcag22aa']}})"
        )
        serious = [item for item in result["violations"] if item["impact"] in ("critical", "serious")]
        assert not serious, [(item["id"], len(item["nodes"])) for item in serious]


def run_engine(playwright: Playwright, engine_name: str, origin: str, axe_source: str) -> None:
    browser_type = getattr(playwright, engine_name)
    browser: Browser = browser_type.launch()
    context = browser.new_context(viewport={"width": 375, "height": 900}, reduced_motion="reduce")
    context.tracing.start(screenshots=True, snapshots=True, sources=True)
    page = context.new_page()
    errors: list[str] = []
    def record_page_error(error) -> None:
        message = str(error)
        if "gstatic.com/firebasejs" not in message:
            errors.append(message)
    page.on("pageerror", record_page_error)
    try:
        complete_first_success(page, origin)
        print(f"{engine_name}: first success passed", flush=True)
        check_due_review(page, origin)
        print(f"{engine_name}: review passed", flush=True)
        check_settings_portability(page, origin)
        print(f"{engine_name}: portability passed", flush=True)
        check_navigation_and_accessibility(page, origin, axe_source)
        print(f"{engine_name}: navigation and accessibility passed", flush=True)
        assert not errors, errors
        context.tracing.stop()
    except Exception:
        ARTIFACTS.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=ARTIFACTS / f"{engine_name}-failure.png", full_page=True)
        (ARTIFACTS / f"{engine_name}-storage.json").write_text(
            json.dumps(stored(page), indent=2) if page.url.startswith(origin) else "{}"
        )
        context.tracing.stop(path=ARTIFACTS / f"{engine_name}-failure-trace.zip")
        raise
    finally:
        context.close()
        browser.close()


def run() -> None:
    assert AXE_PATH.exists(), "Run npm ci before the critical-journey suite."
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    axe_source = AXE_PATH.read_text()
    support = load_entry_support()
    with support.serve() as origin, sync_playwright() as playwright:
        for engine_name in ("chromium", "firefox"):
            print(f"running critical journeys in {engine_name}", flush=True)
            run_engine(playwright, engine_name, origin, axe_source)
            print(f"passed critical journeys in {engine_name}", flush=True)
    print("critical-journey browser checks ok: chromium, firefox")


if __name__ == "__main__":
    run()
