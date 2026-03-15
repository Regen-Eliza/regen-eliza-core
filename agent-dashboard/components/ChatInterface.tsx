"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Command } from "lucide-react";

export default function ChatInterface({ isListening, toggleMic, volume }: any) {
    const [messages, setMessages] = useState([
        { role: "agent", text: "Identity Verified. I am ready to transact on Celo." }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input) return;
        setMessages(prev => [...prev, { role: "user", text: input }]);
        setInput("");

        // Simulate Agent Thinking
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "agent", text: "Processing intent... accessing liquidity pools." }]);
        }, 1000);
    };

    return (
        <div className="flex-1 h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-black/20 to-green-900/5">

            {/* 🧠 The Voice Orb (Floating) */}
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-50">
                <motion.div
                    animate={{ scale: 1 + (volume / 100) }}
                    className="w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-md p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-green-500/10 text-green-300 border border-green-500/20'}`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4 bg-zinc-900/80 p-2 rounded-xl border border-white/10 focus-within:border-green-500/50 transition-colors">
                    <button
                        onClick={toggleMic}
                        className={`p-3 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-zinc-400'}`}
                    >
                        <Mic size={20} />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Command the agent (e.g., 'Send 5 cUSD')..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-600 font-mono text-sm"
                    />

                    <button onClick={handleSend} className="p-3 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-900/20 transition-all">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
