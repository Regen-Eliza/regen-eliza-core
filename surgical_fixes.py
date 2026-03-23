import re

with open('agent-dashboard/components/SentientDashboard.tsx', 'r') as f:
    text = f.read()

# Fix 1: Broken title on mobile
text = text.replace(
    '<h1 className="font-mono font-bold text-[#00FF41] text-[clamp(2rem,8vw,3rem)] tracking-wider drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] text-center leading-none">REGEN ELIZA</h1>',
    '<h1 className="font-mono font-bold text-[#00FF41] text-[clamp(1.2rem,8vw,4rem)] tracking-normal sm:tracking-widest whitespace-nowrap overflow-hidden drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] text-center leading-none" style={{ fontFamily: "\'VT323\', monospace" }}>REGEN ELIZA</h1>'
)

# Fix 2: Emoji not rendering
text = text.replace(
    '<span className="text-[#6ba368] shrink-0">⚡</span>',
    '<span className="text-base shrink-0" style={{ fontFamily: \'"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", sans-serif\' }}>🤖</span>'
)

# Fix 3: Protocol Manifest Fetch
# Add state to top
if 'const [manifestContent, setManifestContent]' not in text:
    state_injection = """  const [manifestContent, setManifestContent] = useState<string>("Loading manifest...");
  useEffect(() => {
    fetch("https://api.regeneliza.com/skill.md", { mode: "cors" })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.text();
      })
      .then(text => setManifestContent(text))
      .catch(err => {
        console.error("Fetch manifest failed", err);
        setManifestContent("Error: skill.md unavailable. Operating in baseline mode.");
      });
  }, []);"""
    text = text.replace('  const [logs, setLogs] = useState<string[]>([]);', f"{state_injection}\n  const [logs, setLogs] = useState<string[]>([]);")

# Replace children with manifestContent
text = text.replace(
    """<pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]">
                {children}
              </pre>""",
    """<pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]">
                {manifestContent || children}
              </pre>"""
)

# Fix 4: Mobile page cannot scroll
text = text.replace(
    'className="flex flex-col h-screen w-full bg-[#050505] text-[#e5e5e5] overflow-hidden scanlines"',
    'className="flex flex-col min-h-screen w-full bg-[#050505] text-[#e5e5e5] scanlines"'
)
text = text.replace(
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-[100dvh] lg:min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4 px-4 sm:px-6 lg:px-8"',
    'className="w-full max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 z-10 pb-4 px-4 sm:px-6 lg:px-8"'
)
# Ensure columns can stack naturally on flex flex-col instead of blowing up height
text = text.replace(
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"',
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3 order-2 lg:order-none mt-8 lg:mt-0"'
)
text = text.replace(
    'className="min-h-[70vh] sm:min-h-[450px] lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"',
    'className="h-auto lg:h-full flex flex-col relative w-full z-20 order-1 lg:order-none mb-4 lg:mb-0 lg:col-span-6"'
)
text = text.replace(
    'className="h-full flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"',
    'className="h-auto lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto scrollbar-hide pr-1 pb-8 lg:col-span-3 order-3 lg:order-none w-full"'
)

with open('agent-dashboard/components/SentientDashboard.tsx', 'w') as f:
    f.write(text)


with open('agent-dashboard/app/globals.css', 'r') as f:
    css = f.read()

# Fix 4 css body overrides
css = css.replace(
    """body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Courier New', monospace;
  margin: 0;
  overflow: hidden;
}""",
    """body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Courier New', monospace;
  margin: 0;
}
html, body {
  overflow-x: hidden;
  overflow-y: auto;
  height: auto;
  min-height: 100vh;
}"""
)

with open('agent-dashboard/app/globals.css', 'w') as f:
    f.write(css)
