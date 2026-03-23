import re

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# 1. Desktop Layout
# Change main container from max-w-screen-xl to max-w-[1600px]
# and change grid from lg:grid-cols-12 to lg:grid-cols-[1.2fr_1.4fr_1.4fr]
text = re.sub(
    r'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 z-10 pb-4 px-4 sm:px-6 lg:px-8"',
    r'className="w-full max-w-[1600px] mx-auto flex flex-col lg:grid lg:grid-cols-[1.2fr_1.4fr_1.4fr] lg:gap-8 items-start mt-2 flex-1 z-10 pb-4 px-4 sm:px-6 lg:px-8 h-full"',
    text
)

# Fix outer column layout classes because we are no longer using span-3 / 6 / 3.
# Column 1
text = text.replace(
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"',
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide w-full pr-1 pb-4 order-2 lg:order-none mt-8 lg:mt-0"'
)
# Column 2
text = text.replace(
    'className="h-auto lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"',
    'className="h-auto lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0"'
)
# Column 3
text = text.replace(
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"',
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide pr-1 pb-8 order-3 lg:order-none w-full"'
)

# Right column Protocol Manifest expansion
text = text.replace(
    'className="flex-1 min-h-[250px] border border-[#2a2a2a] bg-black/20 backdrop-blur-md rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(107,163,104,0.05)] border-t-[#6ba368]/30 mt-2"',
    'className="flex-1 min-h-[250px] border border-[#2a2a2a] bg-black/20 backdrop-blur-md rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(107,163,104,0.05)] border-t-[#6ba368]/30 mt-2 h-full"'
)

# 2. Left Column - REGEN ELIZA header single line
# It currently has text-4xl. Change to text-xl whitespace-nowrap and add overflow-hidden to its container.
text = text.replace(
    '<div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3">',
    '<div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3 overflow-hidden">'
)
# Note: we also have it under Agent Identity.
text = text.replace(
    '<div className="hidden lg:block text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">REGEN ELIZA</div>',
    '<div className="hidden lg:block text-xl whitespace-nowrap font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">REGEN ELIZA</div>'
)

# 3. Right Column - Agent Skills expanded
new_skills = """<div className="flex flex-col gap-1 mt-2">
              <a href="/skills/builder-funding.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">BUILDER.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">Builder Funding Evaluation</span>
              </a>
              <a href="/skills/public-goods.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">PUBLIC_GOODS.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">Regen Network Integrations</span>
              </a>
              <a href="/skills/octant-evaluation.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">OCTANT.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">GLM Ecosystem Fund</span>
              </a>
              <a href="/skills/lido-yield-treasury.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">LIDO.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">wstETH Yield Generation</span>
              </a>
              <a href="/skills/uniswap-intent-router.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">UNISWAP.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">On-chain Swap Intents</span>
              </a>
              <a href="/skills/celo-real-world-impact.md" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center gap-2 py-1 border-b border-green-900 hover:bg-[#6ba368]/10 transition-colors">
                <span className="text-xs font-mono text-green-400 whitespace-nowrap truncate">CELO.MD</span>
                <span className="text-xs text-gray-400 truncate max-w-[60%]">Real World Assets & Impact</span>
              </a>
            </div>"""

text = re.sub(
    r'<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">.*?</svg></span></a>\s*</div>',
    new_skills,
    text,
    flags=re.DOTALL
)

# If it didn't match the regex above (due to previous changes), try matching more generically
if 'grid-cols-1 md:grid-cols-2' in text:
    text = re.sub(
        r'<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">.*?</div>\s*</div>\s*<!-- Active Transaction Output -->',
        new_skills + '\n          </div>\n\n          {/* Active Transaction Output */}',
        text,
        flags=re.DOTALL
    )
elif '<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">' in text:
    # Just split and replace manually based on specific strings
    start = text.index('<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">')
    end_marker = '</div>\n          </div>\n\n          {/* Active Transaction Output */}'
    if end_marker in text:
        end = text.index(end_marker, start)
        text = text[:start] + new_skills + text[end:]

# 4. Mobile Layout - Vertical scroll, single-line terminal style
text = text.replace(
    'className="flex flex-col min-h-screen w-full bg-[#050505] text-[#e5e5e5] scanlines"',
    'className="flex flex-col min-h-screen w-full bg-[#050505] text-[#e5e5e5] overflow-y-auto overflow-x-hidden scanlines"'
)
# Logs:
text = text.replace(
    'className="leading-tight"',
    'className="leading-tight truncate whitespace-nowrap"'
)
# Break-all for the curl command
text = text.replace(
    'className="font-bold text-[#6ba368] tracking-wide mt-1 truncate overflow-hidden max-w-[90vw] lg:max-w-full text-[clamp(1rem,3.5vw,1.5rem)] sm:text-[24px]">curl https://api.regeneliza.com/skill.md</span>',
    'className="font-bold text-[#6ba368] tracking-wide mt-1 break-all max-w-[90vw] lg:max-w-full text-[clamp(1rem,3.5vw,1.5rem)] sm:text-[24px]">curl https://api.regeneliza.com/skill.md</span>'
)
# Agents/Networks/Addresses
text = text.replace(
    'className="text-[#888888] font-mono tracking-wide text-sm whitespace-nowrap">BASE ID: 30121</span>',
    'className="text-[#888888] font-mono tracking-wide text-sm break-all">BASE ID: 30121</span>'
)
text = text.replace(
    'className="text-[#888888] font-mono tracking-wide text-sm whitespace-nowrap">CELO ID: 1851</span>',
    'className="text-[#888888] font-mono tracking-wide text-sm break-all">CELO ID: 1851</span>'
)
# Protocol manifest `<pre>` update
text = text.replace(
    '<pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]">',
    '<pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words overflow-x-auto drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]">'
)

# 5. REGEN ELIZA pixel title on mobile
text = text.replace(
    'text-[clamp(1.2rem,8vw,4rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden',
    'text-[clamp(1.5rem,8vw,4rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden'
)
# If the previous replace didn't hit because it was an exact copy from before:
text = text.replace(
    'text-[clamp(1.2rem,8vw,3rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden',
    'text-[clamp(1.5rem,8vw,4rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden'
)
text = re.sub(
    r'text-\[clamp\(1\.2rem,8vw,4rem\)\] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden',
    'text-[clamp(1.5rem,8vw,4rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden',
    text
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)
