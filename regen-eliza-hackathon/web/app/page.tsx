"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<string[]>(["🌱 System Initialized. Agent Online."]);

  const sendCommand = async () => {
    if (!input) return;
    setLogs((prev) => [...prev, `> ${input}`]);
    
    try {
      // Connect to the Backend Agent on Port 3005
      const res = await fetch("http://localhost:3005/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userAddress: "0xUser" }),
      });
      const data = await res.json();
      setLogs((prev) => [...prev, `🤖 ${data.reply}`]);
    } catch (e) {
      setLogs((prev) => [...prev, "❌ Error: Agent Offline (Check Port 3005)"]);
    }
    setInput("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Regen Eliza &nbsp; <code className="font-bold">v1.0.0</code>
        </p>
      </div>

      <div className="w-full max-w-2xl border border-slate-700 rounded-lg h-[500px] p-4 overflow-y-auto mb-4 bg-black font-mono">
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith(">") ? "text-blue-400 mt-2" : "text-green-400 mt-2"}>
            {log}
          </div>
        ))}
      </div>

      <div className="flex gap-4 w-full max-w-2xl">
        <input 
          className="flex-1 p-3 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-green-500"
          placeholder="Command the Agent..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendCommand()}
        />
        <button 
          onClick={sendCommand}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
