"""
Builds the share card and the app icons, plus light-on-dark variants of the
illustrations.

  python scripts/prep-share.py

The share card is generated here rather than at request time so the Hebrew is
laid out by a real text engine and can be eyeballed before it ships. WhatsApp
in particular is fussy: it wants a JPEG under a few hundred KB at an absolute
URL, and it will silently show nothing if the image is too heavy.
"""

import os

from PIL import Image, ImageDraw, ImageFont

OUT_OG = "public/og.jpg"
HERO = "public/images/hero-hug.jpg"
MARK = "public/images/book-cover.png"  # unused, kept for reference

DARK = (44, 50, 56)
CREAM = (245, 242, 237)
ACCENT = (214, 154, 126)


def hebrew(text: str) -> str:
    """
    Hebrew letters do not join, so drawing the reversed code points left to
    right lands them in the right visual order. Good enough for these two
    all-Hebrew strings; anything mixed would need a real bidi pass.
    """
    return text[::-1]


def font(size: int) -> ImageFont.FreeTypeFont:
    for path in (
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    raise SystemExit("no Hebrew-capable font found")


# ---- share card ------------------------------------------------------------
W, H = 1200, 630
hero = Image.open(HERO).convert("RGB")
scale = max(W / hero.width, H / hero.height)
hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
left = (hero.width - W) // 2
card = hero.crop((left, 0, left + W, H))

# Scrim: heavier on the right, where the words go.
scrim = Image.new("RGBA", (W, H))
sd = ImageDraw.Draw(scrim)
for x in range(W):
    a = int(232 - (x / W) * 150)
    sd.line([(W - 1 - x, 0), (W - 1 - x, H)], fill=DARK + (a,))
card = Image.alpha_composite(card.convert("RGBA"), scrim).convert("RGB")

d = ImageDraw.Draw(card)
right = W - 70
d.text((right, 190), hebrew("אפרת צרי"), font=font(78), fill=CREAM, anchor="ra")
d.text((right, 300), hebrew("המרחב שלך להורות מותאמת"), font=font(46), fill=CREAM, anchor="ra")
d.text(
    (right, 380),
    hebrew("ליווי מקצועי וחם למשפחות עם ילדים על הרצף האוטיסטי"),
    font=font(30),
    fill=ACCENT,
    anchor="ra",
)
d.rectangle([right - 150, 452, right, 458], fill=ACCENT)

card.save(OUT_OG, quality=86, optimize=True, progressive=True)
print(f"{OUT_OG} {card.size} {os.path.getsize(OUT_OG) // 1024}KB")

# ---- app icons -------------------------------------------------------------
# A filled square so Android and iOS have something solid to mask.
for name, size in [("public/icon-192.png", 192), ("public/icon-512.png", 512), ("app/apple-icon.png", 180)]:
    icon = Image.new("RGB", (size, size), (70, 91, 109))
    di = ImageDraw.Draw(icon)
    r = size * 0.30
    c = size / 2
    w = max(2, round(size * 0.028))
    di.ellipse([c - r + size * 0.05, c - r, c + r + size * 0.05, c + r], outline=CREAM, width=w)
    di.ellipse([c - r - size * 0.05, c - r, c + r - size * 0.05, c + r], outline=CREAM, width=w)
    di.line([(c, c + r * 0.85), (c, c - r * 0.15)], fill=CREAM, width=w)
    di.line([(c, c + r * 0.1), (c - r * 0.5, c - r * 0.25)], fill=CREAM, width=w)
    di.line([(c, c + r * 0.25), (c + r * 0.5, c - r * 0.1)], fill=CREAM, width=w)
    icon.save(name)
    print(f"{name} {size}x{size}")

# ---- light illustrations for dark surfaces --------------------------------
for name in ["art-boy-ball", "art-girl-blocks", "art-kids-table"]:
    src = Image.open(f"public/images/{name}.png").convert("RGBA")
    tint = Image.new("RGBA", src.size, (242, 208, 188, 0))
    tint.putalpha(src.getchannel("A"))
    tint.save(f"public/images/{name}-light.png")
    print(f"public/images/{name}-light.png")
