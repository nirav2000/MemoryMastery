# Visual QA baseline policy

`tests/visual-matrix.json` is the authoritative inventory of routes, states, themes, motion preference and viewport widths. The matrix deliberately uses the required 320, 375, 768, 1024 and 1440 pixel widths, light and dark themes, and reduced motion.

## Capture and comparison

Install pinned dependencies, then compare the current application with approved baselines:

```bash
npm ci
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install --with-deps chromium
npm run test:visual
```

An unexplained difference above the manifest threshold fails. CI retains `expected`, `actual`, `diff` and `results.json` artifacts for diagnosis. There are no default masks. A mask may be added only for a proven nondeterministic region and must be documented in the manifest.

## Approving a baseline change

1. Run the functional and accessibility suites first.
2. Capture candidates with `python3 tests/visual-matrix.spec.py --update`.
3. Inspect every changed image, not only the diff count. Review overflow, clipping, touching panels, overlap, headings, cards, controls, action competition, wrapping, focus, empty/maximum states, obsolete-style flashes, light/dark contrast and reduced motion.
4. Record the review, intentional differences and confirmed defects in `docs/execution-plan.md`.
5. Run `npm run test:visual` twice without `--update`. Never update a baseline merely to make CI green.

Baselines use viewport screenshots rather than full-page screenshots so fixed navigation and drawers appear as learners see them and do not repeat during browser stitching.
