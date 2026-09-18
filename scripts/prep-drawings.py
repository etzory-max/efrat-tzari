"""
Cuts every hand-drawn illustration out of the sheets it arrived on.

  python scripts/prep-drawings.py

The drawings come as brown pencil on white paper, and the brown is theirs -
an earlier pass repainted every stroke in --color-accent-ink, which threw away
the colour Ilan had chosen.

Keeping it is not simply a matter of copying the pixels across. A pencil stroke
on paper is ink mixed with white, so a mid-tone pixel is not "light brown", it
is the sheet's brown at partial coverage. Copy it as-is with partial alpha onto
the cream and it gets mixed with white twice, which is what turned the first
attempt to preserve the colour into something even paler than the repaint.

So each sheet is un-mixed instead. The ink colour is measured from its darkest
half percent of pixels, and every pixel is solved back to how much of that ink
it holds:

    C = a·K + (1-a)·255   ->   a = (255 - C) / (255 - K)

The result is the sheet's own ink at full strength with an alpha that carries
the shading, so the drawing looks on cream exactly as it looked on paper, and
would look right on any other ground too.

Sheets that hold several drawings are split at the valleys in their ink density
rather than at empty columns - on some of them the drawings touch.

`light` variants are the one place a repaint is still right: they sit on the
dark footer and on the slate band, where brown would disappear, so there the
drawing becomes a cream silhouette of itself.
"""

import numpy as np
from PIL import Image

SRC = "public/images"

# name -> (sheet, x range or None for the whole sheet, also emit a light copy)
CUTS = [
    ("art-mother-walk", "walk-source.jpg", None, False),
    ("art-hands-home", "hands-home-source.jpg", None, False),
    ("art-family-hold", "family-hold-source.jpg", None, False),
    ("day-morning", "day-icons-source.jpg", (0, 1000), False),
    ("day-translate", "day-icons-source.jpg", (1000, 1800), False),
    ("day-help", "day-icons-source.jpg", (1800, 2650), False),
    ("day-collapse", "day-icons-source.jpg", (2650, None), False),
    ("art-path-home", "paths-source.jpg", (1898, None), False),
    ("art-child-sprawl", "reading-source.jpg", (1833, None), False),
    ("art-kid-blocks", "play-source.jpg", (120, 1058), True),
    ("art-kid-ball", "play-source.jpg", (1780, None), True),
]


def cut(name, sheet_file, span, light):
    sheet = Image.open(f"{SRC}/{sheet_file}").convert("RGB")
    rgb = np.asarray(sheet).astype(np.float32)

    # The ink: the mean of the two thousand darkest pixels. A percentage of the
    # sheet is the wrong measure - these sheets are almost entirely paper, so
    # even half a percent of them reaches well up into the mid-tones and
    # returns an ink far lighter than any stroke actually is.
    lightness = rgb.max(axis=2)
    ink = rgb.reshape(-1, 3)[np.argsort(lightness, axis=None)[:2000]].mean(axis=0)

    # How much of that ink each pixel holds. Taken per channel and kept at the
    # strongest, so a stroke reads at its full weight rather than at the
    # average of three channels that disagree.
    coverage = np.clip((255.0 - rgb) / np.maximum(255.0 - ink, 1.0), 0, 1).max(axis=2)

    x0, x1 = span or (0, None)
    band = coverage[:, x0:x1]
    ys = np.where((band > 0.06).any(axis=1))[0]
    xs = np.where((band > 0.06).any(axis=0))[0]
    pad = 10
    top, bottom = max(0, ys.min() - pad), ys.max() + 1 + pad
    left, right = max(0, xs.min() - pad), xs.max() + 1 + pad
    alpha = band[top:bottom, left:right]

    out = np.empty((*alpha.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = ink.round().astype(np.uint8)
    out[..., 3] = (alpha * 255).round().astype(np.uint8)
    image = Image.fromarray(out, "RGBA")
    image.thumbnail((900, 900), Image.LANCZOS)
    image.save(f"{SRC}/{name}.png")
    print(f"  {name}.png {image.size}  ink #{'%02x%02x%02x' % tuple(ink.round().astype(int))}")

    if light:
        pale = out.copy()
        pale[..., 0] = pale[..., 1] = pale[..., 2] = 0xF2
        lo = Image.fromarray(pale, "RGBA")
        lo.thumbnail((900, 900), Image.LANCZOS)
        lo.save(f"{SRC}/{name}-light.png")
        print(f"  {name}-light.png {lo.size}")


for entry in CUTS:
    cut(*entry)
