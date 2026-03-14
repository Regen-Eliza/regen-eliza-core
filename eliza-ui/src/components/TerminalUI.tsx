import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AsciiRenderer, useTexture } from '@react-three/drei';
import { Mic, CornerDownLeft } from 'lucide-react';
import * as THREE from 'three';

// --- THREE.JS ASCII AVATAR COMPONENT ---
interface AsciiAvatarProps {
  avatarUrl: string;
  isSpeaking: boolean;
}

const AvatarPlane: React.FC<AsciiAvatarProps> = ({ avatarUrl, isSpeaking }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // NOTE: Depending on how the image is scaled, we might need to adjust aspect ratio
  const texture = useTexture(avatarUrl);

  const uniforms = useRef({
    uTime: { value: 0 },
    uSpeaking: { value: 0 },
    uTexture: { value: texture },
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.current.uTime.value = time;
    
    // Smooth damp the speaking state for organic start/stop of mouth movement
    const targetSpeak = isSpeaking ? 1.0 : 0.0;
    uniforms.current.uSpeaking.value += (targetSpeak - uniforms.current.uSpeaking.value) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      {/* Plane is divided into many segments (64x64) so vertices can be pushed/pulled by the shader */}
      <planeGeometry args={[5, 6, 64, 64]} />
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
            
            // 1. SUBTLE BREATHING (Global)
            // Sine wave running slowly up the Y axis, expanding the X axis
            float breath = sin(uTime * 1.5 - pos.y * 2.0) * 0.02;
            pos.x += pos.x * breath;
            pos.y += sin(uTime * 1.5) * 0.03; // Slight torso heave
            
            // 2. PROCEDURAL MOUTH/JAW MOVEMENT
            // We assume the face is roughly in the lower-middle of the image.
            // These UV boundaries (vUv.x, vUv.y) map to where the mouth usually is.
            // You may need to tweak these ranges depending on exactly where Regen Eliza's mouth is!
            
            // Target the lower half/chin area
            float isLowerFace = smoothstep(0.4, 0.1, vUv.y); 
            // Target the horizontal center (mouth width)
            float isCenterFace = smoothstep(0.8, 0.5, abs(vUv.x - 0.5) * 2.0); 
            
            // Combine limits to get a "mouth mask"
            float mouthMask = isLowerFace * isCenterFace;
            
            // Generate a fake audio waveform using combined high-frequency sine waves
            float chatter = (sin(uTime * 20.0) + sin(uTime * 14.3 + 1.2) * 0.5) * 0.5;
            // Only drop the jaw down (max 0 to 1)
            float jawDrop = max(0.0, chatter) * 0.25; 
            
            // Apply the deformation multiplied by whether the character is actively speaking
            pos.y -= jawDrop * mouthMask * uSpeaking;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uTexture;
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            
            // We return the raw texture color. 
            // AsciiRenderer intercepts this and converts brightness to characters.
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

  const elizaImageUrl = "/regen_eliza.jpg";

  const presetPrompts = [
    "Favorite project?",
    "What are you studying?",
    "What's your passion?"
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
    setTimeout(() => {
      setIsSpeaking(false);
    }, 2500 + Math.random() * 2000);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0c0c0c] text-[##efefef] font-mono selection:bg-[#B0FBCD]/20 selection:text-[#B0FBCD]">
      
      {/* HEADER - Matthew Petersen style large 8-bit text */}
      <header className="w-full pt-10 pb-2 text-center z-10 select-none">
        <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-bold text-white tracking-widest leading-none drop-shadow-md">
           REGEN ELIZA
        </h1>
      </header>
      
      {/* 3D ASCII AVATAR ZONE */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="w-full h-full max-w-5xl mx-auto absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            {/* The AsciiRenderer hijacks WebGL output and renders raw ASCII text */}
            <AsciiRenderer 
              fgColor="#B0FBCD" // Custom glowing terminal green
              bgColor="transparent" 
              characters=" .`-_':,;^=+<>i!lI?/\\|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@" // Extended mapping for more gradient detail
              resolution={0.18} // Size of ASCII characters
              invert={false}
            />
            <ambientLight intensity={1} />
            <React.Suspense fallback={null}>
              <AvatarPlane avatarUrl={elizaImageUrl} isSpeaking={isSpeaking} />
            </React.Suspense>
          </Canvas>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <div className="relative z-20 w-full max-w-[800px] mx-auto px-4 pb-10">
        <div className="border border-white/10 rounded-sm bg-black/40 backdrop-blur-sm p-4">
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            {/* Tiny icon left of the prompts layout */}
            <div className="hidden sm:flex text-white/30 mr-2 items-center justify-center">
              <span className="text-[10px]">◳</span>
            </div>
            
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="flex-1 w-full flex items-center gap-2 px-3 py-2 text-xs tracking-wider border border-white/10 rounded-sm bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#B0FBCD]/30 transition-all duration-200 text-white/60 hover:text-[#B0FBCD]"
              >
                <CornerDownLeft size={12} className="opacity-50" />
                {prompt}
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
              placeholder="Ask about Eliza"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            {/* Mic button (right aligned) */}
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-sm bg-white/5 hover:bg-[#B0FBCD]/10 text-white/50 hover:text-[#B0FBCD] border border-white/10 transition-all duration-200 ml-2"
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
            className="relative inline-flex h-4 w-8 items-center rounded-sm transition-colors duration-200 border border-white/20 bg-black/60"
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
          
          <span className="w-6">{conversationMode ? "ON" : "OFF"}</span>
        </div>
      </div>
    </div>
  );
}

