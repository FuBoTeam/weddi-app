"""Convert the raw PNG captures to compressed WebP for the landing page.

Usage: python3 -I to_webp.py <png_dir> <out_dir>
Prints each output's size so Landing.tsx width/height can be kept in sync.
"""
import os
import sys

from PIL import Image

# name -> (output width, quality). Height keeps the capture's aspect ratio.
TARGETS = {
    'greeting-390.png': ('greeting.webp', 780, 72),
    'board-1280.png': ('board.webp', 1280, 72),
    'lottery-640.png': ('lottery.webp', 960, 72),
}

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for png, (webp, width, quality) in TARGETS.items():
    img = Image.open(os.path.join(src, png)).convert('RGB')
    if img.width != width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    dest = os.path.join(out, webp)
    img.save(dest, 'WEBP', quality=quality, method=6)
    print(f'{webp}: {img.width}x{img.height} {os.path.getsize(dest) // 1024} KiB')
