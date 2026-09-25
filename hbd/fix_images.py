import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace div with img
# Example: <div class="ph" id="PHOTO_01"><span class="ph-icon">📷</span><span class="ph-lbl">PHOTO_01</span></div>
# with: <img class="ph" id="PHOTO_01" src="INSERT_IMAGE_NAME_HERE.jpg" style="object-fit:cover;">

def replacer(match):
    # match.group(0) is the full match
    # match.group(1) is the id
    # match.group(2) is any extra style/attributes before the closing >
    id_val = match.group(1)
    extra = match.group(2)
    
    if extra:
        return f'<img class="ph" id="{id_val}" {extra} src="INSERT_IMAGE_NAME_HERE.jpg" style="object-fit:cover;">'
    else:
        return f'<img class="ph" id="{id_val}" src="INSERT_IMAGE_NAME_HERE.jpg" style="object-fit:cover;">'

# Regex to match the placeholders
new_content = re.sub(
    r'<div class="ph" id="([^"]+)"([^>]*)><span class="ph-icon">📷</span><span class="ph-lbl">[^<]+</span></div>',
    replacer,
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Placeholders updated.")
