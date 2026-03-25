"use client"

import { useState } from "react"
import { Copy, ExternalLink, Check } from "lucide-react"

interface AgentSkillCardProps {
  title: string
  filename: string
  url: string
  description: string
}

export function AgentSkillCard({ title, filename, url, description }: AgentSkillCardProps) {
  const [copied, setCopied] = useState(false)

  const curlCommand = `curl ${url}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curlCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-green-500/30 bg-black/60 p-4 font-mono hover:border-green-500/70 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#689E65] text-xs uppercase tracking-widest">{filename}</span>
        <div className="flex items-center gap-2">
          {/* Copy curl command */}
          <button
            onClick={handleCopy}
            title="Copy curl command"
            className="text-green-500/60 hover:text-green-400 transition-colors p-1"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
          {/* Open in new tab */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="text-green-500/60 hover:text-green-400 transition-colors p-1"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      <p className="text-green-500 text-sm font-semibold mb-1">{title}</p>
      <p className="text-green-500/60 text-xs">{description}</p>
      <div className="mt-3 bg-black border border-green-500/20 px-3 py-2 text-xs text-green-500/50 flex items-center justify-between">
        <span>$ curl {url}</span>
      </div>
    </div>
  )
}

