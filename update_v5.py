import re
import sys

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# 1. Title bar responsive
text = text.replace(
    'className="w-full flex justify-center items-center pt-4 pb-2 shrink-0 z-10"',
    'className="w-full flex flex-col justify-center items-center pt-4 sm:pt-6 pb-2 shrink-0 z-10 px-4 sm:px-6 lg:px-8"'
)
text = text.replace(
    'className="text-[#6ba368] font-bold text-sm sm:text-base md:text-lg leading-tight text-center select-none font-mono tracking-wide"',
    'className="text-[#6ba368] font-bold text-[6px] sm:text-xs md:text-sm lg:text-base leading-tight text-center select-none font-mono tracking-wide overflow-x-hidden w-full"'
)

# 2. Command Center Container: single column on mobile, max-w-screen-xl, horizontal padding
text = text.replace(
    'className="w-[98%] max-w-[1600px] mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4"',
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-[100dvh] lg:min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4 px-4 sm:px-6 lg:px-8"'
)

# 3. Mobile Reordering:
text = text.replace(
    'className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3"',
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"'
)
text = text.replace(
    'className="h-[450px] lg:h-full flex flex-col relative w-full z-20 order-first lg:order-none mb-4 lg:mb-0 lg:col-span-6"',
    'className="min-h-[70vh] sm:min-h-[450px] lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"'
)
text = text.replace(
    'className="h-full flex flex-col gap-2 overflow-y-auto scrollbar-hide pr-1 pb-4 lg:col-span-3"',
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"'
)

# 4. Agent Ingest CTA
text = text.replace(
    'className="text-[24px] font-bold text-[#6ba368] tracking-wide mt-1"',
    'className="font-bold text-[#6ba368] tracking-wide mt-1 truncate overflow-hidden max-w-[90vw] lg:max-w-full text-[clamp(1rem,3.5vw,1.5rem)] sm:text-[24px]"'
)

# Avatar HERO CTA & Title Fix
text = text.replace(
    '<Avatar state={(',
    '''{/* Mobile Hero Tagline & CTA */}
          <div className="flex flex-col items-center mb-6 lg:hidden w-full space-y-4 px-2">
             <h1 className="font-mono font-bold text-[#00FF41] text-[clamp(2rem,8vw,3rem)] tracking-wider drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] text-center leading-none">REGEN ELIZA</h1>
             <p className="text-[#888] font-mono text-center text-sm px-4 whitespace-normal break-words">ERC-8004 Autonomous Agent</p>
          </div>
          <Avatar state={('''
)
text = text.replace(
    '<div className="absolute inset-0 border border-[#6ba368]/10 rounded-xl pointer-events-none transition-colors group-hover:border-[#6ba368]/30 mix-blend-screen" />\n          </div>',
    '''<div className="absolute inset-0 border border-[#6ba368]/10 rounded-xl pointer-events-none transition-colors group-hover:border-[#6ba368]/30 mix-blend-screen" />\n          </div>\n          <div className="mt-4 lg:hidden w-full px-2">
             <button className="w-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20 font-bold py-4 rounded-lg min-h-[44px] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] whitespace-normal break-words" onClick={() => navigator.clipboard.writeText("curl https://api.regeneliza.com/skill.md")}>
                INGEST SKILLS (COPY CURL)
             </button>
          </div>'''
)

# Wrap flexibly for ID info
text = text.replace(
    'className="flex flex-col space-y-2 mt-2"',
    'className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 space-y-2 sm:space-y-0 mt-2"'
)
text = text.replace(
    'className="flex flex-col space-y-3 mt-1.5"',
    'className="flex flex-col gap-3 mt-1.5"'
)
text = text.replace(
    '''<span className="text-[#888888] font-mono tracking-wide text-sm">BASE ID: 30121</span>''',
    '''<span className="text-[#888888] font-mono tracking-wide text-sm whitespace-nowrap">BASE ID: 30121</span>'''
)
text = text.replace(
    '''<span className="text-[#888888] font-mono tracking-wide text-sm">CELO ID: 1851</span>''',
    '''<span className="text-[#888888] font-mono tracking-wide text-sm whitespace-nowrap">CELO ID: 1851</span>'''
)

# Bottom Dock
text = text.replace(
    'className="w-[98%] mx-auto grid grid-cols-[1.2fr_1.6fr_1.2fr] gap-4 items-center py-2 bg-black/60 backdrop-blur-md border-t border-[#2a2a2a] z-20 shrink-0 px-2 lg:px-4"',
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.2fr_1.6fr_1.2fr] gap-4 lg:gap-8 items-center py-4 sm:py-2 bg-black/60 backdrop-blur-md border-t border-[#2a2a2a] z-20 shrink-0 px-4 sm:px-6 lg:px-8"'
)
text = text.replace(
    'className="flex items-center space-x-3 text-[#e5e5e5] justify-start font-mono tracking-wide"',
    'className="flex items-center space-x-3 text-[#e5e5e5] justify-center lg:justify-start font-mono tracking-wide w-full flex-wrap gap-y-2"'
)
text = text.replace(
    'className="flex items-center space-x-3 justify-end font-mono tracking-wide"',
    'className="flex items-center space-x-3 justify-center lg:justify-end font-mono tracking-wide w-full flex-wrap gap-y-2"'
)

# Rows flex col on mobile
text = text.replace(
    'className="flex items-center space-x-2 w-full justify-center"',
    'className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center"'
)

# Button classes
text = re.sub(
    r'(<button [^>]*className=")(border border-\[#2a2a2a\] bg-transparent text-\[#e5e5e5\] px-2 py-0.5 rounded border hover:border-\[#6ba368\] hover:bg-\[#6ba368\]/10 hover:text-\[#6ba368\] transition-all text-\[10px\] lg:text-xs">)(.*?)(</button>)',
    r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3\4',
    text
)

# Agent skills
text = text.replace(
    'className="grid grid-cols-2 gap-2 mt-1"',
    'className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2"'
)

skill_class_old = 'className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate"'
skill_class_new = 'className="flex flex-row w-full items-center justify-between border border-[#2a2a2a] bg-[#111111] text-[#e5e5e5]/90 px-3 py-3 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-all min-h-[44px] shadow-[0_0_10px_rgba(0,0,0,0.2)]"'

text = text.replace(skill_class_old, skill_class_new)

# Add chevron and icon to skills
skills = [
    'BUILDER.MD', 'PUBLIC_GOODS.MD', 'OCTANT.MD', 'LIDO.MD', 'UNISWAP.MD', 'CELO.MD'
]

for skill in skills:
    text = text.replace(
        f">\n                {skill}\n              </a>",
        f"""><div className="flex items-center gap-2 min-w-0"><span className="text-[#6ba368] shrink-0">⚡</span> <span className="truncate">{skill}</span></div><span className="text-[#888] opacity-50 shrink-0">→</span></a>"""
    )
    # in case line breaks differ
    text = text.replace(
        f">{skill}</a>",
        f"""><div className="flex items-center gap-2 min-w-0"><span className="text-[#6ba368] shrink-0">⚡</span> <span className="truncate">{skill}</span></div><span className="text-[#888] opacity-50 shrink-0">→</span></a>"""
    )


# Agent Identity title on mobile hidden
text = text.replace(
    'className="text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"',
    'className="hidden lg:block text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"'
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)
