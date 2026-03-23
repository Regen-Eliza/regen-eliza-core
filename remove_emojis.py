import re

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# Replace the Agent Ingest Box emoji
text = text.replace(
    '<span className="text-sm text-[#FFFFFF] font-bold uppercase tracking-widest mb-1 opacity-80">🤖 AGENTS: Ingest My Skills Here</span>',
    '<span className="text-sm text-[#FFFFFF] font-bold uppercase tracking-widest mb-1 opacity-80 flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-sm bg-[#6ba368] animate-pulse" /> AGENTS: Ingest My Skills Here</span>'
)

# Replace the Agent Skills list emojis
text = text.replace(
    '<span className="mr-1 text-base shrink-0" style={{ fontFamily: \'"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", sans-serif\' }}>🤖</span>',
    '<div className="w-1.5 h-1.5 rounded-sm bg-[#6ba368] shrink-0 mr-2 opacity-80"></div>'
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)
