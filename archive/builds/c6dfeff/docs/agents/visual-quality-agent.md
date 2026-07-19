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
- Buttons outside containers
- Duplicate primary actions
- Excessive card density
- Legacy-style flash or conflicting CSS remnants

Use browser screenshots or computed-style checks. Do not rely only on reading CSS. Return screenshot paths, route/selector references, computed contrast concerns and a pass/fail decision.
