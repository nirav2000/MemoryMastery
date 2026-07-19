# Product-quality review consolidation

## Specialist review inputs

### Agent 1: UX researcher

- Critical issue: the first-success journey existed, but still felt too much like a form-based test instead of a coached learning moment.
- High-impact issues: everyday challenges should come first, pre-success Today should not show lessons/reviews/progress, and the result should celebrate improvement rather than percentage alone.
- Medium issues: early jargon such as retrieval/review queue should be softened, the source-hiding step needed clearer state, project selection should be part of the success moment, and product naming should be consistent.

### Agent 2: Information architect

- Primary navigation should remain four items: Today, Learn, Library and Progress.
- Beginner features belong in Today and Learn; intermediate practice belongs in Learn and Reviews; advanced systems belong in Library; analytics, belts and exams belong in Progress.
- Dashboard information that is not the next action should move out of the first-time Today view.
- Handbook content should be reference material after practice, not a prerequisite before the first success.

### Agent 3: Visual design reviewer

- Review target: every route at 320, 375, 768, 1024 and 1440 pixel widths.
- Known risk areas before implementation: the mobile bottom navigation at 320px, dense builder pages, long headings, repeated cards, and source/recall panels.
- Required re-check after implementation: dashboard, learn, library, progress, train, reviews, palaces, major, PAO, symbols, names, belts, guidance, contract, poster and settings.

### Agent 4: Accessibility reviewer

- Preserve skip link, labelled controls and visible focus.
- Improve current-page semantics with `aria-current` on active navigation.
- Avoid relying on `<details>` for the critical first-success source-hiding state.
- Ensure hidden source material is actually hidden from the visual and accessibility tree during recall.
- Preserve 44px touch targets and keyboard focus after source hiding.

### Agent 5: Content designer

- Use one product name: Memory Mastery.
- Prefer beginner language before formal method language: “try from memory” before “retrieval practice”, “quick reminder” before “delayed review”.
- Reassure the learner during baseline: guessing is fine, blanks are acceptable, spelling does not need to be perfect.
- Result copy should frame progress as improvement, not failure.
- Continue to warn users not to store real passwords in the app.

### Agent 6: Front-end architect

- Preserve the existing local-storage key and data structure.
- Extract repeated scoring into a small reusable learning module rather than duplicating scoring logic in onboarding and daily training.
- Keep advanced rendering functions intact for now, but avoid adding more giant duplicated scoring code.
- Add static regression checks for primary navigation, advanced-tool disclosure, first-success source hiding, first-success review scheduling and storage migration.

## Consolidated priority ranking

1. Make the first-success flow feel coached, not judged.
2. Hide pre-success dashboard noise so Today has one clear next action.
3. Put everyday beginner challenges first.
4. Replace textarea-only beginner recall with item-by-item recall fields.
5. Celebrate baseline-to-final improvement and schedule the first quick reminder.
6. Move project choice into the success moment.
7. Fix product naming and clearer Settings labelling.
8. Add regression checks for learning flow, storage and navigation.
9. Re-run visual QA at the required routes and breakpoints.

## Implementation decisions

- Kept the four primary routes unchanged: Today, Learn, Library and Progress.
- Preserved all advanced tools and data; moved no user data and removed no stored fields.
- Added `js/learning.js` for shared recall scoring and first-success review material.
- Updated first-success recall to use item-by-item inputs with source hidden before recall.
- Kept the existing daily training flow, but reused the same scoring helper for consistency.
- Added CSS only for the new learning components and layout safety fixes.

## Remaining limitations

- The app still contains compressed legacy CSS and several long render functions. Further decomposition would improve maintainability but was not required to fix the highest-impact learner issues.
- Handbook chapters are structurally present; future work should deepen each chapter with unique examples and exercises.
