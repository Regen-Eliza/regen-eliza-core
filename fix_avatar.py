import re

with open('agent-dashboard/components/Avatar.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    'className="avatar-image"',
    'className="avatar-image w-full h-auto object-cover aspect-square"'
)
text = text.replace('object-fit: contain;', '/* object-fit managed by utilities */')
text = text.replace('height: 100%;\n          object-fit: contain;', '/* height and object-fit managed by utilities */')

with open('agent-dashboard/components/Avatar.tsx', 'w') as f:
    f.write(text)
