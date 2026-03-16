"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldCheck, Zap, Activity, Globe, Power } from "lucide-react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import SystemLogs from "./SystemLogs";
import { DonationService } from "../../eliza-ui/src/services/donationService";
import { voiceService } from "../../eliza-ui/src/services/voiceService";
import { generateFundingReport } from "../../eliza-ui/src/utils/reporter";
import { swapService } from "../../eliza-ui/src/services/swapService";
import { parseIntentAndExecuteTransfer } from "../../eliza-ui/src/utils/intentParser";
import Avatar from "./Avatar";

const defaultKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const privateKey = process.env.NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY || defaultKey;
const donationService = new DonationService(privateKey);

export default function SentientDashboard() {
  const { isListening, startListening, stopListening, getFrequency } = useAudioAnalyzer();
  const [reputation, setReputation] = useState(850);
  const [network, setNetwork] = useState("TESTNET");
  const [volume, setVolume] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportText, setReportText] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const requestRef = useRef<number>();

  const handleFund = async (category: "desci" | "eco" | "builders" | "agents") => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const amount = 100;
      const projects = await donationService.distributeFunds(category, amount);
      if (projects) {
        const report = generateFundingReport(projects);
        setReportText(""); // clear previous
        setTimeout(() => setReportText(report), 50); // Small delay to retrigger animation
        await voiceService.speak(report);
      } else {
        const errorMsg = "I encountered an issue trying to route funds.";
        setReportText("");
        setTimeout(() => setReportText(errorMsg), 50);
        await voiceService.speak(errorMsg);
      }
    } catch (e) {
      console.error(e);
      await voiceService.speak("An error occurred during communication.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwap = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const initMsg = "Initiating cross-chain swap from Base to Celo...";
      setReportText("");
      setTimeout(() => setReportText(initMsg), 50);
      
      const amount = "1"; // 1 USDC
      const fromChain = "8453"; // Base
      
      const receipt = await swapService.executeCrossChainSwap(amount, fromChain);
      
      if (receipt) {
        const report = "Cross-chain swap complete. I successfully bridged liquidity from Base into the Celo ecosystem.";
        setReportText(""); // clear previous
        setTimeout(() => setReportText(report), 50); // Small delay to retrigger animation
        await voiceService.speak(report);
      }
    } catch (e) {
      console.error(e);
      const errorMsg = "An error occurred during the cross-chain swap.";
      setReportText("");
      setTimeout(() => setReportText(errorMsg), 50);
      await voiceService.speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const initMsg = "Listening and parsing transfer command...";
      setReportText("");
      setTimeout(() => setReportText(initMsg), 50);
      
      // Simulating voice command input for the demo
      const voiceCommand = "Send 10 USDC to Alice";
      const result = await parseIntentAndExecuteTransfer(voiceCommand);
      
      if (result) {
        // We will offload this text generation to the reporter utility shortly
        const report = `Transfer complete. I successfully sent ${result.amount} ${result.symbol} to ${result.contact}.`;
        setReportText("");
        setTimeout(() => setReportText(report), 50);
        await voiceService.speak(report);
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || "An error occurred during the transfer.";
      setReportText("");
      setTimeout(() => setReportText(errorMsg), 50);
      await voiceService.speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleInitialize = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error("Microphone access denied or not available", e);
    } finally {
      setHasInitialized(true);
      setTimeout(() => {
        voiceService.speak("Hi, I am Regen Eliza. I am an autonomous ERC-8004 agent on Celo. I provide three core services: First, I can route donations to verified public goods projects. Second, I can swap stablecoins from Base and Arbitrum into Celo to fund these projects. And third, I can execute x402 direct payments to your saved contacts. How can I help you today?");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center relative overflow-hidden">

      {/* 🌌 Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black z-0" />
      <SystemLogs active={true} />

      {/* Initialization Modal */}
      <AnimatePresence>
        {!hasInitialized && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 text-green-400">System Initialization Required</h2>
              <button 
                onClick={handleInitialize}
                className="px-6 py-3 bg-green-500/10 border border-green-500/50 hover:bg-green-500/20 text-green-400 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
              >
                Initialize Audio & Microphone Permissions
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎛️ Top Controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button
          onClick={toggleNetwork}
          className={`px-3 py-1 text-xs border rounded-full transition-all ${network === "MAINNET" ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(74,222,128,0.4)]" : "border-yellow-500 text-yellow-500"}`}
        >
          ● {network}
        </button>
      </div>

      {/* 👤 Character Avatar */}
      <div className="relative z-0 -mb-16 w-64 h-64 mx-auto overflow-hidden rounded-t-full mask-image-gradient bg-zinc-900/50">
        <Avatar />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent pointer-events-none" />
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button 
            disabled={isProcessing}
            onClick={() => handleFund("desci")}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">Fund DeSci Projects</div>
          </button>
          <button 
            disabled={isProcessing}
            onClick={() => handleFund("eco")}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">Fund Eco Projects</div>
          </button>
          <button 
            disabled={isProcessing}
            onClick={() => handleFund("builders")}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">Support Builders</div>
          </button>
          <button 
            disabled={isProcessing}
            onClick={() => handleFund("agents")}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">Support Agents</div>
          </button>
        </div>

        {/* 🔥 Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <button 
            disabled={isProcessing}
            onClick={handleSwap}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">Cross-Chain Swaps (Squid Router)</div>
          </button>
          <button 
            disabled={isProcessing}
            onClick={handleDirectPayment}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] group disabled:opacity-50"
          >
            <div className="text-center font-bold text-sm text-zinc-300 group-hover:text-white">x402 Direct Payments</div>
          </button>
        </div>

        {/* Terminal Logs Box */}
        <AnimatePresence mode="wait">
          {reportText && (
            <motion.div 
              key={reportText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-black/60 border border-green-500/30 rounded-xl font-mono text-xs text-green-400 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
              <div className="mb-2 text-[10px] text-green-500/50 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Transaction Router Output
              </div>
              <p className="leading-relaxed">
                {reportText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span 
                  className="inline-block w-1.5 h-3 bg-green-500 ml-1 align-baseline"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-xs text-zinc-600">
          <span className="flex items-center gap-1"><Globe size={10} /> 8004SCAN.IO LINKED</span>
          <span>ID: 0x7a30...8004</span>
        </div>

      </motion.div>
    </div>
  );
}
