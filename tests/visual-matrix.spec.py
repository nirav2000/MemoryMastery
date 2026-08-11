#!/usr/bin/env python3
"""Capture or compare the approved Memory Mastery visual matrix."""

from __future__ import annotations

import argparse
import importlib.util
import io
import json
import shutil
from pathlib import Path

from PIL import Image, ImageChops
from playwright.sync_api import Page, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "tests" / "visual-matrix.json"
BASELINES = ROOT / "tests" / "visual-baselines"
RESULTS = ROOT / "test-results" / "visual"


def support_module():
    spec = importlib.util.spec_from_file_location("entry_points", ROOT / "tests" / "entry-points.spec.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def fixture(state: str) -> dict:
    long_label = "A deliberately long learner label that must wrap without colliding with controls or leaving its panel"
    empty = {
        "version": 1,
        "profile": {"name": "", "onboarded": False, "currentDay": 1, "currentBelt": "white", "theme": "light", "colorTheme": "pastelPaper", "uiStyle": "smartpaper"},
        "firstSuccess": {"completed": False}, "contract": {}, "palaces": [], "majorSystem": [], "pao": [], "symbols": [], "nameImages": [],
        "results": [], "reviews": [], "missions": [], "achievements": [], "notes": [], "designOverrides": {}, "settings": {"intervals": [20, 1440, 4320, 10080, 43200]},
    }
    if state == "empty":
        return empty
    data = json.loads(json.dumps(empty))
    data["profile"].update({"name": "Baseline learner", "onboarded": True, "currentDay": 4})
    data["firstSuccess"] = {"completed": True, "challengeTitle": "A practical shopping list", "project": "Names", "completedAt": 1_786_253_400_000}
    data["results"] = [{"day": 0, "date": 1_786_253_400_000, "accuracy": 88, "correct": 7, "omitted": 1, "orderErrors": 0, "belt": "white"}]
    data["reviews"] = [{"id": "visual-review", "sessionDay": 0, "title": "First success: Shopping list", "material": ["Bread", "Milk", "Tea"], "answers": ["Bread", "Milk", ""], "createdAt": 1_786_253_400_000, "immediateScore": 67, "intervalIndex": 0, "nextReviewAt": 0, "status": "active", "strength": "growing"}]
    data["palaces"] = [{"name": "Home entrance route", "routeDescription": "Front gate to living room", "locations": [{"name": "Front gate", "description": "Fixed start", "feature": "Iron latch"}]}]
    data["pao"] = [{"Number or card": "00", "Person": "Ada", "Action": "builds", "Object": "a bright bridge"}]
    data["symbols"] = [{"concept": "clarity", "image": "a clean window", "meaning": "understanding"}]
    data["nameImages"] = [{"Name": "Maya", "Sound-alike image": "mayor", "Notes": "Safe sample"}]
    data["contract"] = {"purpose": "Remember useful, non-sensitive information", "commitment": "Ten calm minutes"}
    if state == "maximum":
        data["profile"]["name"] = long_label
        data["palaces"][0]["name"] = long_label
        data["pao"][0]["Person"] = long_label
        data["symbols"][0]["concept"] = long_label
        data["nameImages"][0]["Name"] = long_label
        data["contract"]["purpose"] = long_label
    if state != "due":
        data["reviews"][0]["nextReviewAt"] = 4_102_444_800_000
    return data


def prepare(page: Page, origin: str, route: str, state: str, theme: str) -> None:
    page.goto(origin)
    value = fixture(state)
    value["profile"]["theme"] = theme
    page.evaluate("value => localStorage.setItem('memoryDojo.v1', JSON.stringify(value))", value)
    page.goto(f"{origin}/index.html#{route}")
    page.wait_for_selector("#main h1")
    page.locator("body").evaluate("element => element.dataset.visualQa = 'ready'")
    page.wait_for_timeout(80)


def changed_ratio(expected: bytes, actual: bytes, diff_path: Path) -> float:
    expected_image = Image.open(io.BytesIO(expected)).convert("RGBA")
    actual_image = Image.open(io.BytesIO(actual)).convert("RGBA")
    if expected_image.size != actual_image.size:
        actual_image.save(diff_path)
        return 1.0
    difference = ImageChops.difference(expected_image, actual_image)
    changed = sum(1 for pixel in difference.getdata() if pixel != (0, 0, 0, 0))
    if changed:
        amplified = difference.convert("RGB").point(lambda value: min(255, value * 4))
        amplified.save(diff_path)
    return changed / (expected_image.width * expected_image.height)


def compare_or_update(path: Path, image: bytes, update: bool, threshold: float, failures: list[dict]) -> None:
    if update:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(image)
        return
    if not path.exists():
        failures.append({"baseline": str(path.relative_to(ROOT)), "reason": "missing baseline"})
        return
    actual_path = RESULTS / "actual" / path.name
    diff_path = RESULTS / "diff" / path.name
    actual_path.parent.mkdir(parents=True, exist_ok=True)
    diff_path.parent.mkdir(parents=True, exist_ok=True)
    ratio = changed_ratio(path.read_bytes(), image, diff_path)
    if ratio > threshold:
        actual_path.write_bytes(image)
        expected_path = RESULTS / "expected" / path.name
        expected_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, expected_path)
        failures.append({"baseline": str(path.relative_to(ROOT)), "changedPixelRatio": ratio, "threshold": threshold})
    elif diff_path.exists():
        diff_path.unlink()


def assert_layout(page: Page, width: int) -> None:
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"horizontal overflow at {width}px"
    escaped = page.locator("button, .button, input, select, textarea").evaluate_all(
        "elements => elements.filter(e => { const r=e.getBoundingClientRect(); const intersects=r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight; return intersects && r.width && (r.left < -1 || r.right > innerWidth + 1); }).length"
    )
    assert escaped == 0, f"{escaped} controls outside viewport at {width}px"


def run(update: bool, shard: int, shard_count: int) -> None:
    manifest = json.loads(MANIFEST_PATH.read_text())
    threshold = manifest["baselinePolicy"]["maximumChangedPixelRatio"]
    failures: list[dict] = []
    cells = [
        (route_item, state, theme, width)
        for route_item in manifest["routes"]
        for state in route_item["states"]
        for theme in manifest["themes"]
        for width in manifest["viewports"]
    ]
    selected_cells = [cell for index, cell in enumerate(cells) if index % shard_count == shard]
    expected_cells = len(selected_cells)
    captured = 0
    support = support_module()
    firebase_stub = (ROOT / "js" / "firebase.js").read_text().replace("AIzaSyDBXGMlf7DWPAneD96kCwS9GzLMo2xb8dQ", "YOUR_VISUAL_QA_KEY")
    with support.serve() as origin, sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        matrix_context = browser.new_context(viewport={"width": 320, "height": 900}, reduced_motion="reduce")
        matrix_context.route("**/js/firebase.js*", lambda route: route.fulfill(status=200, content_type="text/javascript", body=firebase_stub))
        page = matrix_context.new_page()
        for route_item, state, theme, width in selected_cells:
            page.set_viewport_size({"width": width, "height": 900})
            prepare(page, origin, route_item["route"], state, theme)
            assert_layout(page, width)
            name = f"{route_item['route']}--{state}--{theme}--{width}.png"
            compare_or_update(BASELINES / name, page.screenshot(animations="disabled"), update, threshold, failures)
            captured += 1
            print(f"captured {name}", flush=True)
        matrix_context.close()

        focus_context = browser.new_context(viewport={"width": 375, "height": 900}, reduced_motion="reduce")
        focus_context.route("**/js/firebase.js*", lambda route: route.fulfill(status=200, content_type="text/javascript", body=firebase_stub))
        focus_page = focus_context.new_page()
        for nav_index, nav_hash in enumerate(("dashboard", "learn", "library", "progress")):
            if nav_index % shard_count == shard:
                prepare(focus_page, origin, nav_hash, "returning", "light")
                focus_page.locator(f"#nav a[href='#{nav_hash}']").focus()
                compare_or_update(BASELINES / f"focus--nav-{nav_hash}--375.png", focus_page.screenshot(animations="disabled"), update, threshold, failures)
        for route_index, route_item in enumerate(manifest["routes"]):
            if route_index % shard_count == shard:
                prepare(focus_page, origin, route_item["route"], route_item["states"][0], "light")
                target = focus_page.locator(route_item["focus"]).first
                if target.count():
                    target.focus()
                    assert target.evaluate("element => getComputedStyle(element).outlineStyle !== 'none'")
                    compare_or_update(BASELINES / f"focus--{route_item['route']}--375.png", focus_page.screenshot(animations="disabled"), update, threshold, failures)
                else:
                    failures.append({"route": route_item["route"], "reason": "missing focus target"})
        focus_context.close()
        browser.close()

    assert captured == expected_cells, f"captured {captured} of {expected_cells} matrix cells"
    RESULTS.mkdir(parents=True, exist_ok=True)
    (RESULTS / f"results-{shard}-of-{shard_count}.json").write_text(json.dumps({"captured": captured, "expected": expected_cells, "failures": failures}, indent=2))
    assert not failures, json.dumps(failures[:10], indent=2)
    print(f"visual matrix {'updated' if update else 'matched'}: shard {shard + 1}/{shard_count}, {captured} cells")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--update", action="store_true", help="Replace approved baselines after human review")
    parser.add_argument("--shard", type=int, default=0)
    parser.add_argument("--shard-count", type=int, default=1)
    args = parser.parse_args()
    assert 0 <= args.shard < args.shard_count
    run(args.update, args.shard, args.shard_count)
