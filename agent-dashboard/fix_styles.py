import re
import os

filepath = 'components/SentientDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Colors & Basic text
content = content.replace('bg-[#021002]', 'bg-[#050505]')
content = content.replace('text-[#d0d0d0]', 'text-[#e5e5e5]')
content = content.replace('text-[#064006]', 'text-[#6ba368]')
content = content.replace('bg-[#064006]', 'bg-[#6ba368]')

# 2. Fonts
content = content.replace('font-retro', 'font-mono tracking-wide')

# 3. Strip all shadows and glows
content = re.sub(r'drop-shadow-\[[^\]]+\]', '', content)
content = re.sub(r'shadow-\[[^\]]+\]', '', content)

# 4. Borders (specifically panel and button borders pointing to old green)
content = re.sub(r'border-\[#064006\](/\d+)?', 'border-[#2a2a2a]', content)

# 5. Buttons mapping (dock buttons and ENS buttons)
old_service_btn = r'px-4 py-2 border border-\[#2a2a2a\] rounded text-\[#e5e5e5\] hover:bg-\[#6ba368\]/10 transition-colors text-(base|lg) font-bold'
new_service_btn = r'border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-4 py-2 rounded-md hover:border-[#6ba368] hover:text-[#6ba368] transition-colors flex items-center justify-center font-mono tracking-wide text-sm sm:text-base'

content = re.sub(old_service_btn, new_service_btn, content)

old_ens_btn = r'px-4 py-2 border border-\[#2a2a2a\] rounded text-\[#e5e5e5\] hover:bg-\[#6ba368\]/10 transition-colors( text-base font-bold)?'
content = re.sub(old_ens_btn, new_service_btn, content)

# 6. Remove filters on Avatar column
old_filter = r'filter grayscale sepia hue-rotate-\[80deg\] contrast-150 brightness-75 opacity-90'
content = content.replace(old_filter, '')

# 7. Update headers that should be muted #888888 (AGENT IDENTITY, SERVICES, etc.)
# We will just do a targeted replace for panelLabel to make it text-[#888888] tracking-widest
content = content.replace('text-[#6ba368]/50 uppercase tracking-widest', 'text-[#888888] uppercase tracking-widest')

# Save changes
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Styles updated.")
