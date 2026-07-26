# Version archive

Memory Mastery now keeps a developer-facing full archive for significant commits. The archive is intended for maintainers to compare historical UI/data behaviour quickly, not as part of the everyday learner journey.

The archive now has three layers:

1. `data/version-archive.json` — a maintainer-readable release ledger generated from meaningful commits.
2. `archive/index.html`, `archive/screenshots/*.png` and `archive/builds/<commit>/` folders — full static copies plus first-load screenshots for visual comparison of important versions.
3. Git history/tags — the canonical way to reconstruct any unarchived patch when needed.

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

When a commit significantly changes the learner journey, storage, Firebase sync, navigation, visual direction, or developer-analysis value, create a full `archive/builds/<commit>/` copy, capture `archive/screenshots/<commit>.png`, and document why it matters in `data/version-archive.json`. Archived builds include a banner warning that the flow may be obsolete and a `?useLatestData=1` option that redirects compatible `data/*.json` requests to the current data files.

## Inclusion criteria

Archive a version when it changes the learner journey, storage format, navigation model, Firebase sync behaviour, major visual direction, or is useful for developer comparison. Every archived version should have both a full static copy and a first-load screenshot. Truly trivial commits can remain available through Git history only.

## Current decision

The app exposes the Version archive screen only after sign-in as the developer account `myaeixa@gmail.com`. It explains key changes, links each milestone to its GitHub commit, shows first-load screenshots, and opens full static builds. The footer link is hidden from ordinary learner sessions.
