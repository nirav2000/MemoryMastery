# Version archive

Memory Mastery should keep a lightweight version archive, but it should not copy every historical static build into the live GitHub Pages bundle by default. The app contains large JSON curriculum files, so duplicating every old version would quickly make the repository heavy and would expose learners to obsolete flows.

The archive now has two layers:

1. `data/version-archive.json` — a learner- and maintainer-readable release ledger generated from meaningful commits.
2. Git history/tags — the canonical way to reconstruct an old build when needed.

## Recommended workflow

Tag important milestones:

```bash
git tag archive/v0-first-static-app 2ea5e55
git tag archive/v1-first-success 067a2fc
git tag archive/v2-clean-design-system 238ded7
git tag archive/v3-detail-quality 0e1f1d5
```

Inspect or serve a historical version without changing the main working tree:

```bash
git worktree add ../MemoryMastery-2ea5e55 2ea5e55
python3 -m http.server 8000 --directory ../MemoryMastery-2ea5e55
```

If a specific historical build must be published permanently, create a small `archive/vX/` copy for that milestone only, document why it matters, and avoid including every patch release.

## Inclusion criteria

Archive a version when it changes the learner journey, storage format, navigation model, Firebase sync behaviour, or major visual direction. Do not archive tiny copy or spacing changes unless they explain an important quality lesson.

## Current decision

The app exposes a Version archive screen from Settings. It explains key changes and links each milestone to its GitHub commit. This gives traceability without bloating the live app.
