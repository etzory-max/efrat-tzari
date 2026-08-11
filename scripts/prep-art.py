"""
Cuts the three figures out of the illustration sheet and preps the new hero.

  python scripts/prep-art.py

The sheet is line art on white. Splitting it into thirds is not reliable —
the figures are not evenly spaced — so the columns are found from where ink
actually appears, then each figure is trimmed to its own bounds and given a
transparent background.
"""

import numpy as np
from PIL import Image

SHEET = "public/images/Gemini_Generated_Image_hn8fruhn8fruhn8f.png"
NAMES = ["kid-ball", "kid-blocks", "kids-table"]

sheet = Image.open(SHEET).convert("RGB")
arr = np.asarray(sheet).astype(np.int16)
# Ink is anything meaningfully darker than the white page.
ink = arr.min(axis=2) < 225
cols = ink.any(axis=0)

# Group the occupied columns into runs, merging gaps narrower than a figure.
runs, start = [], None
gap = 0
for x, filled in enumerate(cols):
    if filled:
        if start is None:
            start = x
        gap = 0
    elif start is not None:
        gap += 1
        if gap > 120:
            runs.append((start, x - gap))
            start, gap = None, 0
if start is not None:
    runs.append((start, len(cols) - 1))

runs = sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[:3]
runs = sorted(runs)
print("figure columns:", runs)

for name, (x0, x1) in zip(NAMES, runs):
    band = ink[:, x0 : x1 + 1]
    ys = np.where(band.any(axis=1))[0]
    y0, y1 = ys.min(), ys.max()
    pad = 12
    box = (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(sheet.width, x1 + 1 + pad),
        min(sheet.height, y1 + 1 + pad),
    )
    crop = np.asarray(sheet.crop(box)).astype(np.int16)

    # White page -> transparent, with the alpha ramped so the strokes keep
    # their soft edges instead of turning into jagged pixels.
    lightness = crop.max(axis=2)
    alpha = np.clip((248 - lightness) / 40, 0, 1)
    out = np.dstack([crop.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    img = Image.fromarray(out, "RGBA")
    img.thumbnail((900, 900), Image.LANCZOS)
    img.save(f"public/images/art-{name}.png")
    print(f"  art-{name}.png {img.size}")

# ---- new hero -------------------------------------------------------------
hero = Image.open("public/images/photo-1666028160176-32cfa65a5adf.avif").convert("RGB")
hero.thumbnail((1920, 1920), Image.LANCZOS)
hero.save("public/images/hero-hug.jpg", quality=84, optimize=True, progressive=True)
print(f"hero-hug.jpg {hero.size}")
