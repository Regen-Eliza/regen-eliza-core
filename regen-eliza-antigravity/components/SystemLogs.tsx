"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MOCK_LOGS = [
  "Initializing Neural Link...",
  "Connecting to Celo Mainnet [RPC: https://forno.celo.org]",
  "ERC-8004 Identity Verified: 0x7a30...8004",
  "Checking Liquidity Pools...",
  "ElevenLabs API: Connected",
  "Listening for Intents...",
];

export default function SystemLogs({ active }: { active: boolean }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_LOGS.length) {
        setLogs((prev) => [MOCK_LOGS[i], ...prev.slice(0, 4)]);
        i++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="absolute bottom-4 left-4 font-mono text-[10px] text-green-500/60 w-64 h-32 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="mb-1"
          >
            &gt; {log}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
