import React, { useState } from 'react';
import { Mic, CornerDownLeft } from 'lucide-react';

export default function TerminalUI() {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);

  // Future integration point for the animated talking GIF
  const staticImageUrl = "/regen_eliza.jpg";
  const talkingImageUrl = "/regen_eliza_talking.gif"; // Will fallback to alt styling if missing
  const currentImageUrl = isSpeaking ? talkingImageUrl : staticImageUrl;

  const presetPrompts = [
    "Send USDm to Alice (voice command)",
    "Donate to 5 good DeSci Projects",
    "Deposit in a Vault and find profitsY"
  ];

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    simulateAgentResponse();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    simulateAgentResponse();
  };

  const simulateAgentResponse = () => {
    setIsSpeaking(true);
    setInputText("");
    
    // Simulate conversation happening for a variable duration
    setTimeout(() => {
      setIsSpeaking(false);
    }, 2500 + Math.random() * 2000);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0c0c0c] font-mono selection:bg-[#B0FBCD]/20 selection:text-[#B0FBCD]">
      
      {/* HEADER - Matthew Petersen style large 8-bit text */}
      <header className="w-full pt-10 pb-2 text-center z-10 select-none">
        <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-bold text-white tracking-widest leading-none drop-shadow-md">
           REGEN ELIZA
        </h1>
      </header>
      
      {/* 2D AVATAR ZONE WITH CSS FILTERS */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6">
        {/* Glow behind the avatar area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[400px] h-[400px] bg-[#B0FBCD]/[0.08] blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-md aspect-square mx-auto flex items-center justify-center">
             <img 
               src={currentImageUrl} 
               alt="Regen Eliza Avatar"
               className="w-full h-full object-cover rounded shadow-lg transition-transform duration-[2000ms] ease-out"
               // We fallback to standard jpg if the gif path 404s locally. 
               onError={(e) => { e.currentTarget.src = staticImageUrl; }}
               style={{ 
                 // Applies a heavy cyber-green filter over the 2D image, mimicking an old green phosphor monitor.
                 // This forces a purple/yellow portrait into stark contrast terminal greens.
                 filter: "sepia(100%) hue-rotate(70deg) saturate(300%) contrast(150%) blur(0.5px)",
                 // Slight subtle breathing effect via standard CSS transform scaling
                 transform: !isSpeaking ? "scale(1.0)" : "scale(1.02)",
               }}
             />

             {/* Optional: Add scanline overlay directly over the image to maintain the cyberdeck vibe */}
             <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                background: "repeating-linear-gradient(transparent, transparent 2px, black 3px, black 4px)",
             }}/>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="relative z-20 w-full max-w-[800px] mx-auto px-4 pb-10">
        <div className="border border-white/10 rounded-sm bg-black/40 backdrop-blur-sm p-4">
          
          {/* Quick Action Buttons - Adjusted Flexbox for wrapping and clean padding */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm tracking-wider border border-white/10 rounded-sm bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#B0FBCD]/30 transition-all duration-200 text-white/60 hover:text-[#B0FBCD] text-left shrink-0 max-w-full"
              >
                <CornerDownLeft size={12} className="opacity-50 shrink-0" />
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>

          {/* Text Input Container */}
          <form 
            onSubmit={handleFormSubmit}
            className="flex items-center w-full min-h-[50px] border border-white/10 bg-white/[0.02] rounded-sm pl-4 pr-3 py-2 focus-within:border-[#B0FBCD]/50 transition-all duration-200"
          >
            <div className="mr-3 text-white/40 shrink-0 font-bold tracking-widest">
               ∷
            </div>
            
            <input
              type="text"
              className="flex-1 bg-transparent outline-none placeholder-white/30 text-[#B0FBCD] text-sm"
              placeholder="Ask about Regen Eliza or use a voice command..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            {/* Mic button (right aligned) */}
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-sm bg-white/5 hover:bg-[#B0FBCD]/10 text-white/50 hover:text-[#B0FBCD] border border-white/10 transition-all duration-200 ml-2 shrink-0"
            >
              <Mic size={14} />
            </button>
          </form>
        </div>

        {/* Conversation Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[10px] tracking-[0.2em] font-mono text-white/40">
          <span>CONVERSATION MODE</span>
          
          {/* Switch */}
          <button
            type="button"
            onClick={() => setConversationMode(!conversationMode)}
            className="relative inline-flex h-4 w-8 items-center rounded-sm transition-colors duration-200 border border-white/20 bg-black/60 shrink-0"
            style={{ borderColor: conversationMode ? 'rgba(176,251,205,0.4)' : '' }}
          >
            <span 
               className="inline-block h-3 w-3 transform rounded-sm transition-transform duration-200"
               style={{ 
                 backgroundColor: conversationMode ? '#B0FBCD' : 'rgba(255,255,255,0.4)',
                 transform: conversationMode ? 'translateX(14px)' : 'translateX(2px)' 
               }}
            />
          </button>
          
          <span className="w-6 shrink-0">{conversationMode ? "ON" : "OFF"}</span>
        </div>
      </div>
    </div>
  );
}

