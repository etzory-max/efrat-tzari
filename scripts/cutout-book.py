"""
Cuts the book out of its mockup: drops the flat studio background and the
mirror reflection under the spine, leaving a transparent PNG of the book only.

    python scripts/cutout-book.py <in.jpg> <out.png>
"""

import sys
from collections import deque

import numpy as np
from PIL import Image

src = sys.argv[1] if len(sys.argv) > 1 else "public/images/efrat_book-mockup-819x1024.jpg"
dst = sys.argv[2] if len(sys.argv) > 2 else "public/images/book-cover.png"

img = Image.open(src).convert("RGB")
arr = np.asarray(img).astype(np.int16)
h, w, _ = arr.shape

# The studio background is flat, so the corners are a reliable sample of it.
corner = np.concatenate(
    [
        arr[0:20, 0:20].reshape(-1, 3),
        arr[0:20, w - 20 : w].reshape(-1, 3),
        arr[h - 20 : h, 0:20].reshape(-1, 3),
        arr[h - 20 : h, w - 20 : w].reshape(-1, 3),
    ]
)
bg = np.median(corner, axis=0)
dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
print(f"background {bg.astype(int).tolist()}  max distance {dist.max():.0f}")

# Anything close to the background is out; the reflection is a faint echo, so a
# firm threshold removes it without eating into the cover itself.
SOLID = 72.0
solid = dist > SOLID

# Keep only the largest blob — that is the book. The reflection survives the
# threshold in patches, and this is what discards them.
labels = np.zeros((h, w), dtype=np.int32)
best_label, best_size = 0, 0
label = 0
for y0 in range(h):
    for x0 in range(w):
        if not solid[y0, x0] or labels[y0, x0]:
            continue
        label += 1
        size = 0
        queue = deque([(y0, x0)])
        labels[y0, x0] = label
        while queue:
            y, x = queue.popleft()
            size += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = label
                    queue.append((ny, nx))
        if size > best_size:
            best_label, best_size = label, size

book = labels == best_label
print(f"largest blob {best_size} px of {h * w}")

# Soft edge: ramp the alpha across the few pixels either side of the threshold
# so the cut does not look sawn.
FEATHER = 10.0
alpha = np.clip((dist - (SOLID - FEATHER)) / FEATHER, 0, 1)
alpha[~book] = 0

ys, xs = np.where(alpha > 0.15)
top, bottom, left, right = ys.min(), ys.max(), xs.min(), xs.max()
print(f"crop to {right - left + 1}x{bottom - top + 1} at ({left},{top})")

out = np.dstack([arr.astype(np.uint8), (alpha * 255).astype(np.uint8)])
Image.fromarray(out[top : bottom + 1, left : right + 1], "RGBA").save(dst)
print(f"wrote {dst}")
