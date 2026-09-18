"""
Preps the mother-and-child drawing that closes "אם זה הבית שלך".

  python scripts/prep-walk.py <source.jpg>

The drawing arrives as a very wide sheet, the figures small and centred in a
field of white, and drawn so pale that its darkest pixel is only (171,140,118).
Cropping alone would leave it almost invisible at the 96px it is rendered at.

So it is redrawn rather than merely cut out: the white page becomes
transparent, and every stroke is repainted in accent-ink at an opacity taken
from how dark it was. That keeps the pencil texture and the soft edges while
putting the figure in the site's own palette at a weight that actually reads —
and it means the drawing sits on cream, on white and on the wash without
carrying a white box around with it.
"""

import sys

import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/images/walk-source.jpg"
OUT = "public/images/art-mother-walk.png"

# --color-accent-ink. The drawing's own terracotta is close to it already;
# pinning it exactly is what stops a second, slightly-off warm from entering.
INK = (0x9C, 0x4C, 0x2E)

# Lightness at which a pixel counts as page, and at which it counts as a full
# stroke. Measured off this drawing: the page sits at 255 and the darkest ink
# at 171, so the ramp is stretched across what is actually there instead of
# the 248..208 the denser sheet in prep-art.py could assume.
PAGE, FULL = 252, 186

image = Image.open(SRC).convert("RGB")
lightness = np.asarray(image).astype(np.int16).max(axis=2)

alpha = np.clip((PAGE - lightness) / (PAGE - FULL), 0, 1)

ys, xs = np.where(alpha > 0.04)
pad = 16
box = (
    max(0, xs.min() - pad),
    max(0, ys.min() - pad),
    min(image.width, xs.max() + 1 + pad),
    min(image.height, ys.max() + 1 + pad),
)
alpha = alpha[box[1] : box[3], box[0] : box[2]]
print(f"{image.size} -> crop {box[2] - box[0]}x{box[3] - box[1]}")

flat = np.empty((*alpha.shape, 4), dtype=np.uint8)
flat[..., 0], flat[..., 1], flat[..., 2] = INK
flat[..., 3] = (alpha * 255).astype(np.uint8)

out = Image.fromarray(flat, "RGBA")
out.thumbnail((900, 900), Image.LANCZOS)
out.save(OUT)
print(f"{OUT} {out.size}")
