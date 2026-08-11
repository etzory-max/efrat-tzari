"""Cut the three line icons out of the supplied sheet.

The sheet is three drawings in a row with a Hebrew caption under each. The
captions are only there to tell us which icon goes where, so the first thing
we do is crop the caption band away; everything after that is the same
column-splitting trick prep-art.py uses.

The cards these sit on are terracotta, so the useful output is the white
variant — alpha taken from how dark the line is, colour forced to white.
"""

import numpy as np
from PIL import Image

SRC = "C:/Users/verca/Downloads/Gemini_Generated_Image_39uffz39uffz39uf.png"
OUT = "C:/Users/verca/efrat/public/images"

# Left-to-right on the sheet, matching the captions we were given.
NAMES = ["icon-whole-child", "icon-home-tools", "icon-continuous"]

img = Image.open(SRC).convert("L")
w, h = img.size
a = np.asarray(img, dtype=np.int16)

# --- drop the caption band -------------------------------------------------
# Rows with ink, then the last big run of blank rows before the captions.
row_ink = (a < 200).sum(axis=1)
inked = np.flatnonzero(row_ink > 0)
gaps = []
prev = inked[0]
for r in inked[1:]:
    if r - prev > 1:
        gaps.append((prev, r))
    prev = r
# The caption sits below the widest gap in the bottom third of the sheet.
band = max((g for g in gaps if g[0] > h * 0.55), key=lambda g: g[1] - g[0])
cut = (band[0] + band[1]) // 2
print(f"sheet {w}x{h} — cropping captions below y={cut}")

a = a[:cut]

# --- split into three columns ---------------------------------------------
col_ink = (a < 200).sum(axis=0)
cols = np.flatnonzero(col_ink > 0)
groups = []
start = prev = cols[0]
for c in cols[1:]:
    if c - prev > 150:          # wide blank = a real gap between icons
        groups.append((start, prev))
        start = c
    prev = c
groups.append((start, prev))
print("columns:", groups)
assert len(groups) == len(NAMES), f"expected 3 icons, found {len(groups)}"

for name, (x0, x1) in zip(NAMES, groups):
    strip = a[:, x0 : x1 + 1]
    rows = np.flatnonzero((strip < 200).sum(axis=1) > 0)
    y0, y1 = rows[0], rows[-1]
    pad = 8
    box = strip[max(0, y0 - pad) : y1 + 1 + pad]
    box = np.pad(box, ((0, 0), (pad, pad)), constant_values=255)

    # Soft edges: fully opaque at the core of the stroke, feathering out.
    alpha = np.clip((245 - box.astype(np.float32)) / 55.0, 0, 1) * 255

    ink = np.dstack(
        [np.full(box.shape, 92), np.full(box.shape, 62), np.full(box.shape, 40), alpha]
    ).astype(np.uint8)
    Image.fromarray(ink, "RGBA").save(f"{OUT}/{name}.png")

    white = np.dstack([np.full(box.shape + (3,), 255), alpha]).astype(np.uint8)
    Image.fromarray(white, "RGBA").save(f"{OUT}/{name}-light.png")

    print(f"{name}: {box.shape[1]}x{box.shape[0]}")
