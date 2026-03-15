"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldCheck, Zap, Activity, Globe, Power } from "lucide-react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import SystemLogs from "./SystemLogs";

export default function SentientDashboard() {
  const { isListening, startListening, stopListening, getFrequency } = useAudioAnalyzer();
  const [reputation, setReputation] = useState(850);
  const [network, setNetwork] = useState("TESTNET");
  const [volume, setVolume] = useState(0);
  const requestRef = useRef<number>();

  // Animation Loop for Audio Visualization
  const animate = () => {
    if (isListening) {
      const vol = getFrequency();
      setVolume(vol); // Values typically 0-255
    } else {
      setVolume(0);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isListening]);

  const toggleMic = () => isListening ? stopListening() : startListening();
  const toggleNetwork = () => setNetwork(prev => prev === "TESTNET" ? "MAINNET" : "TESTNET");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center relative overflow-hidden">

      {/* 🌌 Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black z-0" />
      <SystemLogs active={true} />

      {/* 🎛️ Top Controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button
          onClick={toggleNetwork}
          className={`px-3 py-1 text-xs border rounded-full transition-all ${network === "MAINNET" ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(74,222,128,0.4)]" : "border-yellow-500 text-yellow-500"}`}
        >
          ● {network}
        </button>
      </div>

      {/* 👤 Character Video */}
      <div className="relative z-0 -mb-16 w-64 h-64 mx-auto overflow-hidden rounded-t-full mask-image-gradient">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90 scale-110"
        >
          <source src="/videos/Reliza_Jacket_vid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />
      </div>

      {/* 🪪 The Card */}
      <motion.div className="z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">

        {/* Verification Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-1 rounded-full text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <ShieldCheck size={14} /> ERC-8004 VERIFIED
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8 mt-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              REGEN ELIZA
            </h1>
            <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${network === "MAINNET" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
              SYSTEM ONLINE • {network}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Reputation</div>
            <div className="text-5xl font-bold text-green-400 tabular-nums">{reputation}</div>
          </div>
        </div>

        {/* 🎙️ THE LIVING AUDIO CORE */}
        <div
          onClick={toggleMic}
          className="h-40 w-full bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:border-green-500/30"
        >
          {/* The Orb */}
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 blur-md absolute z-10"
            animate={{
              scale: 1 + (volume / 50),
              opacity: 0.5 + (volume / 300)
            }}
          />
          <motion.div
            className="w-12 h-12 rounded-full bg-white absolute z-20 mix-blend-overlay"
            animate={{ scale: 1 + (volume / 60) }}
          />

          {/* Ripples */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 0, scale: 3 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute w-16 h-16 border border-green-500/30 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute w-16 h-16 border border-blue-500/30 rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 text-xs text-zinc-400 flex items-center gap-2 group-hover:text-green-400 transition-colors z-30 font-bold tracking-widest">
            {isListening ? <><Mic size={12} className="text-red-500 animate-pulse" /> LISTENING ({Math.round(volume)})</> : <><Power size={12} /> ACTIVATE VOICE CORE</>}
          </div>
        </div>

        {/* ⚡ Features */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] group">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Activity size={18} /></div>
            <div className="text-left">
              <div className="text-sm font-bold">Start Game</div>
              <div className="text-xs text-zinc-500">Dice Roll Protocol</div>
            </div>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] group">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Zap size={18} /></div>
            <div className="text-left">
              <div className="text-sm font-bold">Send Funds</div>
              <div className="text-xs text-zinc-500">Cross-Border (Celo)</div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-xs text-zinc-600">
          <span className="flex items-center gap-1"><Globe size={10} /> 8004SCAN.IO LINKED</span>
          <span>ID: 0x7a30...8004</span>
        </div>

      </motion.div>
    </div>
  );
}
