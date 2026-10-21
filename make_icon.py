#!/usr/bin/env python3
"""Generate Turbo Favorites icons (star + speed streaks on a gradient tile)."""
import math
from PIL import Image, ImageDraw

S = 1024  # master supersample size
CORNER = int(S * 0.22)

# Electric blue -> purple vertical gradient.
TOP = (43, 108, 255)     # #2b6cff
BOTTOM = (123, 47, 247)   # #7b2ff7


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# --- gradient background -------------------------------------------------
grad = Image.new("RGB", (S, S))
gd = ImageDraw.Draw(grad)
for y in range(S):
    gd.line([(0, y), (S, y)], fill=lerp(TOP, BOTTOM, y / (S - 1)))

# rounded-rect alpha mask
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=CORNER, fill=255)

icon = Image.new("RGBA", (S, S), (0, 0, 0, 0))
icon.paste(grad, (0, 0), mask)

draw = ImageDraw.Draw(icon)

# --- speed streaks (trailing to the left) --------------------------------
streak_color = (255, 255, 255)
streaks = [  # (y_center, length_fraction, thickness, alpha)
    (0.40, 0.42, 0.055, 150),
    (0.52, 0.55, 0.075, 210),
    (0.66, 0.40, 0.055, 150),
]
for yc, lf, th, al in streaks:
    y = S * yc
    t = S * th
    x0 = S * 0.07
    x1 = x0 + S * lf
    draw.rounded_rectangle([x0, y - t / 2, x1, y + t / 2],
                           radius=t / 2, fill=streak_color + (al,))

# --- favorite star -------------------------------------------------------
cx, cy = S * 0.60, S * 0.50
R = S * 0.30
r = R * 0.42
pts = []
for i in range(10):
    ang = -math.pi / 2 + i * math.pi / 5
    rad = R if i % 2 == 0 else r
    pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))

# soft drop shadow then the gold star
shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(shadow).polygon([(x + S * 0.012, y + S * 0.012) for x, y in pts],
                               fill=(0, 0, 0, 90))
icon = Image.alpha_composite(icon, shadow)
draw = ImageDraw.Draw(icon)
draw.polygon(pts, fill=(255, 209, 59))           # #ffd13b gold
# subtle inner highlight
hpts = []
for i in range(10):
    ang = -math.pi / 2 + i * math.pi / 5
    rad = R * 0.62 if i % 2 == 0 else r * 0.62
    hpts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
draw.polygon(hpts, fill=(255, 231, 140))

# --- export sizes --------------------------------------------------------
for size in (128, 64, 48, 32, 16):
    icon.resize((size, size), Image.LANCZOS).save(f"icons/icon-{size}.png")
print("icons written: 16, 32, 48, 64, 128")
