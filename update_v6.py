import re

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# Fix scrolling issues
# Main container:
text = text.replace(
    'className="flex flex-col h-screen w-full bg-[#050505] text-[#e5e5e5] overflow-hidden scanlines"',
    'className="flex flex-col min-h-[100dvh] lg:h-screen w-full bg-[#050505] text-[#e5e5e5] lg:overflow-hidden scanlines"'
)

# Command center outer container:
text = text.replace(
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-[100dvh] lg:min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4 px-4 sm:px-6 lg:px-8"',
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-0 z-10 overflow-y-visible lg:overflow-hidden pb-4 px-4 sm:px-6 lg:px-8"'
)

# Columns h-full -> h-auto lg:h-full
text = text.replace(
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"',
    'className="h-auto lg:h-full flex flex-col gap-4 lg:overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"'
)
text = text.replace(
    'className="min-h-[70vh] sm:min-h-[450px] lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"',
    'className="h-auto lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"'
)
text = text.replace(
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"',
    'className="h-auto lg:h-full flex flex-col gap-4 lg:overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"'
)

# Hide ASCII title on mobile completely
text = text.replace(
    'className="w-full flex flex-col justify-center items-center pt-4 sm:pt-6 pb-2 shrink-0 z-10 px-4 sm:px-6 lg:px-8"',
    'className="hidden lg:flex w-full flex-col justify-center items-center pt-2 pb-2 shrink-0 z-10 px-4 sm:px-6 lg:px-8"'
)

# Change thunders to bots in Agent Skills
text = text.replace(
    '<span className="text-[#6ba368] shrink-0">⚡</span>',
    '<span className="shrink-0 text-base">🤖</span>'
)

# Ensure word break for manifest
text = text.replace(
    'className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]"',
    'className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]"'
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)

with open('agent-dashboard/app/page.tsx', 'r') as f:
    page_text = f.read()

page_text = re.sub(
    r'<div className="w-full mt-4 flex flex-col items-center">.*?<pre className="whitespace-pre-wrap font-mono text-\[11px\] md:text-\[12px\] text-\[#e5e5e5\]/80 mt-2">.*?\{skillContent\}.*?</pre>.*?</div>.*?</div>',
    r'{skillContent}',
    page_text,
    flags=re.DOTALL
)

with open('agent-dashboard/app/page.tsx', 'w') as f:
    f.write(page_text)
