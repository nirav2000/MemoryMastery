# Memory Mastery repository instructions

## Product principle

Design for the learner’s next useful action, not for exposure of every available feature.

A successful screen helps the user understand:

1. What to do
2. Why it matters
3. How long it will take
4. Whether they succeeded
5. What to do next

## UX rules

* One dominant action per screen.
* No more than four primary navigation items.
* Use progressive disclosure.
* Keep advanced memory-athlete tools out of beginner onboarding.
* Prefer guided practice before theory.
* Explain a method fully after the user has experienced it.
* Never require sign-in before the first useful experience.
* Never encourage storage of real passwords.
* Prefer calm, spacious screens over dashboards.
* Move analytics away from the main learning task.
* Do not surround every content block with a card.
* Do not add visual decoration without a functional purpose.

## Responsive design rules

Test all changed views at widths of 320, 375, 768, 1024 and 1440 pixels.

Reject a change if it causes:

* Horizontal overflow
* Clipped content
* Touching panels
* Overlapping text
* Heading collisions
* Unreadably narrow cards
* Buttons outside their containers
* More than two important actions competing in one region

Use at least:

* 16px spacing between distinct elements on mobile
* 24px between independent panels on desktop
* 44px interaction targets
* 68ch maximum prose width

Long headings must wrap normally. Do not solve heading collisions by shrinking text to an unreadable size.

## Visual design rules

* Use one coherent design system.
* Use restrained colours and shadows.
* Typography and spacing should create the hierarchy.
* Avoid generic SaaS-dashboard styling.
* Avoid excessive gradients and rounded containers.
* Use animation only to explain change, establish continuity or celebrate genuine progress.
* Support reduced motion.
* Meet WCAG AA contrast.

## Code rules

* Preserve existing user data.
* Do not remove functionality without documenting it.
* Prefer small named rendering functions over very large template strings.
* Escape user-controlled content.
* Keep content separate from layout where practical.
* Avoid duplicate CSS selectors and conflicting appearance modes.
* Add automated tests for important learning and review flows.
* Add regression checks for navigation and storage.

## Required quality process

For any interface change:

1. Inspect the existing route and neighbouring routes.
2. State the user problem being solved.
3. Implement the smallest coherent change.
4. Render the application.
5. Inspect it visually at all required breakpoints.
6. Check keyboard navigation and visible focus.
7. Check overflow and text wrapping.
8. Fix confirmed problems.
9. Report exactly what was tested.

Do not declare a visual task complete based only on successful compilation.
