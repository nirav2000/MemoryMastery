# Memory Mastery execution plan

## Approved direction

### Mission

Help learners remember useful information confidently by turning evidence-informed memory methods into calm, guided practice that produces an early success and a clear next action.

### Vision

Memory Mastery becomes a trustworthy, accessible learning companion that moves people from their first coached recall to durable, ethical use of memory in everyday life—without requiring sign-in, exposing advanced tools too early, or rewarding activity for its own sake.

### Outcomes

The release is intended to produce these observable learner and product outcomes:

1. A new learner can complete a useful first memory experience, understand the result, and choose what to do next without creating an account.
2. Returning learners can resume the correct practice or review without navigating a dashboard or losing existing `memoryDojo.v1` data.
3. Learners improve durable recall on useful, non-sensitive material through guided projects, timely review, and targeted repair of errors.
4. Every supported entry point and critical journey behaves consistently across the release viewport matrix, keyboard use, reduced motion, and light and dark themes.
5. The team can release from one verified shell with reproducible CI, browser tests, visual baselines, accessibility checks, and post-release signals.
6. Product decisions use consent-respecting measures of learning value and reliability rather than streaks, surveillance, or manipulative engagement.

### Release principles

1. **The next useful action wins.** Each learner screen has one dominant action, explains why it matters and how long it takes, reports success, and offers a clear next step.
2. **Useful before account-bound.** The first useful experience remains available without sign-in; cloud backup and installation stay optional.
3. **Practice before theory.** Beginners experience a method before receiving its full explanation; advanced memory-athlete tools remain progressively disclosed.
4. **Preserve trust and data.** Existing local data, navigation destinations, exports, and optional cloud backup remain compatible; real passwords are never requested or encouraged.
5. **Prove the shell before extending it.** Entry-point consolidation, CI, browser coverage, and visual baselines must be complete before product architecture is expanded.
6. **Quality is a release condition.** Confirmed functional, responsive, accessibility, contrast, storage, and navigation regressions block release.
7. **Measure learning ethically.** Collect the minimum consented data needed to understand learning and reliability; avoid dark patterns, vanity engagement, and sensitive memoranda.
8. **Prefer reversible delivery.** Make small sequential changes, use additive data migrations and feature flags where appropriate, and keep optional future architecture out of the critical path.

## Dependency legend

| Notation | Meaning |
| --- | --- |
| `T01`–`T16` | Stable implementation task identifiers. IDs do not change if scheduling detail changes. |
| `None` | The task has no prerequisite task in this plan. |
| `T01, T02` | Every listed task must meet its acceptance criteria before this task starts. |
| Foundation gate | `T01` through `T06`: access, baseline, entry point, CI, browser tests, and visual QA. |
| Product gate | Product architecture and learner-facing expansion (`T08`–`T14`) may start only after the foundation gate and confirmed foundation fixes in `T07` are complete. |
| Release gate | `T15` must pass before `T16`; an unmet binary acceptance criterion blocks publication. |

Dependencies below name task IDs only. “Previous work,” “foundation,” or another unstated prerequisite is not a dependency.


## T03 — Consolidate `index.html`, `app.html`, and `404.html`

**Status**

DONE — 2026-08-09

**Objective**

Make one canonical application shell serve direct, fallback, and not-found entry paths without markup or behavior drift.

**Scope**

- Select and document the canonical entry point, then make `app.html` and `404.html` redirect to or reuse it while preserving path, query, and hash where hosting permits.
- Remove duplicated shell markup and ensure scripts, styles, metadata, legal links, version display, and boot behavior have one source of truth.
- Preserve deep links, four-item primary navigation, guest-first use, browser history, storage, optional authentication, and a useful no-JavaScript/failure state.

**Non-goals**

- Reworking learner journeys or visual design beyond defects caused by consolidation.
- Adopting a framework, bundler, router, component system, service worker, or server-side renderer.
- Removing a route or changing the `memoryDojo.v1` key/schema.

**Dependencies**

None

**Acceptance criteria**

- A source scan finds exactly one maintained copy of application-shell markup.
- Opening `/`, `/index.html`, `/app.html`, and an unknown static path reaches the same canonical shell and preserves a valid query/hash destination.
- Refreshing every supported hash route renders that route without a blank page, redirect loop, duplicate history entry, or duplicate event handler.
- Existing new-learner and returning-learner fixtures retain all stored records after entering through each entry path.
- At 320, 375, 768, 1024, and 1440 pixels, every entry path has no horizontal overflow, clipping, touching panels, overlapping text, heading collision, unreadably narrow content, or controls outside containers.
- Keyboard users can reach the skip link, primary navigation, dominant action, settings/legal links, and all controls in logical order with visible focus; active navigation exposes `aria-current`.
- Text wraps normally at 200% zoom, reduced-motion disables non-essential motion, and computed foreground/background pairs meet WCAG AA in light and dark themes.

**Required tests**

- Add automated entry-path, deep-link, reload, back/forward, navigation, and duplicate-listener browser tests.
- Run storage snapshot comparisons before and after every entry path for both baseline fixtures.
- Run keyboard-only and visible-focus checks, including focus after redirect and route change.
- Run automated overflow and wrapping assertions and visual inspection at 320, 375, 768, 1024, and 1440 pixels in light/dark and reduced-motion modes.
- Run WCAG AA contrast checks on page text, navigation, controls, buttons, muted text, panels, and overlays.

**Likely affected components**

- `index.html`, `app.html`, `404.html`, hosting fallback configuration, shell boot code, navigation, footer/version loader, CSS loaded by the shell.

**Implementation summary**

- Retained `index.html` as the only application-shell source and replaced the stale duplicate in `app.html` with a query/hash-preserving canonical redirect.
- Replaced the fixed-dashboard `404.html` redirect with a canonical redirect that preserves query/hash state on both root hosting and the `/MemoryMastery/` GitHub Pages project path.
- Added browser regression coverage for root, canonical, legacy and missing-path entry, deep-link reload, browser history, duplicate theme handlers, keyboard/focus behavior, responsive overflow, reduced motion, navigation semantics and storage preservation.
- Corrected the confirmed light-theme muted-text contrast failure found during the required WCAG AA scan.

**Files changed**

- `app.html`
- `404.html`
- `css/styles.css`
- `tests/entry-points.spec.py`
- `docs/execution-plan.md`
- `VERSION`
- `data/version-archive.json`

**Tests performed**

- `python3 tests/entry-points.spec.py` — passed canonical/legacy/fallback entry, deep-link, reload, history, keyboard/focus, navigation, reduced-motion, storage and responsive checks at 320, 375, 768, 1024 and 1440 pixels.
- Axe 4.13.0 WCAG 2 AA/2.1 AA/2.2 AA scans — passed the Today shell in light and dark themes at 320, 375, 768, 1024 and 1440 pixels.
- Playwright screenshot review — inspected light and dark Today states at every required width with reduced motion.
- `node tests-static-regression.mjs` — passed.
- `node scripts/check-version.mjs` — passed for 4.1.7.
- `git diff --check` — passed.

**Problems discovered**

- The previous `app.html` was an independently maintained stale shell, including obsolete asset versions and missing canonical footer behavior.
- The previous `404.html` always discarded the requested query/hash and forced `#dashboard`.
- Axe initially found three muted description elements at a 4.31:1 contrast ratio in the light theme; changing the base muted token resolved all serious/critical WCAG AA findings in the tested matrix.
- Root and GitHub Pages project hosting need different fallback roots; the redirect now handles `/MemoryMastery/` explicitly and otherwise uses `/`.


## T05 — Add browser-level critical-journey tests

**Objective**

Protect the shell and highest-value learning flows with deterministic browser tests before expanding the product.

**Scope**

- Configure a pinned browser-test runner, local static server, stable selectors, sanitised fixtures, trace/screenshot artifacts, and documented commands.
- Cover guest first success, source hiding, item recall and scoring, quick-reminder scheduling, return/resume, training, review completion, four-item navigation, settings, import/export, theme, optional sign-in boundary, and entry-path fallback.
- Isolate clock, storage, and network state so tests are repeatable and never use production accounts.

**Non-goals**

- Pixel-level visual approval (T06).
- Testing every advanced tool combination.
- Changing the storage key/schema or adopting new application architecture.

**Dependencies**

None

**Acceptance criteria**

- The critical-journey suite passes twice consecutively from clean browser profiles with no retry-only successes.
- Recall tests prove source content is absent from both the visual and accessibility trees while answers are entered.
- First-success tests prove completion, score, chosen project, and scheduled reminder persist after reload.
- Import/export tests prove all baseline fixture records survive a round trip and invalid replacement requires confirmation or is rejected.
- Navigation tests prove exactly four primary items, correct `aria-current`, valid deep links, and correct back/forward behavior.
- A failure retains trace, console output, screenshot, and storage snapshot artifacts without personal data or credentials.

**Required tests**

- Run the complete browser suite in the CI browser and at least one second browser engine.
- Run all journeys with keyboard-only interaction and assert visible focus at each action/route transition.
- Assert no uncaught console errors, failed same-origin requests, horizontal overflow, clipped controls, or unwrapped long test strings.
- Run storage-preservation and navigation-regression cases for new and returning learner fixtures.
- Run reduced-motion cases and automated light/dark WCAG AA contrast scans on critical states.

**Likely affected components**

- Browser-test configuration and specs, test fixtures/helpers, stable element selectors, CI browser job, critical learning and review routes.

## T06 — Establish the visual QA matrix and screenshot baselines

**Objective**

Create reviewable screenshot evidence for every important route and state before learner-facing redesign begins.

**Scope**

- Define a matrix covering the canonical entry, Today, Learn, Library, Progress, training, reviews, advanced builders, guidance, contract, poster, settings, legal views, and meaningful empty/loading/error/success states.
- Capture deterministic baselines at 320, 375, 768, 1024, and 1440 pixels in light/dark themes and reduced-motion mode where animation changes output.
- Add thresholds, masking rules limited to true nondeterminism, naming conventions, artifact retention, and human approval rules.

**Non-goals**

- Treating screenshot diffs as the sole accessibility or correctness test.
- Updating baselines to hide unexplained changes.
- Redesigning screens or selecting a future component architecture.

**Dependencies**

T05

**Acceptance criteria**

- The committed/retained manifest lists every required route, state, theme, motion preference, fixture, and viewport with no missing cell.
- A fresh capture reproduces approved baselines within the documented threshold.
- Each unexplained pixel difference fails CI and produces expected, actual, and diff artifacts.
- Human review records no horizontal overflow, clipping, touching panels, overlap, heading collision, narrow cards, escaped buttons, obsolete-style flash, or more than two competing important actions in one region.
- Review records confirm visible focus, long-text wrapping, 44px targets, mobile/desktop spacing, and WCAG AA computed contrast in light and dark themes.

**Required tests**

- Capture and compare every matrix cell at 320, 375, 768, 1024, and 1440 pixels.
- Repeat a clean capture to detect flaky pixels and remove only proven nondeterminism.
- Run keyboard focus-state screenshots for primary navigation and each route’s dominant action.
- Run long-heading, empty/zero-state, maximum-content, reduced-motion, and light/dark contrast variants.
- Run automated document-width versus viewport-width assertions for every matrix cell.

**Likely affected components**

- Visual test specs, screenshot manifest and baselines, fixture data, CI artifact configuration, visual-QA documentation.

## T07 — Fix issues confirmed by automated and visual QA

**Objective**

Resolve foundation defects with the smallest coherent changes before any later product work is allowed to build on the shell.

**Scope**

- Triage failures from T04–T06 by severity and root cause; fix confirmed shell, navigation, storage, accessibility, responsive, contrast, focus, flicker, and content-state defects.
- Add a regression test for each fixed defect and update screenshots only after review explains the intended difference.
- Record deferred issues with impact, evidence, owner, and release disposition.

**Non-goals**

- Unverified aesthetic cleanup or broad redesign.
- Feature work from T08–T14.
- Framework, router, state-store, or component-library migration unless a separately approved blocker proves it necessary.

**Dependencies**

T06

**Acceptance criteria**

- Every critical/high foundation defect is closed with a reproducible regression test or explicitly blocks this task from completion.
- The full static, browser, accessibility, storage, navigation, and visual suites pass from a clean checkout twice consecutively.
- No approved baseline was replaced without a linked explanation and human review.
- The canonical shell meets all matrix checks at 320, 375, 768, 1024, and 1440 pixels in light/dark and reduced-motion modes.
- The foundation gate is recorded as complete before T08 begins.

**Required tests**

- Run the complete T04 static and T05 browser suites twice from clean state.
- Re-run the complete T06 matrix, including keyboard/visible focus, overflow, wrapping, reduced motion, and computed light/dark WCAG AA contrast.
- Run storage-preservation comparisons and navigation regression tests against both baseline fixtures.
- Manually verify each fixed defect at its original route, state, browser, and viewport.

**Likely affected components**

- Canonical shell, route renderers, navigation/history, storage adapters, CSS/design tokens, tests and approved screenshot baselines.

## T08 — Focus the pre-success application shell

**Objective**

Give a new learner one calm, obvious route to a useful first success while retaining access to existing functionality through progressive disclosure.

**Scope**

- Make Today present one dominant beginner action with purpose, duration, success definition, and next-step preview before first success.
- Keep exactly four primary navigation items and move account, analytics, belts, and advanced tools out of the pre-success task region without removing them.
- Use beginner language, consistent Memory Mastery naming, guest-first access, and clear empty/loading/error states.

**Non-goals**

- Removing advanced tools, stored data, sign-in, backup, or existing destinations.
- Deepening handbook content or adding projects/coaching/repair logic.
- Adopting optional future architecture; the verified shell remains the implementation base.

**Dependencies**

T07

**Acceptance criteria**

- A fresh learner sees one dominant action on Today and can begin useful practice without sign-in.
- The action states what to do, why it matters, expected time, what success means, and what follows.
- Exactly four primary navigation items remain, with the active item marked by `aria-current`; all preserved features remain reachable through documented progressive disclosure.
- Returning-learner fixtures bypass no earned state and retain every existing record and destination.
- At 320, 375, 768, 1024, and 1440 pixels, pre-success states have no overflow, clipping, touching panels, overlap, heading collision, narrow content, or escaped controls.
- Keyboard order and focus are visible and logical; long copy wraps at 200% zoom; reduced-motion is honored; all tested light/dark foreground/background pairs meet WCAG AA.

**Required tests**

- Add browser assertions for guest entry, dominant-action count, progressive disclosure, four-item navigation, `aria-current`, and return/resume.
- Run keyboard-only and visible-focus checks through the complete pre-success flow.
- Run overflow, wrapping, 200% zoom, 44px target, reduced-motion, and light/dark contrast checks at 320, 375, 768, 1024, and 1440 pixels.
- Compare local storage before/after with new and returning fixtures and run all navigation regressions.

**Likely affected components**

- Today/pre-success renderer, primary navigation, Library/Progress disclosure, Settings entry, introductory content, responsive CSS.

## T09 — Move handbook content into structured data and deepen it

**Objective**

Make the handbook maintainable, navigable reference material that explains methods fully after guided practice.

**Scope**

- Define and validate a structured chapter schema for title, audience, prerequisites, method steps, worked examples, practice, common errors, safety, and related next action.
- Migrate current handbook copy without loss; deepen chapters with unique, plain-language examples and exercises.
- Add table-of-contents/search/filter behavior only where it improves finding the next relevant explanation; escape all rendered content.

**Non-goals**

- Requiring handbook reading before first success.
- Adding unreviewed medical/clinical claims, copyrighted long passages, or real passwords/sensitive memoranda.
- Replacing the verified renderer with a new CMS or framework.

**Dependencies**

T08

**Acceptance criteria**

- Every handbook chapter validates against one documented schema and has unique method steps, a worked example, a guided exercise, common-error repair, safety note where relevant, and next action.
- A content inventory proves all existing handbook topics were migrated or identifies an approved replacement for each.
- User-controlled or imported strings render as text and cannot inject executable markup.
- Completed first-success context links to the relevant explanation; pre-success practice remains usable without opening the handbook.
- At 320, 375, 768, 1024, and 1440 pixels, contents, chapters, examples, long headings, code-like terms, and empty/search states have no overflow, clipping, overlap, collisions, or escaped controls.
- Keyboard navigation, visible focus, semantic headings/landmarks, 200% wrapping, reduced-motion, and light/dark WCAG AA contrast pass.

**Required tests**

- Validate every structured content file against the schema and fail on missing/duplicate IDs, broken relations, or required fields.
- Test escaping with hostile fixture strings and verify no script executes.
- Run keyboard, focus, heading-order, link, search/filter zero-state, and navigation regression tests.
- Run visual/overflow/wrapping/reduced-motion/light-dark contrast checks at 320, 375, 768, 1024, and 1440 pixels.
- Verify storage snapshots are unchanged by reading handbook content.

**Likely affected components**

- Handbook data/schema, content loader and renderer, Learn route, related-content links, static validators, handbook CSS.

## T10 — Define ethical product and learning measurements

**Objective**

Specify decision-useful, consent-respecting measures before collecting new behavioral data.

**Scope**

- Define a metric dictionary for first-use completion, baseline-to-recall change, delayed recall, error repair, useful project completion, accessibility/reliability failures, and opt-in retention.
- For each event/metric specify purpose, fields, lawful/consent basis, minimisation, aggregation, retention, deletion/export behavior, owner, quality checks, and prohibited uses.
- Create an opt-in/opt-out and local-only design, a synthetic validation plan, and decision thresholds for pilot/release evaluation.

**Non-goals**

- Collecting new production telemetry in this task.
- Ranking learners, selling/sharing personal data, measuring addictive engagement, or treating streak length as mastery.
- Capturing recall content, real passwords, sensitive notes, precise identity, or cross-site/device fingerprints.

**Dependencies**

T09

**Acceptance criteria**

- Every proposed event maps to one approved product or learning question and has a named owner and deletion/retention rule.
- The data dictionary contains no learner-entered recall content, passwords, sensitive notes, advertising identifier, or device fingerprint.
- Consent defaults to off where required, declining leaves all learning flows usable, and withdrawal stops future collection and exposes deletion instructions.
- Metric formulas and pilot thresholds produce expected values for published synthetic examples.
- Privacy, accessibility, content, and product reviewers record approval or an explicit release-blocking objection.

**Required tests**

- Run schema and prohibited-field validation against proposed event examples.
- Unit-test metric formulas with synthetic success, partial, zero, missing, duplicate, and out-of-order cases.
- Threat-model consent bypass, accidental content capture, re-identification, retention expiry, export, and deletion.
- Walk through opt-in, decline, withdrawal, offline, and failure designs with keyboard/focus and screen-reader review before implementation.

**Likely affected components**

- Measurement plan and event schema, privacy/legal documentation, consent design specification, synthetic metric fixtures, pilot decision rubric.

## T11 — Add guided real-life mastery projects

**Objective**

Help learners apply memory skills to a small useful goal through safe, staged practice and reflection.

**Scope**

- Add opt-in projects with goal, relevance, estimated effort, safe sample material, milestones, practice/review schedule, success evidence, reflection, pause/exit, and next action.
- Begin with a small reviewed set of everyday projects and allow safe custom labels without storing underlying sensitive material.
- Preserve progress additively and support resume, completion, and no-progress states.

**Non-goals**

- Real-password, authentication-secret, emergency, clinical, legally critical, or other safety-critical memorisation.
- Competitive rankings, public sharing, or punitive streaks.
- Replacing the 84-day curriculum or requiring project participation.

**Dependencies**

T10

**Acceptance criteria**

- Each project states why it matters, total/time-per-step estimate, safe material boundary, binary milestone success, reflection, and next action.
- A learner can choose, start, pause, resume, complete, or leave a project without sign-in or data loss.
- Unsafe project prompts are absent, and every custom-project entry point warns against real passwords and sensitive/safety-critical information.
- Reload, export/import, and upgrade preserve project selection, milestone state, reviews, and unrelated `memoryDojo.v1` records.
- At 320, 375, 768, 1024, and 1440 pixels, project choice, active, paused, empty, error, completion, and long-content states have no overflow, clipping, overlap, collisions, narrow panels, or escaped buttons.
- Keyboard/focus, navigation, wrapping/zoom, reduced-motion, and computed light/dark WCAG AA contrast pass.

**Required tests**

- Add browser journeys for choose/start/pause/resume/complete/leave, reload, review scheduling, and safe custom labeling.
- Add storage migration, preservation, export/import, and navigation regression tests with both baseline fixtures.
- Test keyboard-only use, visible focus after every state change, screen-reader status announcements, and reduced-motion completion feedback.
- Run visual, overflow, wrapping, 200% zoom, 44px target, and light/dark contrast checks at all five required widths.

**Likely affected components**

- Mastery-project structured data, Today/Learn project routes, scheduling, storage adapter, progress summary, safety content, tests and CSS.

## T12 — Add explainable next-action coaching

**Objective**

Offer one transparent, dismissible next action based on learning state, with a safe deterministic fallback.

**Scope**

- Define a documented rules hierarchy using local completion, due review, recent error pattern, active project, and available time/preferences.
- Display one recommendation with reason, time estimate, success condition, start action, and alternatives behind progressive disclosure.
- Log/measure only under the approved T10 plan and provide local-only, reset, dismiss, unavailable-data, and offline behavior.

**Non-goals**

- Opaque or generative high-stakes advice, diagnosis, emotional manipulation, or guaranteed outcomes.
- More than one dominant recommendation in a task region.
- Requiring cloud data or replacing learner choice.

**Dependencies**

T11

**Acceptance criteria**

- For every published fixture, the same state produces the same documented recommendation and reason.
- Every recommendation states why, duration, success condition, and next step; one dominant start action is present.
- Learners can dismiss or choose an alternative without losing progress, and no-data/offline states yield a useful deterministic fallback.
- Recommendation input excludes recall content and other fields prohibited by T10.
- At 320, 375, 768, 1024, and 1440 pixels, recommendation, explanation, alternatives, no-data, offline, and long-copy states have no overflow, clipping, overlap, collision, or competing actions.
- Keyboard/focus, live-status semantics, 200% wrapping, reduced-motion, light/dark WCAG AA contrast, storage preservation, and navigation regressions pass.

**Required tests**

- Unit-test every rule, priority tie, fallback, dismiss, and alternative with table-driven fixtures.
- Add browser tests for recommendation-to-practice navigation, back/forward, reload, offline, and no-data behavior.
- Compare full storage snapshots to prove unrelated fields are unchanged.
- Run keyboard/screen-reader/focus checks and responsive visual, overflow, wrapping, reduced-motion, and contrast checks at all five widths.

**Likely affected components**

- Coaching rules module, Today recommendation renderer, explanation/alternatives UI, preferences/storage, navigation, measurement hooks.

## T13 — Add targeted error-repair exercises

**Objective**

Turn an observable recall error into a short, supportive exercise and a verified re-attempt.

**Scope**

- Map omissions, order errors, substitutions, weak images, and selected method-specific mistakes to small exercises using existing scoring evidence.
- Explain the error without blame, hide source correctly, guide repair, rescore, schedule the appropriate review, and return a next action.
- Provide “not sure”/skip behavior and avoid inferring diagnoses from sparse evidence.

**Non-goals**

- Medical, cognitive, or learning-disability diagnosis.
- Punishment, public comparison, or endless drills.
- Capturing the learner’s source/recall content in analytics.

**Dependencies**

T12

**Acceptance criteria**

- Each supported error type has a documented deterministic mapping to an exercise, rationale, estimated duration, success condition, and next action.
- During repair recall, source material is absent from the visual and accessibility trees.
- A successful re-attempt records the repaired error and review schedule exactly once; skipping records no false success.
- Unsupported/ambiguous evidence uses a neutral generic practice rather than a diagnosis.
- Existing results, reviews, projects, and unrelated `memoryDojo.v1` fields survive reload, export/import, and upgrade.
- At 320, 375, 768, 1024, and 1440 pixels, explanation, exercise, hint, re-attempt, error, skip, and success states have no overflow, clipping, overlap, collisions, or escaped controls.
- Keyboard/focus, wrapping/zoom, reduced-motion, light/dark WCAG AA contrast, storage, and navigation checks pass.

**Required tests**

- Unit-test mapping, scoring, duplicate prevention, scheduling, ambiguous evidence, and skip paths for every supported error type.
- Add browser journeys proving source hiding in the accessibility tree, focus movement, repair, re-attempt, reload, and return navigation.
- Run storage-preservation/export-import and navigation regression suites.
- Run responsive visual, overflow, long-copy wrapping, keyboard/focus, reduced-motion, and light/dark contrast checks at all five widths.

**Likely affected components**

- Learning/scoring module, repair rules and exercise data, training/review renderers, scheduler, storage, Today coaching integration.

## T14 — Add an opt-in installable/offline and reminder experience

**Objective**

Let learners deliberately install the app, complete supported practice offline, and opt into respectful reminders without blocking the web experience.

**Scope**

- Add a valid manifest, service worker with explicit versioned caching/update/recovery behavior, offline status and supported-route messaging, and a user-initiated install action.
- Add granular reminder permission, scheduling/preferences, quiet hours, pause/disable, deep-link handling, and privacy-safe generic notification text.
- Preserve local-first data and reconcile deferred actions without duplicate results/reviews when connectivity returns.

**Non-goals**

- Automatic permission prompts, sign-in requirements, guaranteed background delivery, or notification content containing memoranda.
- Caching credentials, private cloud responses, or indefinite stale application shells.
- Making installation or reminders prerequisites for any learning feature.

**Dependencies**

T13

**Acceptance criteria**

- The web experience remains fully usable after declining install and notification prompts, and no permission prompt appears without a learner action.
- The installed app launches the canonical shell with correct name/icons/theme and passes the chosen installability audit.
- Documented supported journeys work after a clean online load followed by offline mode; unsupported routes show a useful retry/back action.
- An update cannot mix incompatible shell/assets and provides a recoverable refresh path without deleting `memoryDojo.v1` data.
- Reminder opt-in, schedule, quiet hours, deep link, pause, disable, denied-permission, and unavailable-platform states behave as documented; notification bodies contain no learner material.
- At 320, 375, 768, 1024, and 1440 pixels, install/offline/update/reminder states have no overflow, clipping, overlap, collisions, or competing actions.
- Keyboard/focus, wrapping/zoom, reduced-motion, light/dark WCAG AA contrast, storage preservation, and navigation regressions pass.

**Required tests**

- Run manifest/service-worker validation, installability audit, cache-version/update, stale-cache recovery, and offline critical-journey tests.
- Test notification permission granted/denied/default, quiet hours, pause/disable, generic content, and deep links without sending production notifications.
- Simulate offline writes and reconnection; assert no duplicated result/review and full unrelated-storage preservation.
- Run keyboard/focus and responsive visual, overflow, wrapping, reduced-motion, and light/dark contrast checks at all five widths.

**Likely affected components**

- Web app manifest and icons, service worker/cache policy, canonical shell registration, offline/update UI, reminder preferences/scheduler, Settings, storage reconciliation.

## T15 — Run release-candidate QA, accessibility verification, and a small-cohort pilot

**Objective**

Prove the release candidate is usable, accessible, reliable, safe, and valuable before publication.

**Scope**

- Freeze one candidate commit/artifact; run all static, browser, visual, storage, navigation, offline/install, security, privacy, and accessibility gates.
- Perform WCAG 2.2 AA-oriented manual verification with keyboard, screen reader, zoom/reflow, focus, contrast, motion, errors, and status announcements.
- Run a consented small-cohort pilot using T10 measures, scripted tasks, support/escalation, withdrawal, deletion, and stop criteria; triage findings without exposing participant data.

**Non-goals**

- Changing features during evidence collection without cutting and retesting a new candidate.
- Claiming statistical significance from a small cohort.
- Shipping known critical/high defects or overriding accessibility blockers for schedule reasons.

**Dependencies**

T999

**Acceptance criteria**

- One immutable candidate identifier maps to every test result, screenshot, accessibility report, pilot build, and approval.
- All required automated suites pass twice from clean state and no unresolved critical/high security, privacy, data-loss, accessibility, or critical-journey defect remains.
- Manual checks pass at 320, 375, 768, 1024, and 1440 pixels with no overflow, clipping, overlap, collisions, escaped controls, focus loss, unreadable wrapping, or WCAG AA contrast failure in light/dark and reduced-motion modes.
- Existing-storage upgrade, reload, export/import, navigation, back/forward, offline/reconnect, and update paths preserve fixture data without duplicates.
- Every pilot participant has recorded consent, can withdraw/delete data, receives no real-password prompt, and completes or exits each scripted task without being trapped.
- Pilot results are reported against predeclared T10 thresholds; a missed stop/release threshold blocks T16 or triggers a new candidate.
- Product, engineering, accessibility, privacy/security, and release owners record binary approval for the same candidate.

**Required tests**

- Run all T04–T14 automated suites twice against the immutable release artifact.
- Execute the complete visual matrix at all five widths in light/dark and reduced-motion modes, including empty, error, offline, update, maximum-content, and success states.
- Complete keyboard-only, visible-focus, screen-reader, 200% and 400% zoom/reflow, contrast, target-size, error-identification, and status-announcement checks.
- Run storage-preservation, migration, export/import, navigation, history, offline/reconnect, update, and clean-install regressions.
- Execute the approved pilot protocol and independently verify consent, withdrawal/deletion, issue logs, and threshold calculations.

**Likely affected components**

- Release artifact and evidence bundle, full application/test matrix, accessibility conformance report, pilot protocol/results, defect register, release approvals.

## T16 — Publish the release and establish post-release monitoring

**Objective**

Publish the exact approved artifact safely, verify production, and operate proportionate learning/reliability monitoring with rollback readiness.

**Scope**

- Tag and deploy the immutable T15 candidate through protected automation; publish release notes, known limitations, privacy/accessibility/support information, and rollback instructions.
- Run production smoke checks and monitor only the approved T10 signals for availability, errors, critical-journey completion, data integrity, accessibility/support reports, and opt-in learning outcomes.
- Assign alert owners, thresholds, review cadence, incident/rollback criteria, data-retention jobs, and a post-release review date.

**Non-goals**

- Rebuilding or editing the candidate during deployment.
- Enabling unapproved telemetry, forced installation/reminders, or experiments outside pilot consent.
- Treating engagement volume as evidence of learning success.

**Dependencies**

T15

**Acceptance criteria**

- The production asset checksum/commit and displayed `VERSION` exactly match the T15-approved artifact and signed release tag.
- Production `/`, legacy entry paths, unknown-path fallback, deep links, four-item navigation, first success, return/resume, handbook, project, review/repair, offline, and settings smoke checks pass.
- New and returning synthetic fixtures retain data through production reload and update; no production test writes contain personal or secret material.
- Alerts have numeric thresholds, destinations, named owners, and tested escalation/rollback procedures; a test alert is acknowledged within the documented window.
- Monitoring collects only T10-approved fields, honours opt-out/deletion/retention, and exposes no recall content or credentials.
- At 320, 375, 768, 1024, and 1440 pixels, production smoke states pass overflow, clipping, wrapping, focus, reduced-motion, and light/dark WCAG AA contrast checks.
- A dated post-release review compares reliability, accessibility/support, and ethical learning measures with predeclared thresholds and records continue/fix/rollback decisions.

**Required tests**

- Verify tag/signature, artifact checksum, production headers/assets, displayed version, cache update, and rollback artifact before and after deployment.
- Run a read-safe production critical-journey smoke suite plus navigation/history and synthetic storage-preservation checks.
- Run production keyboard/visible-focus, overflow/wrapping, reduced-motion, and computed light/dark contrast smoke checks at all five widths.
- Trigger a synthetic monitor alert and rehearse incident escalation and rollback without learner data loss.
- Audit production event samples, consent states, deletion, and retention expiry against the T10 schema and prohibited-field rules.

**Likely affected components**

- Release tag/notes, deployment workflow and hosting, production cache/service worker, monitoring/alerts, support and incident runbooks, post-release review record.
