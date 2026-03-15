# PATH: generate_icon.py (run this from your project root)
# Run with: python generate_icon.py

from PIL import Image, ImageDraw, ImageFont
import os
import struct
import io

def create_frame(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = int(size * 0.05)
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(124, 58, 237, 255))

    inner_margin = int(size * 0.15)
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], fill=(139, 92, 246, 255))

    font_size = int(size * 0.55)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()

    text = "A"
    bbox = draw.textbbox((0, 0), text, font=font)
    x = (size - (bbox[2] - bbox[0])) // 2 - bbox[0]
    y = (size - (bbox[3] - bbox[1])) // 2 - bbox[1]
    draw.text((x+1, y+1), text, fill=(0, 0, 0, 80), font=font)
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)

    return img

def save_ico(images, path):
    # Build ICO file manually to ensure all sizes are included
    num_images = len(images)
    
    # ICO header
    header = struct.pack('<HHH', 0, 1, num_images)
    
    # Each image as PNG bytes
    png_datas = []
    for img in images:
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        png_datas.append(buf.getvalue())
    
    # Directory entries — each is 16 bytes
    offset = 6 + num_images * 16
    dir_entries = b''
    for img, png_data in zip(images, png_datas):
        w, h = img.size
        w_byte = 0 if w >= 256 else w
        h_byte = 0 if h >= 256 else h
        dir_entries += struct.pack('<BBBBHHII',
            w_byte, h_byte, 0, 0, 1, 32,
            len(png_data), offset
        )
        offset += len(png_data)
    
    with open(path, 'wb') as f:
        f.write(header)
        f.write(dir_entries)
        for png_data in png_datas:
            f.write(png_data)

def create_icon():
    os.makedirs('build', exist_ok=True)
    sizes = [256, 128, 64, 48, 32, 16]
    images = [create_frame(s) for s in sizes]
    save_ico(images, 'build/icon.ico')
    print(f"Icon generated at build/icon.ico with sizes: {sizes}")

if __name__ == '__main__':
    create_icon()