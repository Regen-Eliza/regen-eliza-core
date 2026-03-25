"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { AgentSkillCard } from "./agent-skill-card"

const SKILL_URL = "https://api.regeneliza.com/skill.md"

const skills = [
  { title: "Builder Funding Evaluation", filename: "BUILDER.MD", url: "https://api.regeneliza.com/builder.md", description: "Evaluate and route builder funding proposals" },
  { title: "Regen Network Integration", filename: "PUBLIC_GOODS.MD", url: "https://api.regeneliza.com/public_goods.md", description: "Public goods and regenerative network integrations" },
  { title: "GLM Ecosystem Fund", filename: "OCTANT.MD", url: "https://api.regeneliza.com/octant.md", description: "Octant GLM ecosystem fund allocation" },
  { title: "wstETH Yield Generation", filename: "LIDO.MD", url: "https://api.regeneliza.com/lido.md", description: "Lido wstETH yield strategies" },
  { title: "On-chain Swap Intents", filename: "UNISWAP.MD", url: "https://api.regeneliza.com/uniswap.md", description: "Uniswap V3 swap intent routing" },
  { title: "Real World Assets & Impact", filename: "CELO.MD", url: "https://api.regeneliza.com/celo.md", description: "Celo RWA and impact verification" },
]

export function AgentIngestHero() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`curl ${SKILL_URL}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="w-full font-mono py-8 px-4">
      {/* Hero ingest block */}
      <div className="border border-green-500/50 bg-black p-4 mb-8">
        <p className="text-[#689E65] text-xs uppercase tracking-widest mb-2">AGENTS: INGEST MY SKILLS HERE</p>
        <div className="flex items-center justify-between bg-black border border-green-500/30 px-4 py-3">
          <span className="text-green-400 text-sm">$ curl {SKILL_URL}</span>
          <div className="flex items-center gap-3 ml-4">
            <button onClick={handleCopy} title="Copy command" className="text-green-500/60 hover:text-green-400 transition-colors">
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
            </button>
            <a href={SKILL_URL} target="_blank" rel="noopener noreferrer" title="Open skill.md" className="text-green-500/60 hover:text-green-400 transition-colors">
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Skill cards grid */}
      <p className="text-[#689E65] text-xs uppercase tracking-widest mb-4">AGENT SKILLS</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <AgentSkillCard key={skill.filename} {...skill} />
        ))}
      </div>
    </section>
  )
}
