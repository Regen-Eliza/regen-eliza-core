import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AsciiRenderer, useTexture } from '@react-three/drei';
import { Mic, Send } from 'lucide-react';
import * as THREE from 'three';

// --- THREE.JS ASCII AVATAR COMPONENT ---
// This handles the animated image in the scene and converts it via AsciiRenderer
interface AsciiAvatarProps {
  avatarUrl: string;
  isSpeaking: boolean;
  intensity?: number;
}

const AvatarPlane: React.FC<AsciiAvatarProps> = ({ avatarUrl, isSpeaking }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(avatarUrl);

  // Advanced simple shader to simulate breathing and a stylized "talking" jaw/mouth warp
  const uniforms = useRef({
    uTime: { value: 0 },
    uSpeaking: { value: 0 },
    uTexture: { value: texture },
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.current.uTime.value = time;
    
    // Lerp the speaking uniform for smooth transitions
    const targetSpeak = isSpeaking ? 1.0 : 0.0;
    uniforms.current.uSpeaking.value += (targetSpeak - uniforms.current.uSpeaking.value) * 0.1;

    // Optional: add a slight global scale/breathing effect to the plane
    if (meshRef.current) {
      const breath = Math.sin(time * 2) * 0.01;
      meshRef.current.scale.set(1 + breath, 1 + breath, 1);
    }
  });

  // A custom shader material gives us finer control over the 2D image distortion
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4, 32, 32]} />
      <shaderMaterial
        transparent
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uSpeaking;
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Subtle "breathing" warp across the Y axis
            pos.z += sin(pos.y * 5.0 + uTime * 2.0) * 0.05;
            
            // "Speaking" distortion focused on the lower half of the image (mouth area)
            // Assumes a centered portrait image where mouth is roughly at y < 0
            float mouthArea = smoothstep(0.0, -1.0, pos.y);
            float talkWarp = sin(uTime * 15.0) * mouthArea * uSpeaking * 0.15;
            pos.y += talkWarp;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uTexture;
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            // Boost contrast slightly to make ASCII characters pop better
            texColor.rgb = smoothstep(0.1, 0.9, texColor.rgb);
            gl_FragColor = texColor;
          }
        `}
      />
    </mesh>
  );
};

// --- MAIN TERMINAL UI COMPONENT ---
export default function TerminalUI() {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);

  // We are defaulting to a generated URL for demonstration purposes.
  // The user should replace this directly with the 2D image they have.
  const elizaImageUrl = "/avatar-placeholder.png";

  const presetPrompts = [
    "How does MEI work?",
    "Languages you speak?",
    "What's your passion?",
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
    // Triggers "speaking" animation logic
    setIsSpeaking(true);
    setInputText("");
    
    // Simulate end of speaking after a random short duration
    setTimeout(() => {
      setIsSpeaking(false);
    }, 2000 + Math.random() * 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-[#00FF00] font-mono selection:bg-[#00FF00]/20">
      
      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 p-8 text-center z-10 pointer-events-none">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.2em] font-mono">
          REGEN ELIZA
        </h1>
      </header>
      
      {/* 3D ASCII AVATAR RENDERER ZONE */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Glow behind the avatar */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[500px] h-[500px] bg-[#00FF00]/[0.05] blur-[100px] rounded-full" />
        </div>

        <div className="w-full h-full max-w-4xl mx-auto absolute inset-0 pt-20 pb-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            {/* The AsciiRenderer hijacks the WebGL output and renders raw ASCII text */}
            {/* fgColor set to Matrix green, bgColor invisible */}
            <AsciiRenderer 
              fgColor="#00FF00" 
              bgColor="transparent" 
              characters=" .:-+*=%@#" // Mapping luminance to these chars
              resolution={0.15} // Scale determining 'pixel' text size
            />
            {/* Ambient light purely as fallback but our shader doesn't need it mathematically */}
            <ambientLight intensity={1} />
            <React.Suspense fallback={null}>
              <AvatarPlane avatarUrl={elizaImageUrl} isSpeaking={isSpeaking} />
            </React.Suspense>
          </Canvas>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 pb-8">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {presetPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm tracking-wider uppercase border border-[#00FF00]/20 rounded bg-[#00FF00]/[0.02] hover:bg-[#00FF00]/10 hover:border-[#00FF00]/50 transition-all duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="opacity-70">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Container */}
        <form 
          onSubmit={handleFormSubmit}
          className="flex items-center w-full border border-[#00FF00]/20 bg-[#00FF00]/[0.02] rounded pl-4 pr-2 py-2 focus-within:border-[#00FF00]/50 transition-all duration-300"
        >
          <div className="mr-3 text-[#00FF00]/50 shrink-0">
             {/* Mimics the visual terminal blinker or chevron */}
             <span className="animate-pulse">❯</span>
          </div>
          
          <input
            type="text"
            className="flex-1 bg-transparent outline-none placeholder-[#00FF00]/30 text-[#00FF00]"
            placeholder="Ask about Eliza"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          {/* Submit / Mic / Send mechanism */}
          <button
            type={inputText.trim() ? "submit" : "button"}
            className="flex items-center justify-center p-2 rounded bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 ml-2 transition-all duration-300 pointer-events-auto"
          >
            {inputText.trim() ? <Send size={16} /> : <Mic size={16} />}
          </button>
        </form>

        {/* Conversation Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs tracking-[0.2em] font-mono text-[#00FF00]/70">
          <span>CONVERSATION MODE</span>
          
          {/* Switch */}
          <button
            type="button"
            onClick={() => setConversationMode(!conversationMode)}
            className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 border border-[#00FF00]/40"
            style={{ backgroundColor: conversationMode ? 'rgba(0, 255, 0, 0.2)' : 'transparent' }}
          >
            <span 
               className="inline-block h-3.5 w-3.5 transform rounded-full bg-[#00FF00] transition-transform duration-300 shadow-[0_0_8px_#00FF00]"
               style={{ transform: conversationMode ? 'translateX(22px)' : 'translateX(3px)' }}
            />
          </button>
          
          <span className="w-8">{conversationMode ? "ON" : "OFF"}</span>
        </div>
      </div>
      
      {/* OPTIONAL CSS-BASED CRT FLICKER / SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-10" style={{
        background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`,
        backgroundSize: "100% 2px, 3px 100%"
      }}/>
    </div>
  );
}
