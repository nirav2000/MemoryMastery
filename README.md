# Memory Dojo

Memory Dojo is a mobile-first, install-free memory training programme. It turns memory techniques into an 84-day deliberate-practice curriculum with source-hidden recall, honest scoring, error diagnosis, practical missions, delayed review, belt examinations, and editable mnemonic libraries.

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

1. Open **Today** and choose **Continue Day 1**.
2. Do the retrieval warm-up without studying first.
3. Study the supplied material and press **I’m ready — hide material**.
4. Enter one answer per line. The app reports correct, incorrect, omitted and order errors.
5. A 20-minute delayed review appears in **Reviews** automatically.
6. Open **Palaces** to edit the supplied Home Entrance route or add a palace.
7. Complete and save the editable contract under **Training contract**.

Progress is preserved in `localStorage` after refresh. Export a JSON backup before clearing browser data or changing devices.

## Firebase setup

Firebase is optional. Guest mode is the default and requires no account.

1. At [Firebase Console](https://console.firebase.google.com/), create a project.
2. Add a **Web app** (the `</>` icon); no Hosting setup is required for GitHub Pages.
3. In **Authentication → Sign-in method**, enable the provider you plan to use. Add your GitHub Pages domain to **Authentication → Settings → Authorized domains**.
4. In **Firestore Database**, create a database in production mode and choose the nearest region.
5. Copy the web configuration values into `js/firebase.js`.
6. Install the Firebase CLI only on a machine where you want to deploy rules, then run:

   ```bash
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,firestore:indexes
   ```

The Firebase web configuration is **public by design**, not a secret. Do not put an admin key or service-account file in this repository. Authentication plus `firestore.rules` protects user data. The provided model stores private records below `users/{uid}/...`, and rules only allow that authenticated UID to access them.

Guest-to-cloud migration should always be offered explicitly at first sign-in: export a local backup, verify that the destination is the expected account, and never silently overwrite existing cloud documents. The included frontend remains fully functional if Firebase is not configured or temporarily unavailable.

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
