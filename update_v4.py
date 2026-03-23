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
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4 px-4 sm:px-6 lg:px-8"'
)

# 3. Mobile Reordering:
# Column 1 (Stats): order-2 on mobile, lg:order-1
text = text.replace(
    'className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3"',
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"'
)

# Column 2 (Soul/Avatar - HERO): order-1 on mobile, full min-height for hero
text = text.replace(
    'className="h-[450px] lg:h-full flex flex-col relative w-full z-20 order-first lg:order-none mb-4 lg:mb-0 lg:col-span-6"',
    'className="min-h-[70vh] sm:min-h-[450px] lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"'
)

# Column 3 (Logs & Skills): order-3 on mobile
text = text.replace(
    'className="h-full flex flex-col gap-2 overflow-y-auto scrollbar-hide pr-1 pb-4 lg:col-span-3"',
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"'
)

# 4. Avatar HERO CTA & Title Fix:
# Remove original agent identity header string and ingest box from avatar container visually? Actually, just keep Ingest box but make it look like a CTA with clamp.
text = text.replace(
    'className="text-[24px] font-bold text-[#6ba368] tracking-wide mt-1"',
    'className="font-bold text-[#6ba368] tracking-wide mt-1 truncate overflow-hidden max-w-full text-[clamp(1rem,3.5vw,1.5rem)] sm:text-[24px]"'
)

# For the Hero layout: add the "REGEN ELIZA" title under avatar only on mobile
avatar_hero_pattern = re.compile(r'(<Avatar state=\{[\s\S]*?\} />\s*<div className="absolute inset-0[^>]*></div>\s*</div>)')
hero_append = r"""\1
          {/* Mobile Hero Tagline & CTA */}
          <div className="flex flex-col items-center mt-6 lg:hidden w-full space-y-4 px-2">
             <h1 className="font-mono font-bold text-[#00FF41] text-[clamp(2rem,8vw,3rem)] tracking-wider drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] text-center leading-none">REGEN ELIZA</h1>
             <p className="text-[#888] font-mono text-center text-sm px-4">ERC-8004 Autonomous Agent</p>
             <button className="w-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20 font-bold py-4 rounded-lg min-h-[44px] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)]" onClick={() => navigator.clipboard.writeText("curl https://api.regeneliza.com/skill.md")}>
                INGEST SKILLS (COPY CURL)
             </button>
          </div>"""
text = avatar_hero_pattern.sub(hero_append, text)

# Agent Identity Box wrap flexibly
text = text.replace(
    'className="flex flex-col space-y-2 mt-2"',
    'className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 space-y-2 sm:space-y-0 mt-2"'
)

text = text.replace(
    'className="flex flex-col space-y-3 mt-1.5"',
    'className="flex flex-col gap-3 mt-1.5"'
)

# 5. Bottom Dock Control Bar: Stacked single column on mobile
text = text.replace(
    'className="w-[98%] mx-auto grid grid-cols-[1.2fr_1.6fr_1.2fr] gap-4 items-center py-2 bg-black/60 backdrop-blur-md border-t border-[#2a2a2a] z-20 shrink-0 px-2 lg:px-4"',
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.2fr_1.6fr_1.2fr] gap-4 lg:gap-8 items-center py-4 sm:py-2 bg-black/60 backdrop-blur-md border-t border-[#2a2a2a] z-20 shrink-0 px-4 sm:px-6 lg:px-8"'
)

# Move TRACKS and ENS to be centered on mobile, default on desktop
text = text.replace(
    'className="flex items-center space-x-3 text-[#e5e5e5] justify-start font-mono tracking-wide"',
    'className="flex items-center space-x-3 text-[#e5e5e5] justify-center lg:justify-start font-mono tracking-wide w-full flex-wrap gap-y-2"'
)
text = text.replace(
    'className="flex items-center space-x-3 justify-end font-mono tracking-wide"',
    'className="flex items-center space-x-3 justify-center lg:justify-end font-mono tracking-wide w-full flex-wrap gap-y-2"'
)

# 6. Buttons min-height 44px and w-full on mobile
button_pattern = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?DeSci.*?</button>)')
text = button_pattern.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)
button_pattern2 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?Ecology.*?</button>)')
text = button_pattern2.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)
button_pattern3 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?Builders.*?</button>)')
text = button_pattern3.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)
button_pattern4 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?Agents.*?</button>)')
text = button_pattern4.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)

button_pattern5 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?Contacts.*?</button>)')
text = button_pattern5.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)
button_pattern6 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?ENS.*?</button>)')
text = button_pattern6.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)
button_pattern7 = re.compile(r'(<button [^>]*className=")(border border-\[#2a2a2a\] [^"]*)(">.*?Swap.*?</button>)')
text = button_pattern7.sub(r'\1w-full sm:w-auto min-h-[44px] sm:min-h-0 \2\3', text)

# For rows containing buttons, make them flex-col on mobile
text = text.replace(
    'className="flex items-center space-x-2 w-full justify-center"',
    'className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2 w-full justify-center"'
)
# Wait, gap-2 + space-x-2 might clash minimally, but it's safe if it applies on different breakpoints or handles margins. Let's just use gap-2 entirely instead of space-x-2.
text = text.replace(
    'className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2 w-full justify-center"',
    'className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center"'
)

# 7. Links section (Agent Skills): "Large tap-friendly list items, icon + label + chevron pattern"
# They are currently in a grid grid-cols-2. Let's change to grid-cols-1 on mobile, grid-cols-2 lg.
text = text.replace(
    'className="grid grid-cols-2 gap-2 mt-1"',
    'className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2"'
)
# Update anchor classes to be min-h 44px, row style
skill_link_class = 'block w-full flex items-center justify-between border border-[#2a2a2a] bg-black/40 text-[#e5e5e5]/90 px-3 py-3 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-all truncate min-h-[44px] shadow-[0_0_10px_rgba(0,0,0,0.2)]'

# Need to replace the links carefully, we can use regex to inject the chevron and new class.
link_pattern = re.compile(r'<a href="([^"]+)" [^>]+className="block w-full flex items-center justify-center border-2[^"]+"[^>]*>\s*(.*?)\s*</a>', re.DOTALL)

def repl_link(match):
    href = match.group(1)
    label = match.group(2)
    # The new chevron from lucide-react (ChevronRight) needs to be imported, but we can also use a simple text chevron ">" or right arrow "→".
    return f'<a href="{href}" target="_blank" rel="noopener noreferrer" className="{skill_link_class}"><div className="flex items-center gap-2"><span className="text-[#6ba368]">⚡</span> <span className="truncate">{label}</span></div><span className="text-[#888] opactity-50 group-hover:text-[#6ba368]">→</span></a>'

text = link_pattern.sub(repl_link, text)

# Also fix the initial Agent Identity title on mobile so it doesn't duplicate. We already added an H1 hero for mobile.
# Just hide the main string and let the user see it: 
text = text.replace(
    'className="text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"',
    'className="hidden lg:block text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"'
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)
