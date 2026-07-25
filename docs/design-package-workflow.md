# Design package review workflow

Design Studio overrides are working drafts, whether they originated in this browser or arrived through Firebase sync. They are not permanent product code.

## Export

The archive owner can open **Settings → Design studio** and choose **Download design package**. The browser downloads two reviewable files:

* `memory-mastery-design-overrides.json` contains the app version, edited route, all edited route keys, edited component groups, override values, creation date, and the Firebase user ID when signed in.
* `design-overrides.generated.css` is a generated preview of the same validated overrides. It is an aid to review, not a stylesheet that the application loads automatically.

Keep both files together when handing a proposal to a developer. The JSON file is the source package; the CSS file makes the visual rules easy to inspect in a code review.

## Admin import preview

The archive owner can choose **Preview imported package** and select the exported JSON file. Memory Mastery validates the package shape, regenerates CSS from the supported property allowlists, and displays an isolated sample in a dialog. Import preview does not replace local storage, write to Firebase, or modify the live page.

## Permanent adoption

A downloaded or previewed package is only a proposal. Permanent adoption requires a developer to:

1. review the metadata and override values;
2. inspect the affected routes at every supported breakpoint, including keyboard focus, overflow, text wrapping, and light/dark contrast;
3. translate approved values into the maintained design system or an explicitly reviewed generated stylesheet;
4. run the repository regression checks; and
5. create and review a GitHub commit.

Do not add an exported package to production merely because its preview looks correct. The selector contract and accessibility protections in [`design-studio-selector-contract.md`](design-studio-selector-contract.md) remain authoritative.
