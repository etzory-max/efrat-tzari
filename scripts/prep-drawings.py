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

import hashlib
import pathlib
import io
import json

import numpy as np
from PIL import Image

OUT = "public/images"
# The sheets are build input, not something a visitor should ever download.
# They were sitting in public/ and going out with every deploy - 24MB of
# originals at guessable URLs, referenced by nothing the site serves.
SHEETS = "assets/sheets"
MANIFEST = "components/art/drawings.ts"

# Every file is written under a name carrying a hash of its own contents, and
# the components read their paths from the generated manifest rather than
# spelling them out. Replacing a drawing in place - same name, new pixels - is
# invisible to a browser that already has the old one, and cost an afternoon
# of changes that looked like they had not happened. A new drawing now means a
# new URL, always, and the width and height come along with it so they cannot
# drift from the file either.
written = {}


def emit(name, image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    data = buffer.getvalue()
    digest = hashlib.sha1(data).hexdigest()[:8]
    for stale in pathlib.Path(OUT).glob(f"{name}.*.png"):
        stale.unlink()
    path = f"{OUT}/{name}.{digest}.png"
    pathlib.Path(path).write_bytes(data)
    written[name] = {"src": f"/images/{name}.{digest}.png",
                     "width": image.width, "height": image.height}
    print(f"  {name}.{digest}.png {image.size}")

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
    # 120..244 is a tree and some grass at the very edge of the sheet, drawn
    # as a border and not as part of the girl; 1765 catches the whole ball,
    # which the boy is kicking and which starts before he does.
    # 230..355 is a soft drape drawn as a backdrop for the sheet, not part
    # of the girl; she begins at her pigtail just after it.
    ("art-girl-blocks", "play-source.jpg", (360, 1058), True),
    ("art-boy-ball", "play-source.jpg", (1765, None), True),
    # Only the girl, her tin can and the string trailing off. The blocks to
    # her right belong to a different idea; they begin at 655, so the cut
    # lands just before them rather than through the first one. A line running
    # out of frame says the other end is somewhere rather than nowhere.
    ("art-tin-can", "tincan-source.jpg", (90, 648), False),
    # The book page's three. They are drawn in a finer, lighter line than the
    # first set - one continuous contour instead of pencil shading - so they
    # come off their sheets whole, with nothing to split.
    ("art-writing-night", "writing-night-source.jpg", None, False),
    ("art-book-hands", "book-hands-source.jpg", None, False),
    ("art-two-women", "two-women-source.jpg", None, False),
]


def cut(name, sheet_file, span, light, trim_edge=False):
    sheet = Image.open(f"{SHEETS}/{sheet_file}").convert("RGB")
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

    if trim_edge:
        # This sheet is framed with a soft vertical stroke - a wall, or a
        # curtain - that stands right beside the girl rather than out at the
        # edge, so no crop can take it without taking her arm with it. It is
        # much fainter than she is drawn, so within that strip only the firm
        # ink is kept.
        x_start, width = span[0], 90
        strip = coverage[:, x_start : x_start + width]
        coverage[:, x_start : x_start + width] = np.where(strip > 0.45, strip, 0.0)

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
    emit(name, image)

    if light:
        pale = out.copy()
        pale[..., 0] = pale[..., 1] = pale[..., 2] = 0xF2
        lo = Image.fromarray(pale, "RGBA")
        lo.thumbnail((900, 900), Image.LANCZOS)
        emit(f"{name}-light", lo)


for entry in CUTS:
    cut(*entry)


header = """/**
 * Generated by scripts/prep-drawings.py - do not edit.
 *
 * Each file name carries a hash of its contents, so re-cutting a drawing
 * produces a new URL and no browser can go on showing the previous one. The
 * dimensions travel with the path for the same reason: they cannot drift.
 */
export const drawings = """
pathlib.Path(MANIFEST).write_text(
    header
    + json.dumps(dict(sorted(written.items())), indent=2, ensure_ascii=False)
    + " as const;"
    + chr(10),
    encoding="utf-8",
)
print(f"  -> {MANIFEST} ({len(written)} drawings)")
