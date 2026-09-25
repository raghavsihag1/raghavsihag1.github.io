import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    id_val = match.group(1)
    return f'<img class="ph tl-photo" id="{id_val}" src="INSERT_IMAGE_NAME_HERE.jpg" style="object-fit:cover;">'

new_content = re.sub(
    r'<div class="ph tl-photo" id="([^"]+)"><span class="ph-icon">📷</span><span class="ph-lbl">[^<]+</span></div>',
    replacer,
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Timeline placeholders updated.")
