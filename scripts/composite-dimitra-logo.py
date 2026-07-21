from pathlib import Path
from PIL import Image
import sys

src = Path(sys.argv[1])
logo = Image.open(sys.argv[2]).convert("RGBA")
pixels = []
for r, g, b, a in logo.getdata():
    pixels.append((r, g, b, 0 if r > 242 and g > 242 and b > 242 else 128))
logo.putdata(pixels)
logo.thumbnail((150, 150), Image.Resampling.LANCZOS)
out = Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)
for index, (filename, name) in enumerate(zip(sys.argv[4::2], sys.argv[5::2]), start=1):
    image = Image.open(src / filename).convert("RGBA")
    image.alpha_composite(logo, (48, 48))
    image.save(out / f"{name}.png")
