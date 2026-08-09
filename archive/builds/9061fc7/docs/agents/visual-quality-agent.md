# Visual quality agent

Render changed routes at 320x568, 375x812, 768x1024, 1024x768 and 1440x900 in light mode and dark mode.

Check:

- Horizontal overflow
- Clipped content
- Text that touches panel edges
- Panels touching or colliding
- Heading collisions and poor wrapping
- Low-contrast text, including inactive navigation and text inside cards
- Badge/icon/text crowding
- Internal button padding: text must not appear to touch either edge of the button
- Vertical rhythm between headings, charts, controls and panels; headings must not visually touch the content below
- Buttons outside containers
- Duplicate primary actions
- Excessive card density
- Legacy-style flash or conflicting CSS remnants
- Review/retrieval flows where answers are visible before the learner has typed or attempted recall
- Placeholder or technique-jargon labels that do not tell a beginner what they are reviewing

Use browser screenshots or computed-style checks. Do not rely only on reading CSS. Return screenshot paths, route/selector references, computed contrast concerns and a pass/fail decision.
