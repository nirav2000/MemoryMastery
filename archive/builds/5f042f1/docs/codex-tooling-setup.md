# Codex visual QA tooling setup

Memory Mastery is a static app and has no npm/build requirement for users. For Codex, CI or local QA, install browser automation tools before visual review.

Recommended helper:

```bash
scripts/install-visual-qa-tools.sh
```

The script installs, where available:

- Chromium
- Chromium WebDriver
- Python Playwright
- Selenium
- pytest
- Playwright's Chromium browser/dependencies

After installing, verify:

```bash
python3 - <<'PY'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    browser.close()
print('playwright chromium ok')
PY
```

Visual QA agents should render changed routes at 320, 375, 768, 1024 and 1440 pixels in light and dark mode, then inspect screenshots rather than relying only on compilation.
