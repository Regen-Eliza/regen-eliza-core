import re

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# Remove the broken ASCII block
text = re.sub(
    r'/\*\s*───\s*ASCII\s*TITLE\s*───\s*\*/.*?/\*\s*───\s*Color\s*Palette',
    '/* ─── Color Palette',
    text,
    flags=re.DOTALL
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)
