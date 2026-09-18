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

    # Each pixel keeps its own colour. Only the paper is removed: anything
    # more than a few levels off white becomes fully opaque and carries the
    # exact value the sheet had, so the drawing on cream is the drawing that
    # was handed over. Deriving a single ink colour and re-solving the shading
    # against it - which is what this did before - kept coming back greyer and
    # paler than the original, because the darkest pixels on these sheets are
    # where strokes overlap and those are the least saturated ones on the page.
    lightness = rgb.max(axis=2)
    coverage = np.clip((255.0 - lightness) / 22.0, 0, 1)
    # A separate, stricter test for where the drawing actually is. The soft
    # ramp above reaches almost every pixel on a scanned sheet, so using it to
    # find the bounds returns the whole page.
    inked = lightness < 238

    x0, x1 = span or (0, None)
    band = coverage[:, x0:x1]
    mask = inked[:, x0:x1]
    ys = np.where(mask.any(axis=1))[0]
    xs = np.where(mask.any(axis=0))[0]
    pad = 10
    top, bottom = max(0, ys.min() - pad), ys.max() + 1 + pad
    left, right = max(0, xs.min() - pad), xs.max() + 1 + pad
    alpha = band[top:bottom, left:right]

    colour = rgb[:, x0:x1][top:bottom, left:right].round().astype(np.uint8)
    out = np.dstack([colour, (alpha * 255).round().astype(np.uint8)])
    image = Image.fromarray(out, "RGBA")
    image.thumbnail((900, 900), Image.LANCZOS)
    image.save(f"{SRC}/{name}.png")
    print(f"  {name}.png {image.size}")

    if light:
        pale = out.copy()
        pale[..., 0] = pale[..., 1] = pale[..., 2] = 0xF2
        lo = Image.fromarray(pale, "RGBA")
        lo.thumbnail((900, 900), Image.LANCZOS)
        lo.save(f"{SRC}/{name}-light.png")
        print(f"  {name}-light.png {lo.size}")


for entry in CUTS:
    cut(*entry)
