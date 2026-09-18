"""
Cuts the four marks for the timeline in "אם זה הבית שלך" out of one sheet.

  python scripts/prep-day-icons.py <sheet.jpg>

Same treatment as prep-walk.py - page to transparent, strokes repainted in
accent-ink at an opacity taken from how dark they were - because the sheet
arrives just as pale, and these render smaller still.

The four are found from where ink actually falls rather than by slicing the
sheet into quarters: they are not evenly spaced, and the shirt-and-shoes is
much wider than the blocks. Left to right on the sheet is first to last down
the timeline, which is also the order the moments are written in.
"""

import sys

import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/images/day-icons-source.jpg"
NAMES = ["morning", "translate", "help", "collapse"]

INK = (0x9C, 0x4C, 0x2E)
PAGE, FULL = 252, 186
# A gap narrower than this is inside one drawing, not between two.
SPLIT = 140

sheet = Image.open(SRC).convert("RGB")
lightness = np.asarray(sheet).astype(np.int16).max(axis=2)
alpha = np.clip((PAGE - lightness) / (PAGE - FULL), 0, 1)
inked = alpha > 0.06

runs, start, gap = [], None, 0
for x, filled in enumerate(inked.any(axis=0)):
    if filled:
        start = x if start is None else start
        gap = 0
    elif start is not None:
        gap += 1
        if gap > SPLIT:
            runs.append((start, x - gap))
            start, gap = None, 0
if start is not None:
    runs.append((start, sheet.width - 1))

runs = sorted(sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[: len(NAMES)])
if len(runs) != len(NAMES):
    raise SystemExit(f"found {len(runs)} drawings, expected {len(NAMES)}: {runs}")

for name, (x0, x1) in zip(NAMES, runs):
    band = alpha[:, x0 : x1 + 1]
    ys = np.where((band > 0.06).any(axis=1))[0]
    pad = 10
    y0, y1 = max(0, ys.min() - pad), min(sheet.height, ys.max() + 1 + pad)
    crop = band[y0:y1]

    flat = np.empty((*crop.shape, 4), dtype=np.uint8)
    flat[..., 0], flat[..., 1], flat[..., 2] = INK
    flat[..., 3] = (crop * 255).astype(np.uint8)

    out = Image.fromarray(flat, "RGBA")
    out.thumbnail((320, 320), Image.LANCZOS)
    out.save(f"public/images/day-{name}.png")
    print(f"  day-{name}.png {out.size}  from x[{x0},{x1}]")
