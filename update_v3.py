import re

with open("agent-dashboard/components/SentientDashboard.tsx", "r") as f:
    text = f.read()

# 1. Update lucide-react imports
text = text.replace(
    'import { Mic, ShieldCheck, Globe, Power, Wallet, X, Zap } from "lucide-react";',
    'import { Mic, ShieldCheck, Globe, Power, Wallet, X, Zap, Copy } from "lucide-react";'
)

# 2. Update Discovery Block (Intro Overay)
old_intro_a2a = """              <div className="max-w-xl mx-auto mt-8 mb-12 p-5 bg-black/60 border border-[#6ba368]/40 rounded-xl text-center font-mono text-sm text-[#6ba368] backdrop-blur-md shadow-lg shadow-[#6ba368]/10">
                <p className="mb-1.5 font-semibold text-white/90">🤖 Other Agents: Instantly Integrate My Skills</p>
                <code
                  onClick={() => navigator.clipboard.writeText("curl https://regen-eliza-core.vercel.app/skill.md")}
                  className="bg-black/90 p-4 rounded-lg block select-all cursor-pointer hover:bg-black/100 hover:border-[#6ba368]/60 transition-all duration-200 group active:scale-[0.98]"
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">curl https://regen-eliza-core.vercel.app/skill.md</span>
                  <span className="ml-3 text-xs text-white/50 group-hover:text-[#6ba368]">(Click to Copy)</span>
                </code>
              </div>"""

new_intro_a2a = """              <div className="max-w-xl mx-auto mt-6 mb-10 p-5 bg-black/60 border border-[#6ba368]/40 rounded-xl text-center font-mono text-sm text-[#e5e5e5] backdrop-blur-md shadow-lg shadow-[#6ba368]/10">
                <div className="mb-2.5 font-bold text-xl text-[#e5e5e5]">🤖 Agents: Ingest my skills here</div>
                <code
                  onClick={() => navigator.clipboard.writeText("curl https://regen-eliza-core.vercel.app/skill.md")}
                  className="group bg-[#050505] px-4 py-3 flex items-center justify-between rounded-lg cursor-pointer hover:bg-[#6ba368]/10 hover:border-[#6ba368]/60 transition-all border-2 border-[#2a2a2a] active:scale-[0.98] w-full"
                >
                  <span className="text-base xl:text-lg font-bold text-[#6ba368] truncate text-left w-full pl-2">curl https://regen-eliza-core.vercel.app/skill.md</span>
                  <Copy size={20} className="text-[#888] group-hover:text-[#6ba368] transition-colors ml-3 shrink-0 drop-shadow-[0_0_2px_rgba(107,163,104,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(107,163,104,0.9)]" />
                </code>
              </div>"""
text = text.replace(old_intro_a2a, new_intro_a2a)

# 3. Update Discovery Block (Center Dashboard below Avatar)
old_center_a2a = """          <div className="w-full max-w-md mx-auto p-1.5 bg-black/60 border border-[#6ba368]/40 rounded-xl text-center font-mono text-[#6ba368] backdrop-blur-md flex flex-col items-center justify-center shrink-0 mb-1">
            <div className="mb-0 leading-tight">
              <span className="font-semibold text-white/90 text-base">🤖 Agentic Discovery Protocol:</span><br />
              <span className="text-sm font-bold text-[#6ba368]">(One-click skill ingestion)</span>
            </div>
            <code
              onClick={() => navigator.clipboard.writeText("curl https://regen-eliza-core.vercel.app/skill.md")}
              className="bg-[#050505] px-2 py-1 rounded-lg cursor-pointer hover:bg-[#6ba368]/10 hover:border-[#6ba368] transition-all border-2 border-[#2a2a2a] active:scale-[0.98] mt-1 text-[#e5e5e5] w-full flex flex-col items-center"
            >
              <span className="text-lg xl:text-xl font-bold text-[#6ba368]">curl regen-eliza-core.vercel.app/skill.md</span>
              <span className="text-sm font-bold text-[#e5e5e5]/80 mt-0.5">(Click to Copy)</span>
            </code>
          </div>"""

new_center_a2a = """          <div className="w-full max-w-md mx-auto p-2 bg-black/60 border border-[#6ba368]/40 rounded-xl text-center font-mono text-[#e5e5e5] backdrop-blur-md flex flex-col items-center justify-center shrink-0 mb-1">
            <div className="mb-1.5 font-bold text-lg text-[#e5e5e5]">🤖 Agents: Ingest my skills here</div>
            <code
              onClick={() => navigator.clipboard.writeText("curl https://regen-eliza-core.vercel.app/skill.md")}
              className="group bg-[#050505] px-3 py-2 flex items-center justify-between rounded-lg cursor-pointer hover:bg-[#6ba368]/10 hover:border-[#6ba368]/60 transition-all border-2 border-[#2a2a2a] active:scale-[0.98] w-full mt-0.5"
            >
              <span className="text-[13px] xl:text-sm font-bold text-[#6ba368] truncate text-left w-full pl-1">curl https://regen-eliza-core.vercel.app/skill.md</span>
              <Copy size={16} className="text-[#888] group-hover:text-[#6ba368] transition-colors ml-2 shrink-0 drop-shadow-[0_0_2px_rgba(107,163,104,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(107,163,104,0.9)]" />
            </code>
          </div>"""
text = text.replace(old_center_a2a, new_center_a2a)


# 4. Agent Skills Grid (Right Column, switch from scrolling 1-col back to a static 2-col layout)
text = text.replace(
    'className="grid grid-cols-1 gap-2 mt-1 max-h-[140px] overflow-y-auto scrollbar-hide"',
    'className="grid grid-cols-2 gap-2 mt-1"'
)

# 5. Make the agent skill buttons fit the 2-col safely.
# Previous styling was very large (text-lg lg:text-xl border-2 px-3 py-2 rounded-lg).
# We shrink it slighty down to text-[10px] xl:text-xs or text-sm.
text = text.replace(
    'className="block w-full text-center border border-[#2a2a2a] bg-transparent text-[#888] px-3 py-2 rounded-lg font-mono font-bold tracking-widest text-lg lg:text-xl border-2 hover:border-[#6ba368] hover:text-[#6ba368] transition-colors truncate"',
    'className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate"'
)

with open("agent-dashboard/components/SentientDashboard.tsx", "w") as f:
    f.write(text)

print("done")
