# Design Studio selector contract

This document is the stable boundary between Memory Mastery's interface and Design Studio. The visual tool may offer controls only for the groups and properties below. A selector change is a contract change and must be reviewed alongside the affected routes.

## Editable groups

| Group | Canonical selector | Allowed editable properties |
| --- | --- | --- |
| `pageHero` | `.page-hero` | Padding and gap; border radius; heading and supporting-copy font size; background, text, and accent colour tokens; max width. |
| `card` | `.card` | Padding and gap; border radius; border, surface, text, and accent colour tokens; heading and body font size; max width; restrained shadow token. |
| `pathCard` | `.path-card` | Padding and gap; border radius; border, surface, text, and accent colour tokens; label and supporting-copy font size; max width; restrained shadow token. |
| `primaryButton` | `button:not(.secondary), .button:not(.secondary)` | Inline and block padding; gap; border radius; label font size and weight; background, text, border, hover, and focus colour tokens; min width and max width. |
| `secondaryButton` | `.secondary` | Inline and block padding; gap; border radius; label font size and weight; background, text, border, hover, and focus colour tokens; min width and max width. |
| `footer` | `.site-footer` | Padding and gap; border colour token; surface, text, link, hover, and focus colour tokens; font size; max width. |
| `mainContent` | `main` | Inline and block padding; section gap; background and text colour tokens; max width. |

Property values must use the Design Studio allowlists and CSS validation. Colour edits must reference approved design tokens rather than raw per-element colours. Spacing, sizing, and radius values must remain within the tool's responsive limits; the tool must not add arbitrary CSS, alter content, change display/visibility, or change document structure.

## Protected selectors and attributes

Design Studio must not select, generate rules for, or mutate:

* Authentication UI: `#authPanel`, `.auth-options`, `.auth-form`, `#phoneAuthForm`, `#phoneCodeForm`, `#phoneRecaptcha`, and their descendants.
* Hidden recall source and answer state: `.study-panel`, `.source-list`, `.source-hidden-note`, `[data-hide-source]`, `[data-recall]`, `[data-review-answer]`, `#recallStepBody`, and any `hidden` attribute.
* Notes drawer state: `#noteDrawer`, `#noteTab`, `#noteNavButton`, `.note-drawer`, `.note-panel`, and the `open` class or `aria-expanded`/`aria-controls` attributes that control it.
* Route and navigation accessibility state: `href`, `id`, `role`, `tabindex`, `aria-current`, `aria-label`, `aria-live`, `aria-hidden`, `aria-expanded`, `aria-controls`, and navigation `active` classes.
* Behaviour and storage hooks: attributes whose names start with `data-`, form names/values, input state, event bindings, and the `#designOverrides` style element.

These exclusions take precedence when a protected element is nested inside an editable group. The visual tool may style the editable group's safe presentation properties, but it must never use a broader group rule to override protected state, visibility, behaviour, or accessibility.

## Change checklist

When this contract changes, update Design Studio's group allowlist and regression coverage together. Then inspect every affected route at 320, 375, 768, 1024, and 1440 pixels, including keyboard focus, text wrapping, overflow, light/dark contrast, hidden recall content, auth forms, and notes drawer behaviour.
