"use client";
import { ShieldCheck, Home, Wallet, Settings, Globe } from "lucide-react";

export default function Sidebar({ reputation }: { reputation: number }) {
    return (
        <div className="w-80 h-full border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between">

            {/* Identity Card */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold tracking-wider text-white">REGEN ELIZA</h2>
                        <div className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            ONLINE • REP: {reputation}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {["Dashboard", "DeFi Wallet", "Agent Skills", "Settings"].map((item, i) => (
                        <button key={i} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                            {i === 0 ? <Home size={16} /> : i === 1 ? <Wallet size={16} /> : <Settings size={16} />}
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-zinc-600 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 mb-2">
                    <Globe size={10} />
                    CONNECTED TO 8004SCAN.IO
                </div>
                ID: 0x7a30...8004
            </div>
        </div>
    );
}
