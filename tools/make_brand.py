"""Render the HeatCast icon and logo into custom_components/heatcast/brand.

Run with Pillow installed: python tools/make_brand.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / "custom_components" / "heatcast" / "brand"
SCALE = 8
TOP = (255, 145, 0)
BOTTOM = (226, 64, 44)
TEXT_LIGHT = (31, 41, 55)
TEXT_DARK = (243, 244, 246)
FONT = Path("C:/Windows/Fonts/segoeuib.ttf")


def icon(size: int) -> Image.Image:
    big = size * SCALE
    gradient = Image.new("RGBA", (big, big))
    pixels = gradient.load()
    for y in range(big):
        for x in range(big):
            t = (x + y) / (2 * big)
            pixels[x, y] = (*tuple(round(TOP[i] + (BOTTOM[i] - TOP[i]) * t) for i in range(3)), 255)

    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=big * 0.22, fill=255)
    tile = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    tile.paste(gradient, mask=mask)

    # A heating curve: flow temperature rising towards cold weather on the right.
    draw = ImageDraw.Draw(tile)
    # Stamped discs give a smooth stroke where joined line segments would show notches.
    steps = 2000
    points = []
    for i in range(steps + 1):
        # Skip the steep first part of the power curve, it reads as a hook at icon size.
        u = 0.08 + 0.92 * i / steps
        x = 0.2 + 0.6 * (u - 0.08) / 0.92
        y = 0.74 - 0.5 * (u ** (1 / 1.35) - 0.08 ** (1 / 1.35))
        points.append((x * big, y * big))
    radius = big * 0.0425
    for x, y in points:
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(255, 255, 255, 255))

    # Operating point on the curve.
    px, py = points[round(steps * 0.42)]
    outer = big * 0.085
    inner = big * 0.045
    draw.ellipse((px - outer, py - outer, px + outer, py + outer), fill=(255, 255, 255, 255))
    draw.ellipse((px - inner, py - inner, px + inner, py + inner), fill=(*BOTTOM, 255))
    return tile.resize((size, size), Image.LANCZOS)


def logo(height: int, text_colour: tuple[int, int, int]) -> Image.Image:
    mark = icon(height)
    font = ImageFont.truetype(str(FONT), round(height * 0.62))
    probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    left, top, right, bottom = probe.textbbox((0, 0), "HeatCast", font=font)
    gap = round(height * 0.22)
    canvas = Image.new("RGBA", (height + gap + (right - left), height), (0, 0, 0, 0))
    canvas.paste(mark, (0, 0), mark)
    text_y = (height - (bottom - top)) // 2 - top
    ImageDraw.Draw(canvas).text((height + gap - left, text_y), "HeatCast", font=font, fill=(*text_colour, 255))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    icon(256).save(OUT / "icon.png", optimize=True)
    icon(512).save(OUT / "icon@2x.png", optimize=True)
    logo(128, TEXT_LIGHT).save(OUT / "logo.png", optimize=True)
    logo(256, TEXT_LIGHT).save(OUT / "logo@2x.png", optimize=True)
    logo(128, TEXT_DARK).save(OUT / "dark_logo.png", optimize=True)
    logo(256, TEXT_DARK).save(OUT / "dark_logo@2x.png", optimize=True)


if __name__ == "__main__":
    main()
