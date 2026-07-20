# Major System asset audit

## Scope inspected

- `data/starter-major-system.json` contains all 100 number rows, with `defaultImage` peg words from `00` through `99`.
- `assets/` previously contained only six generic tool-level SVGs: `tool-palace.svg`, `tool-major.svg`, `tool-pao.svg`, `tool-symbols.svg`, `tool-names.svg`, and `tool-contract.svg`.
- `js/app.js` rendered Major System cards with `memoryThumb(...)`, a procedural inline SVG helper that mapped many labels onto a small set of reusable icon path types.

## Hash inventory before the new scene batch

| File | SHA-256 prefix | Note |
| --- | --- | --- |
| `assets/tool-contract.svg` | `1afd676590ce` | Generic tool illustration, not a number scene. |
| `assets/tool-major.svg` | `1bcfd19785cf` | Generic Major System tool illustration. |
| `assets/tool-names.svg` | `b296e159aaf0` | Generic tool illustration, not a peg scene. |
| `assets/tool-palace.svg` | `b4cd64eb952f` | Generic tool illustration, not a palace-location scene. |
| `assets/tool-pao.svg` | `a399a5dac49f` | Generic tool illustration, not a PAO entry scene. |
| `assets/tool-symbols.svg` | `cc9b5c8f4ca7` | Generic tool illustration, not a symbol-bank scene. |

## Duplicate / near-duplicate finding

There were no existing `00`–`99` image files to compare. The repetitive result came from implementation rather than duplicated files: many different peg words were passed through a single `memoryThumb()` renderer and collapsed into a few repeated SVG silhouettes. That made `sauce`, `seed`, palace locations and other pegs look like variations of the same abstract badge instead of unmistakable mnemonic scenes.

## Corrective direction

The new architecture separates mnemonic content from rendering:

1. `data/major-system-scenes.json` stores the multisensory scene specification and prompt for every number.
2. Only `00`–`09` are marked `reference-approved` with hand-prepared SVG reference assets.
3. `10`–`99` remain explicit `pending` entries until each receives a distinct scene, candidate image generation, review and approval.
4. Validation scripts check mapping correctness, missing fields, copied prompts and duplicate or suspiciously similar assets before assets are accepted.
