"""Generate display-sized copies of the pathway symbols.

The source set is mixed: 8 files are 1000x1000 (~250KB each), the other 24 are
55x55 (~3KB). Nothing is ever drawn larger than ~56px, so 128px covers even a
2x display. Originals are left untouched.
"""
from PIL import Image
import glob, os

SRC = 'src/assets/pathways'
OUT = 'src/assets/symbols'
os.makedirs(OUT, exist_ok=True)

before = after = 0
for f in sorted(glob.glob(f'{SRC}/*.webp')):
    name = os.path.basename(f)
    dst = os.path.join(OUT, name)
    before += os.path.getsize(f)
    im = Image.open(f).convert('RGBA')
    if im.width > 128:
        im.thumbnail((128, 128), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=88, method=6)
    after += os.path.getsize(dst)
    print(f"{name:36} {im.width:4}px  {os.path.getsize(dst)//1024:4}KB")

print(f"\n{len(glob.glob(f'{SRC}/*.webp'))} symbols: {before//1024}KB -> {after//1024}KB")
