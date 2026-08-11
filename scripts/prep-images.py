"""
Two one-off image preparations.

  python scripts/prep-images.py

1. hero-2.jpg -> hero-home.jpg
   At desktop widths the hero crops vertically, not horizontally, so
   object-position cannot shift the subject sideways. Trimming the left edge
   is what actually moves her left.

2. the uploaded portrait -> efrat-portrait.jpg
   7.7MB PNG at 1696x2528 down to a 4:5 web JPEG. The crop takes the top of
   the frame, which also drops the generator's corner mark.
"""

from PIL import Image

# ---- 1. hero ----------------------------------------------------------------
hero = Image.open("public/images/hero-2.jpg").convert("RGB")
trim = int(hero.width * 0.18)
hero_out = hero.crop((trim, 0, hero.width, hero.height))
hero_out.save("public/images/hero-home.jpg", quality=84, optimize=True, progressive=True)
print(f"hero {hero.size} -> {hero_out.size}  public/images/hero-home.jpg")

# ---- 2. portrait ------------------------------------------------------------
src = Image.open("public/images/Gemini_Generated_Image_h7xp7vh7xp7vh7xp.png").convert("RGB")
target_h = int(src.width * 5 / 4)
portrait = src.crop((0, 0, src.width, min(target_h, src.height)))
portrait = portrait.resize((1000, int(1000 * portrait.height / portrait.width)), Image.LANCZOS)
portrait.save("public/images/efrat-portrait.jpg", quality=82, optimize=True, progressive=True)
print(f"portrait {src.size} -> {portrait.size}  public/images/efrat-portrait.jpg")
