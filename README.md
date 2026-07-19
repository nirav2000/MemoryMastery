# Memory Mastery

Memory Mastery is a mobile-first, install-free memory training programme. It turns memory techniques into an 84-day deliberate-practice curriculum with source-hidden recall, honest scoring, error diagnosis, practical missions, delayed review, belt examinations, and editable mnemonic libraries.

> **Identity:** I notice, encode, place, retrieve and review.

The app is plain HTML, CSS and modular JavaScript. It has no npm dependencies, build step, server, framework, or generated bundle. It works immediately in guest mode and is suitable for editing through GitHub on an iPad.

## What is included

- Eight martial-arts belts from White foundations to Black integration, including requirements, targets, exams, badges and remediation.
- Four phases: toolkit building, core training, real-life application, and mastery/maintenance.
- **84 complete daily sessions** with supplied material, technique, time limit, targets, mission and reflection.
- Daily flow: retrieval warm-up → technique drill → supplied challenge → hidden-source recall → automatic scoring → error review → real-life mission → scheduled delayed review.
- Review queue beginning at 20 minutes and progressing through 1, 3, 7 and 30 days; weak recall shortens the interval.
- Editable example 10-locus home palace, full 00–99 Major System, 25-symbol bank, PAO and name-image builders.
- Local analytics based on transparent rules (never pretend-AI), printable A4 warm-up poster, JSON backup/import, Major System CSV and results CSV.
- Accessible tap targets, keyboard-friendly forms, responsive iPhone/iPad layouts, light/dark themes, reduced-motion support and confirmation before destructive actions.
- Public Firebase configuration template plus owner-isolated Firestore rules.

## Quick start (including iPad)

### GitHub Pages

1. Fork or open this repository in GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose `main`, `/ (root)`, then **Save**.
5. Open the Pages URL and bookmark it. No compilation is needed.

Changes made in GitHub's web editor can be committed directly. Refresh the Pages site after the deployment check completes. JSON syntax must remain valid; a missing comma can prevent startup.

### Run locally

Browsers block JSON `fetch()` from `file://`, so serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Any simple static server works.

## First user journey

1. Open **Today** and choose **Memorise something useful**.
2. Pick a beginner challenge such as a shopping list or metric conversions.
3. Look once, hide the list, and recall what you can without judgement.
4. Build a vivid image story one link at a time.
5. Retest with the source hidden and compare before-and-after recall.
6. Save the success, choose a personal memory project, and complete the quick reminder when it appears.
7. Later, use **Library** for palaces, Major System, PAO and other advanced tools.

Progress is preserved in `localStorage` after refresh. Export a JSON backup before clearing browser data or changing devices.

## Firebase setup

Firebase is optional. Guest mode is the default and requires no account.

1. At [Firebase Console](https://console.firebase.google.com/), create a project.
2. Add a **Web app** (the `</>` icon); no Hosting setup is required for GitHub Pages.
3. In **Authentication → Sign-in method**, select **Google**, switch it to **Enable**, choose a support email, and save. Memory Mastery currently implements Google sign-in in the frontend.
4. In **Authentication → Settings → Authorized domains**, add the GitHub Pages host for this site, for example `nirav2000.github.io`. Keep `localhost` for local testing.
5. In **Firestore Database**, create a database in production mode and choose the nearest region.
6. Copy the web configuration values into `js/firebase.js`.
7. Install the Firebase CLI only on a machine where you want to deploy rules, then run:

   ```bash
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,firestore:indexes
   ```

The Firebase web configuration is **public by design**, not a secret. Do not put an admin key or service-account file in this repository. Authentication plus `firestore.rules` protects user data. The provided model stores private records below `users/{uid}/...`, and rules only allow that authenticated UID to access them.

The **Sign in** button uses Firebase Authentication with the Google provider. On first sign-in the app asks before saving guest data to `users/{uid}/app/state`; if a cloud backup already exists it asks before loading it onto the device. The included frontend remains fully functional if Firebase is not configured or temporarily unavailable.


### SmartPaper-inspired redesign

The default experience is now organised around a user-first learning journey. New users start with one dominant action — memorise something useful — then choose a beginner challenge, make a no-pressure baseline attempt, learn one method interactively, retest from memory and choose a personal memory project. The app shell uses a calm SmartPaper-inspired visual system with four primary routes: Today, Learn, Library and Progress.

## Changing themes and look

Open **Profile → Settings and data → Appearance** to choose:

- **Colour theme**: Pastel paper, Pastel mint, Pastel lavender, Pastel sunset, Classic dojo, Ocean focus, Forest calm, Plum study, or High-contrast mono.
- **Layout and look**: SmartPaper inspired, Classic sidebar cards, Top navigation workspace, Focus mode, Soft rounded panels, Compact study dashboard, or Minimal notebook.
- **Light / dark** mode with the header button or the Profile settings button.

The main app now uses four primary navigation items. Account, export, theme and training-contract options live behind Profile/Settings so the first screen stays focused on the next learning action. These preferences are stored in the same guest backup and sync to Firestore after Google sign-in.


## Product structure

- **Today**: one recommended next action, why it matters, expected time and what happens next.
- **Learn**: guided first-success journey, daily curriculum, review queue and Memory Handbook.
- **Library**: personal projects and advanced tools including palaces, Major System, PAO, symbols and name images.
- **Progress**: retention history, review queue and belt/exam progression.

Advanced tools are preserved, but they are progressively disclosed after the learner has a reason to use them.

## Data model

Recommended paths, all nested under `users/{uid}` unless noted:

| Collection | Purpose |
|---|---|
| `profiles`, `settings` | identity, current belt/day, preferences and contract |
| `dailySessions`, `results` | attempts, timing, accuracy and error categories |
| `palaces`, `palaceLocations` | routes, loci and interference metadata |
| `majorSystem`, `paoSystem`, `symbolBank`, `nameImages` | personal encoding libraries |
| `memorySets`, `reviews` | source sets and spaced-retrieval state |
| `beltExams`, `achievements` | eligibility, attempts, delayed results and badges |
| `realLifeMissions`, `masteryProjects` | practical use and long-term projects |

Seed curriculum and belt definitions are shipped as version-controlled static JSON. If shared Firestore curriculum is later enabled, expose it read-only under `publicCurriculum`.

## Editing the programme

- `data/curriculum.json`: 84 sessions. Each requires `day`, `week`, `title`, `belt`, `phase`, `goal`, `materialType`, `material`, `technique`, `timeLimitMinutes`, both targets, `mission`, and `reflection`.
- `data/belts.json`: belt skills, assignments, targets, exams, badges and unlock rules.
- `data/starter-major-system.json`: complete 00–99 defaults. A learner's edited values are stored locally, never written back to this file.
- `data/starter-symbols.json`: 25 editable mnemonic concepts.
- `data/real-life-missions.json`: 34 practical missions and safety note.
- `data/example-palace.json`: initial palace route.

Validate a file after editing with `python3 -m json.tool data/curriculum.json`, or paste it into a trusted JSON validator on iPad. Keep day numbers contiguous from 1 to 84.

## Backup and restore

Open **Settings & data**:

- **Export JSON backup** captures all guest data.
- **Import JSON** validates the schema version and asks before replacement.
- **Results CSV** and the Major System's **Export CSV** open in spreadsheet apps.
- Browser print produces a progress view; the Warm-up Poster has dedicated A4 portrait styles.

Imports intentionally never merge or overwrite without a warning. Keep dated exports in secure personal storage; they may contain names and learning material.

## File structure

```text
.
├── index.html                 # application shell
├── app.html / 404.html        # friendly entry and Pages fallback
├── css/
│   ├── styles.css             # responsive dojo design and dark mode
│   └── print.css              # A4/poster and report rules
├── js/
│   ├── app.js                 # router, screens, builders and events
│   ├── training.js            # source-hidden recall and scoring
│   ├── reviews.js             # spaced-review scheduler
│   ├── storage.js             # versioned localStorage repository
│   ├── firebase.js            # public Firebase configuration/loader
│   └── utils.js               # safe rendering, averages and downloads
├── data/                      # editable programme configuration
├── firestore.rules
├── firestore.indexes.json
├── ChatGPT_response.txt       # original programme response
└── Memory_Mastery_Programme.pdf
```

## Troubleshooting

- **Blank page / “Failed to fetch”:** do not open `index.html` with `file://`; use GitHub Pages or a local static server.
- **Edits do not appear:** wait for the Pages Actions deployment, then force-refresh. A previously seeded user's starter data remains their editable copy; export/reset only if you intend to reseed it.
- **Progress disappeared:** localStorage is specific to browser, profile and domain. Import the latest JSON backup.
- **Firebase connection failed:** confirm config values, authorized domains, enabled provider, Firestore creation and deployed rules. Guest mode continues working.
- **Permission denied:** verify the document is below `users/{signed-in UID}`; never weaken rules to make an error disappear.
- **Import rejected:** only version-1 Memory Dojo backups containing a profile and results array are accepted.
- **Print is not A4:** choose A4 portrait, 100% scale and browser background graphics if desired.

## Security and product limits

Memory Dojo intentionally warns against relying on memory for passwords, medication, allergy, emergency, or other safety-critical information. This static app cannot send background notifications while closed. Reviews are surfaced as due the next time it opens. Uploaded palace photographs are not included in the first local-only release because large images can exhaust browser storage; use textual distinctive-feature notes instead.

Suggested enhancements are opt-in browser notifications, richer face-test media with consent, full cloud CRUD/migration UI, service-worker offline caching, and WebAuthn-friendly authentication. None should weaken the owner-isolated rules or turn completion clicks into a substitute for retrieval performance.
