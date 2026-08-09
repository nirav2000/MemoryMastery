# Memory Mastery product audit and implementation plan

## Current routes inspected

Before implementation the app exposed a large tool-led route set: `#dashboard`, `#train`, `#reviews`, `#progress`, `#palaces`, `#major`, `#pao`, `#symbols`, `#names`, `#belts`, `#guidance`, `#contract`, `#poster` and `#settings`.

## Existing data structures and dependencies

- Static JSON data: belts, 84-day curriculum, programme phases, starter Major System images, starter symbols and one example palace.
- Local data: `memoryDojo.v1` in `localStorage`, containing profile, palaces, Major System, PAO, symbol bank, name images, results, reviews, missions, achievements and settings.
- Cloud data: optional Firebase web client writes/reads a user backup at `users/{uid}/app/state`.

## Existing training and review logic

- `js/training.js` provides source-hidden recall, line-by-line scoring and creation of review material.
- `js/reviews.js` schedules 20-minute, 1-day, 3-day, 7-day and 30-day style intervals and adjusts interval strength from review scores.

## Features preserved

- Guest mode and local backup/import/export.
- Optional Google sign-in and Firestore backup.
- 84-day curriculum and daily training route.
- Review queue and scoring.
- Memory palaces, Major System, PAO, symbol bank and name images.
- Belts/exams, poster and training contract.

## Issues found

- First impression exposed a tool dashboard before the user had a success experience.
- Navigation contained too many primary items and surfaced advanced memory-athlete systems too early.
- Beginner learning journey was missing: no baseline attempt, interactive method teaching or post-success explanation.
- Handbook content was too short for a reference area.
- CSS was highly compressed with duplicated/conflicting visual modes, making layout QA harder.
- Mobile navigation risked horizontal density and did not act as a four-item bottom navigation.

## Implementation plan

1. Preserve existing data and business logic.
2. Add a non-destructive `firstSuccess` object to local state for the beginner journey.
3. Reduce primary navigation to Today, Learn, Library and Progress.
4. Move account/settings/export/profile actions into Settings/Profile.
5. Rebuild Today around one recommended next action.
6. Add a guided first-success challenge flow under Learn.
7. Move advanced tools into Library and belts/analytics into Progress.
8. Expand the Memory Handbook structure without forcing it into onboarding.
9. Add design-system tokens and mobile-first layout rules at the CSS layer.
10. Run syntax checks, smoke tests and visual screenshots at required breakpoints.

## Migration notes

No existing records are removed or renamed. Existing users keep their local `memoryDojo.v1` data. New versions may add `firstSuccess`; older backups remain valid because missing properties are treated as incomplete first-success state.
