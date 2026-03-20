"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldCheck, Globe, Power, Wallet, X, Zap, Copy } from "lucide-react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { DonationService } from "../services/donationService";
import { voiceService } from "../services/voiceService";
import { generateFundingReport, generateTransferReport } from "../utils/reporter";
import { swapService } from "../services/swapService";
import { parseIntentAndExecuteTransfer } from "../utils/intentParser";
import contacts from "../data/contacts.json";
import { executeDonation } from "../app/actions/transaction";
import { getAgentScore } from "../app/actions/getRepScore";
import Avatar from './Avatar';
import type { AvatarState } from './Avatar';

const defaultKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const privateKey = process.env.NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY || defaultKey;
const donationService = new DonationService(privateKey);

/* ─── ASCII TITLE ─── */
const ASCII_TITLE = `
   ██████  ███████ ██████  ███████ ███    ██     ███████ ██      ██ ███████ ███████ 
   ██   ██ ██      ██      ██      ████   ██     ██      ██      ██    ███  ██   ██ 
   ██████  █████   ██  ███ █████   ██ ██  ██     █████   ██      ██   ███   ███████ 
   ██   ██ ██      ██   ██ ██      ██  ██ ██     ██      ██      ██  ███    ██   ██ 
   ██   ██ ███████  ██████ ███████ ██   ████     ███████ ███████ ██ ███████ ██   ██ 
`;

/* ─── Color Palette ─── */
const C = {
  green: "#064006",   // neon — headers, borders, indicators only
  muted: "#d0d0d0",   // off-white — body text, buttons, logs
  dim: "#888888",   // dimmed — secondary info
  dimGreen: "#064006",   // kept for reference in borders/dots
};

export default function SentientDashboard({ children }: { children?: React.ReactNode }) {
  const { isListening, startListening, stopListening, getFrequency } = useAudioAnalyzer();
  const { isListeningSpeech, startListeningSpeech, stopListeningSpeech, transcript, setTranscript } = useSpeechRecognition();
  const [reputation, setReputation] = useState<number | string>("SYNCING...");
  const [network, setNetwork] = useState("TESTNET");
  const [activeChain, setActiveChain] = useState<'CELO' | 'BASE'>('CELO');

  useEffect(() => {
    async function fetchScore() {
      setReputation("SYNCING...");
      const id = activeChain === 'CELO' ? "1851" : "30121";
      const chainId = activeChain === 'CELO' ? 42220 : 8453;
      const score = await getAgentScore(chainId, id);
      setReputation(score !== null ? score : "SYNCING...");
    }
    fetchScore();
  }, [activeChain]);
  const [volume, setVolume] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reportText, setReportText] = useState("");

  const [logs, setLogs] = useState<string[]>([]);
  const requestRef = useRef<number | undefined>(undefined);

  /* ─── Swap Confirmation Modal State ─── */
  const [swapModal, setSwapModal] = useState<{
    open: boolean;
    amount: string;
    fromToken: string;
    toToken: string;
  }>({ open: false, amount: "1", fromToken: "USDC", toToken: "USDT" });

  /* ─── Logging helper ─── */
  const pushLog = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev].slice(0, 50));

  const handleFund = async (category: "desci" | "eco" | "builders" | "agents") => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      pushLog(`FUND ${category.toUpperCase()} — routing 100 USDT...`);
      const amount = 100;
      const projects = await donationService.distributeFunds(category, amount);
      if (projects) {
        const report = generateFundingReport(projects);
        setReportText("");
        setTimeout(() => setReportText(report), 50);
        pushLog(`SUCCESS — funded ${projects.length} project(s)`);
        setIsSpeaking(true);
        await voiceService.speak(report);
        setIsSpeaking(false);
      } else {
        const errorMsg = "I encountered an issue trying to route funds.";
        setReportText("");
        setTimeout(() => setReportText(errorMsg), 50);
        pushLog("ERROR — could not route funds");
        setIsSpeaking(true);
        await voiceService.speak(errorMsg);
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      pushLog("ERROR — communication failure");
      setIsSpeaking(true);
      await voiceService.speak("An error occurred during communication.");
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ─── On-Chain Micro-Donation via Server Action ─── */
  const handleOnChainDonation = async (target: "ecology" | "builders") => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      pushLog(`BASE TX — sending 0.0001 ETH micro-donation to ${target.toUpperCase()}...`);
      setReportText("");
      setTimeout(() => setReportText(`Executing on-chain micro-donation to ${target} on Base Mainnet...`), 50);

      const result = await executeDonation(target);

      if (result.success && result.txHash) {
        pushLog(`TX SUCCESS: ${result.txHash.slice(0, 22)}...`);
        const report = `On-chain donation confirmed on ${result.network}.\nTarget: ${result.target}\nAmount: ${result.amount} ETH\nTX: ${result.txHash}`;
        setReportText("");
        setTimeout(() => setReportText(report), 50);
        setIsSpeaking(true);
        await voiceService.speak(`Micro-donation to ${target} confirmed on Base. Transaction hash: ${result.txHash.slice(0, 18)}`);
        setIsSpeaking(false);
      } else {
        pushLog(`TX FAILED — ${result.error}`);
        const errorMsg = `On-chain donation failed: ${result.error}`;
        setReportText("");
        setTimeout(() => setReportText(errorMsg), 50);
        setIsSpeaking(true);
        await voiceService.speak(`The on-chain donation to ${target} could not be completed. ${result.error}`);
        setIsSpeaking(false);
      }
    } catch (e: any) {
      console.error(e);
      pushLog(`ERROR — ${e.message || "on-chain donation failed"}`);
      setIsSpeaking(true);
      await voiceService.speak("An error occurred during the on-chain transaction.");
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ─── Opens the confirmation modal instead of executing immediately ─── */
  const handleSwapRequest = (amount = "1", fromToken = "USDC", toToken = "USDT") => {
    setSwapModal({ open: true, amount, fromToken, toToken });
    pushLog(`SWAP — preview: ${amount} ${fromToken} → ${toToken}`);
  };

  /* ─── Executes the real swap after user confirms ─── */
  const handleSwapConfirm = async () => {
    const { amount, fromToken, toToken } = swapModal;
    setSwapModal(prev => ({ ...prev, open: false }));
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      pushLog(`SWAP — executing ${amount} ${fromToken} → ${toToken} on-chain...`);
      const initMsg = `Executing swap: ${amount} ${fromToken} → ${toToken} via Uniswap on Celo...`;
      setReportText("");
      setTimeout(() => setReportText(initMsg), 50);
      const receipt = await swapService.executeSwap(amount, fromToken, toToken);
      const report = `Swap confirmed on Celo. TX: ${receipt.transactionHash}`;
      setReportText("");
      setTimeout(() => setReportText(report), 50);
      pushLog(`SWAP OK — tx: ${receipt.transactionHash?.slice(0, 18)}...`);
      setIsSpeaking(true);
      await voiceService.speak("Swap complete. The trade was successfully executed via the Uniswap protocol on Celo.");
      setIsSpeaking(false);
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || "Swap execution failed.";
      pushLog(`ERROR — ${errorMsg.slice(0, 60)}`);
      setReportText("");
      setTimeout(() => setReportText(`Swap failed: ${errorMsg}`), 50);
      setIsSpeaking(true);
      await voiceService.speak("The swap could not be completed. " + errorMsg.split('.')[0]);
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      pushLog("x402 PAY — parsing transfer command...");
      const initMsg = "Listening and parsing transfer command...";
      setReportText("");
      setTimeout(() => setReportText(initMsg), 50);
      const voiceCommand = "Send 10 USDC to Alice";
      const result = await parseIntentAndExecuteTransfer(voiceCommand);
      if (result) {
        const report = generateTransferReport(result.amount, result.symbol, result.contact);
        setReportText("");
        setTimeout(() => setReportText(report), 50);
        pushLog(`TRANSFER OK — ${result.amount} ${result.symbol} → ${result.contact}`);
        setIsSpeaking(true);
        await voiceService.speak(report);
        setIsSpeaking(false);
      }
    } catch (e: any) {
      console.error(e);
      pushLog(`ERROR — ${e.message || "transfer failed"}`);
      const errorMsg = e.message || "An error occurred during the transfer.";
      setReportText("");
      setTimeout(() => setReportText(errorMsg), 50);
      setIsSpeaking(true);
      await voiceService.speak(errorMsg);
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const animate = () => {
    if (isListening) {
      const vol = getFrequency();
      setVolume(vol);
    } else {
      setVolume(0);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isListening]);

  const toggleMic = () => {
    if (isListening || isListeningSpeech) {
      stopListening();
      stopListeningSpeech();
      pushLog("MIC OFF");
    } else {
      startListening();
      startListeningSpeech();
      pushLog("MIC ON — listening for voice commands...");
    }
  };
  const toggleNetwork = () => {
    setNetwork(prev => prev === "TESTNET" ? "MAINNET" : "TESTNET");
    pushLog(`NETWORK — switched to ${network === "TESTNET" ? "MAINNET" : "TESTNET"}`);
  };

  const handleVoiceCommand = async (command: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      pushLog(`VOICE CMD: "${command}"`);
      const userLog = `> User: ${command}\n\n`;
      setReportText(userLog + "> System: Processing...");
      const result = await parseIntentAndExecuteTransfer(command);
      if (result) {
        // Swap intents go through the confirmation modal
        if (result.type === "swap" && result.needsConfirmation) {
          setIsProcessing(false);
          handleSwapRequest(result.amount, result.fromToken, result.toToken);
          setReportText("");
          setTimeout(() => setReportText(`> Intent parsed. Swap ${result.amount} ${result.fromToken} → ${result.toToken}. Awaiting confirmation...`), 50);
          return;
        }

        let report = "";
        if (result.type === "transfer") {
          report = `> Intent parsed. Transfer to: ${result.resolvedAlias || result.contact}\n\n` +
            generateTransferReport(result.amount, result.symbol, result.contact);
        } else if (result.type === "donate") {
          report = generateFundingReport(result.projects);
        } else {
          report = generateTransferReport(result.amount, result.symbol, result.contact);
        }
        const newLog = `${userLog}> System: ${report}`;
        setTimeout(() => setReportText(newLog), 1500);
        pushLog(`RESULT: ${report.slice(0, 60)}...`);
        setIsSpeaking(true);
        await voiceService.speak(report);
        setIsSpeaking(false);
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || "I could not understand that command.";
      pushLog(`ERROR — ${errorMsg}`);
      const userLog = `> User: ${command}\n\n`;
      const newLog = `${userLog}> System: ${errorMsg}`;
      setTimeout(() => setReportText(newLog), 1500);
      setIsSpeaking(true);
      await voiceService.speak(errorMsg);
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isListeningSpeech && transcript) {
      handleVoiceCommand(transcript);
      setTranscript("");
    }
  }, [isListeningSpeech, transcript, setTranscript]);



  /* ─── Shared Styles ─── */
  const dockBtn = `px-6 py-3 text-lg tracking-wider bg-black/40 hover:bg-[${C.green}]/10 border border-[${C.green}]/30 hover:border-[${C.green}]/60 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40 shrink-0 text-[${C.muted}] font-mono tracking-wide`;

  const panelLabel = `text-lg xl:text-xl font-bold uppercase tracking-widest mb-1 text-[#FFFFFF] font-mono tracking-wide`;

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-[#e5e5e5] overflow-hidden scanlines">

      {/* ═══════════════════════════════════
          SWAP CONFIRMATION MODAL
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {swapModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border-2 border-[#2a2a2a] rounded-2xl p-8 max-w-md w-full mx-4 "
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-mono tracking-wide text-[#6ba368] tracking-wider">CONFIRM TRADE</h3>
                <button onClick={() => setSwapModal(prev => ({ ...prev, open: false }))} className="text-[#888] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-mono tracking-wide text-[#888]">Amount</span>
                  <span className="text-lg font-mono tracking-wide text-[#e5e5e5]">{swapModal.amount}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-mono tracking-wide text-[#888]">From</span>
                  <span className="text-lg font-mono tracking-wide text-[#e5e5e5]">{swapModal.fromToken}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-mono tracking-wide text-[#888]">To</span>
                  <span className="text-lg font-mono tracking-wide text-[#e5e5e5]">{swapModal.toToken}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-mono tracking-wide text-[#888]">Router</span>
                  <span className="text-xs font-mono tracking-wide text-[#888]">Uniswap V3 (Celo)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono tracking-wide text-[#888]">Fee Tier</span>
                  <span className="text-sm font-mono tracking-wide text-[#e5e5e5]">0.05%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSwapModal(prev => ({ ...prev, open: false }))}
                  className="flex-1 px-4 py-3 text-sm font-mono tracking-wide tracking-wider border border-white/20 rounded-lg text-[#888] hover:text-white hover:border-white/40 transition-all"
                >
                  [ CANCEL ]
                </button>
                <button
                  onClick={handleSwapConfirm}
                  className="flex-1 px-4 py-3 text-sm font-mono tracking-wide tracking-wider bg-[#6ba368]/10 border-2 border-[#2a2a2a] rounded-lg text-[#6ba368] hover:bg-[#6ba368]/20 hover: transition-all"
                >
                  [ CONFIRM TRADE ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══════════════════════════════════
          ASCII TITLE BAR
          ═══════════════════════════════════ */}
      <div className="w-full flex justify-center items-center pt-4 pb-2 shrink-0 z-10">
        <pre className="text-[#6ba368] font-bold text-sm sm:text-base md:text-lg leading-tight text-center select-none font-mono tracking-wide">
          {ASCII_TITLE}
        </pre>
      </div>

      {/* ═══════════════════════════════════
          3-COLUMN COMMAND CENTER
          ═══════════════════════════════════ */}
      <div className="w-[98%] max-w-[1600px] mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-2 flex-1 min-h-0 z-10 overflow-y-auto lg:overflow-hidden pb-4">

        {/* ─── COLUMN 1: Agent Details Panel ─── */}
        <div className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide w-full pr-1 pb-4 lg:col-span-3">
          {/* Identity Card */}
          <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className={panelLabel}>Agent Identity</div>
            <div className="text-4xl font-mono tracking-wide tracking-wider mb-2 font-bold text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">REGEN ELIZA</div>
            <a href="https://www.8004scan.io/agents/celo/1851" target="_blank" rel="noopener noreferrer" className="text-[#6ba368] hover:text-[#88d184] hover:underline transition-colors font-mono tracking-wide text-sm mb-3 inline-block font-bold">
              View on 8004scan.io ↗
            </a>
            <div className="text-xl font-mono tracking-wide font-bold text-[#e5e5e5] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#6ba368]" /> ERC-8004 Autonomous Agent
            </div>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[#888888] font-mono tracking-wide text-sm">BASE ID: 30121</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="text-[#888888] font-mono tracking-wide text-sm">CELO ID: 1851</span>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center w-full mb-1.5">
              <span className="text-[#888888] font-mono uppercase tracking-widest text-sm">NETWORK</span>
              <span className="text-[#6ba368] font-mono flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${activeChain === 'CELO' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div> {activeChain}
              </span>
            </div>
            <button onClick={() => setActiveChain(prev => prev === 'CELO' ? 'BASE' : 'CELO')} className="w-full border border-[#2a2a2a] text-[#888888] hover:border-[#6ba368] hover:text-[#6ba368] transition-colors py-2 rounded font-mono text-xs tracking-widest my-3">• TOGGLE CHAIN</button>
            <div className="flex justify-between text-base font-mono tracking-wide text-[#888]">
              <span>REP Score</span>
              <span className="text-[#6ba368] text-2xl leading-none">{reputation}</span>
            </div>
          </div>

          {/* 8004 Scan */}
          <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className={panelLabel}>8004SCAN.IO</div>
            <div className="flex items-center gap-2 text-base font-mono tracking-wide text-[#e5e5e5]/80">
              <Globe size={16} className="text-[#6ba368]" />
              <span>LINKED</span>
            </div>
            <div className="flex flex-col space-y-3 mt-1.5">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[#e5e5e5] font-mono text-sm">Chain: Base (8453)</span></div>
                <div className="text-[#888888] font-mono text-xs pl-4 mt-1">RPC: mainnet.base.org</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-[#e5e5e5] font-mono text-sm">Chain: Celo (42220)</span></div>
                <div className="text-[#888888] font-mono text-xs pl-4 mt-1">RPC: forno.celo.org</div>
              </div>
            </div>
          </div>



          {/* ASCII Art Block 1 (8004-ERC) */}
          <pre className="hidden lg:block text-[10px] xl:text-xs font-mono tracking-wide text-[#e5e5e5]  select-none">
            {`   ___   ___   ___  _  _         _____ ____   ____ 
  ( _ ) / _ \\ / _ \\| || |       | ____|  _ \\ / ___|
  / _ \\| | | | | | | || |_ _____|  _| | |_) | |    
 | (_) | |_| | |_| |__   _|_____| |___|  _ <| |___ 
  \\___/ \\___/ \\___/   |_|       |_____|_| \\_\\\\____|`}
          </pre>

          {/* ASCII Art Block 2 (x402) */}
          <pre className="hidden lg:block text-[10px] xl:text-xs font-mono tracking-wide text-[#e5e5e5]  select-none">
            {`     _  _    ___ ____  
 __  _| || |  / _ \\___ \\ 
 \\ \\/ / || |_| | | |__) |
  >  <|__   _| |_| / __/ 
 /_/\\_\\  |_|  \\___/_____|`}
          </pre>

        </div>

        {/* ─── COLUMN 2: The Soul (Center) ─── */}
        <div className="h-[450px] lg:h-full flex flex-col relative w-full z-20 order-first lg:order-none mb-4 lg:mb-0 lg:col-span-6">
          
          {/* Agent Ingest Box */}
          <div className="w-full flex shrink-0 mb-4 justify-center">
            <div className="w-full max-w-[800px] px-6 py-4 bg-black/40 border-2 border-[#6ba368]/30 hover:border-[#6ba368]/60 rounded-2xl text-center font-mono backdrop-blur-md flex flex-col items-center justify-center group cursor-pointer transition-all shadow-[0_0_20px_rgba(107,163,104,0.15)] shrink-0" onClick={() => navigator.clipboard.writeText("curl https://api.regeneliza.com/skill.md")}>
              <span className="text-sm text-[#FFFFFF] font-bold uppercase tracking-widest mb-1 opacity-80">🤖 AGENTS: Ingest My Skills Here</span>
              <span className="text-[24px] font-bold text-[#6ba368] tracking-wide mt-1">curl https://api.regeneliza.com/skill.md</span>
            </div>
          </div>

          <div className="w-full flex-1 min-h-0 rounded-xl overflow-hidden border border-[#2a2a2a] bg-black/30 flex items-center justify-center shadow-[0_0_30px_rgba(107,163,104,0.1)] mb-3 relative group">
            <Avatar state={(
              isSpeaking ? 'speaking' :
                isProcessing ? 'thinking' :
                  isListeningSpeech ? 'listening' :
                    'idle'
            ) as AvatarState} />
            <div className="absolute inset-0 border border-[#6ba368]/10 rounded-xl pointer-events-none transition-colors group-hover:border-[#6ba368]/30 mix-blend-screen" />
          </div>

          <div className="w-full flex shrink-0">
            {/* Voice / Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-base xl:text-lg tracking-widest uppercase rounded-lg border-2 transition-all font-mono font-bold shadow-lg ${isListeningSpeech
                ? "border-red-500/60 bg-red-500/10 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "border-[#2a2a2a] bg-[#111] text-[#e5e5e5] hover:bg-[#6ba368]/10 hover:border-[#6ba368]/60 hover:text-[#6ba368]"
                }`}
            >
              {isListening ? <><Mic size={20} className="text-red-500" /> LISTENING...</> : <><Power size={20} className="text-[#6ba368]" /> INITIALIZE CORE</>}
            </button>
          </div>
        </div>

        {/* ─── COLUMN 3: Transaction Log Panel & Skills ─── */}
        <div className="h-full flex flex-col gap-2 overflow-y-auto scrollbar-hide pr-1 pb-4 lg:col-span-3">

          {/* Live Transaction Log bg */}
          <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3 min-h-[160px] flex flex-col shadow-[inset_0_0_15px_rgba(107,163,104,0.05)] mb-2">
            <div className={`${panelLabel} flex items-center gap-2 mb-2`}>
              <div className="w-2 h-2 rounded bg-[#6ba368] animate-pulse" />
              TRANSACTION LOG
            </div>
            <div className="flex-1 min-h-[100px] overflow-y-auto scrollbar-hide font-mono tracking-wide text-xs xl:text-sm space-y-1.5 opacity-80 text-[#e5e5e5]">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div key={`${log}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="leading-tight">{log}</motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && <div className="text-[#888]/50 italic text-xs">...</div>}
            </div>
          </div>

          {/* Agent Skills */}
          <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-2 shrink-0">
            <div className={`${panelLabel} flex items-center gap-2`}>
              <ShieldCheck size={14} className="text-[#6ba368]" /> Agent Skills
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <a href="/skills/builder-funding.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                BUILDER.MD
              </a>
              <a href="/skills/public-goods.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                PUBLIC_GOODS.MD
              </a>
              <a href="/skills/octant-evaluation.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                OCTANT.MD
              </a>
              <a href="/skills/lido-yield-treasury.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                LIDO.MD
              </a>
              <a href="/skills/uniswap-intent-router.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                UNISWAP.MD
              </a>
              <a href="/skills/celo-real-world-impact.md" target="_blank" rel="noopener noreferrer" className="block w-full flex items-center justify-center border-2 border-[#2a2a2a] bg-transparent text-[#e5e5e5]/80 px-1 py-2 rounded-lg font-mono font-bold tracking-widest text-xs xl:text-sm hover:border-[#6ba368] hover:text-[#6ba368] hover:bg-[#6ba368]/10 transition-colors truncate">
                CELO.MD
              </a>
            </div>
          </div>

          {/* Active Transaction Output */}
          <AnimatePresence mode="wait">
            {reportText && (
              <motion.div
                key={reportText}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="shrink-0 border border-[#2a2a2a] bg-black/60 backdrop-blur-sm rounded-lg p-2.5 shadow-[0_0_15px_rgba(107,163,104,0.05)]"
              >
                <div className={`${panelLabel} flex items-center gap-2 mb-1 text-[#FFFFFF]`}>
                  <div className="w-2 h-2 rounded-full bg-[#6ba368] animate-pulse" />
                  Active Output
                </div>
                <div className="font-mono tracking-wide text-xs lg:text-sm font-bold text-[#e5e5e5] leading-relaxed break-words">
                  {reportText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROTOCOL MANIFEST (SKILL.MD) */}
          <div className="flex-1 min-h-[250px] border border-[#2a2a2a] bg-black/20 backdrop-blur-md rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(107,163,104,0.05)] border-t-[#6ba368]/30 mt-2">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#2a2a2a]">
              <div className={`${panelLabel} !mb-0 flex items-center gap-2`}>
                <div className="w-2 h-2 rounded-sm bg-[#6ba368] animate-pulse" />
                PROTOCOL_MANIFEST
              </div>
              <span className="text-[#888] text-[9px] tracking-widest uppercase opacity-70">RAW DATA</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
              <pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#6ba368]/90 whitespace-pre-wrap break-words drop-shadow-[0_0_2px_rgba(107,163,104,0.2)]">
                {children}
              </pre>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════
          BOTTOM DOCK CONTROL BAR
          ═══════════════════════════════════ */}
      <div className="w-[98%] mx-auto grid grid-cols-[1.2fr_1.6fr_1.2fr] gap-4 items-center py-2 bg-black/60 backdrop-blur-md border-t border-[#2a2a2a] z-20 shrink-0 px-2 lg:px-4">

        {/* Left Section (Tracks) */}
        <div className="flex items-center space-x-3 text-[#e5e5e5] justify-start font-mono tracking-wide">
          <span className="text-[#6ba368] font-bold tracking-widest text-sm lg:text-base">TRACKS:</span>
          <span className="font-bold text-[10px] lg:text-xs opacity-80">CELO | OCTANT | ENS | UNISWAP</span>
        </div>

        {/* Center Section (Services) */}
        <div className="flex flex-col items-center space-y-1 font-mono tracking-wide font-bold">
          <div className="text-[#6ba368] font-bold text-center w-full text-lg tracking-[0.2em]">SERVICES</div>

          {/* Row 1 */}
          <div className="flex items-center space-x-2 w-full justify-center">
            <button disabled={isProcessing} onClick={() => handleFund("desci")} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">DeSci</button>
            <button disabled={isProcessing} onClick={() => handleOnChainDonation("ecology")} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">Ecology</button>
            <button disabled={isProcessing} onClick={() => handleOnChainDonation("builders")} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">Builders</button>
            <button disabled={isProcessing} onClick={() => handleFund("agents")} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">Agents</button>
          </div>

          {/* Row 2 */}
          <div className="flex items-center space-x-2 w-full justify-center">
            <button disabled={isProcessing} onClick={handleDirectPayment} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">Contacts</button>
            <button disabled={isProcessing} onClick={handleDirectPayment} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">ENS</button>
            <button disabled={isProcessing} onClick={() => handleSwapRequest()} className="border border-[#2a2a2a] bg-transparent text-[#e5e5e5] px-2 py-0.5 rounded border hover:border-[#6ba368] hover:bg-[#6ba368]/10 hover:text-[#6ba368] transition-all text-[10px] lg:text-xs">Swap</button>
          </div>
        </div>

        {/* Right Section (ENS) */}
        <div className="flex items-center space-x-3 justify-end font-mono tracking-wide">
          <span className="text-[#6ba368] font-bold text-sm lg:text-base">ENS:</span>
          {contacts.slice(0, 3).map((c) => (
            <span key={c.name} className="text-[10px] lg:text-xs opacity-60">{c.spokenName}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
