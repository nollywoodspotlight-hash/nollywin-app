"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { Copy, Share2, Play, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  // --- NEW STRATEGY STATES ---
  const [stallCount, setStallCount] = useState(0);
  const [lifecycleState, setLifecycleState] = useState(0); // 0: ACTIVE, 2: STALLED, 4: CANCELLED
  const [tokenTicker, setTokenTicker] = useState("PEPE");
  const [dcaAmount, setDcaAmount] = useState(0.1);
  const [profitTarget, setProfitTarget] = useState(100);

  const LifecycleMapping: { [key: number]: string } = {
    0: "ACTIVE",
    1: "PAUSED",
    2: "STALLED",
    3: "COMPLETED",
    4: "CANCELLED",
  };

  useEffect(() => {
    setMounted(true);
    if (address) {
      setReferralLink(
        `${window.location.origin}/?ref=${address.slice(0, 6)}...${address.slice(-4)}`,
      );
    }
  }, [address]);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push("/");
    }
  }, [isConnected, mounted, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Referral Link Copied to Clipboard");
  };

  if (!mounted || !isConnected) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-32 selection:bg-[#b87209] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#b87209]/20 pb-8 gap-6">
          <div>
            <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em] mb-2 animate-pulse">
              Executive Producer Active | {LifecycleMapping[lifecycleState]}
            </h2>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
              Control <span className="text-[#b87209]">Room</span>
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold mt-2 font-mono tracking-widest bg-white/5 inline-block px-2 py-1">
              ID: {address}
            </p>
          </div>

          <button
            onClick={() => disconnect()}
            className="text-[9px] font-black text-red-500 border border-red-500/20 px-8 py-3 hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em] italic"
          >
            Terminate Session
          </button>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. TRADE WINDOW */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.02] border border-[#b87209]/30 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Play size={80} className="text-[#b87209]" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#b87209] text-xs font-black uppercase tracking-widest italic border-l-2 border-[#b87209] pl-3">
                  Script Configuration (DCA)
                </h3>
                {/* STALL COUNTER UI */}
                <div className="text-right">
                  <p className="text-[9px] uppercase font-black text-gray-500">
                    Stall Count
                  </p>
                  <p
                    className={`text-xl font-black italic ${stallCount >= 3 ? "text-red-600" : "text-white"}`}
                  >
                    {stallCount}/3
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-black text-gray-500 tracking-widest">
                      Target Token:{" "}
                      <span className="text-white">{tokenTicker}</span>
                    </label>
                    <input
                      type="number"
                      value={dcaAmount}
                      onChange={(e) => setDcaAmount(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 p-4 mt-1 font-black italic text-[#b87209] focus:border-[#b87209] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black text-gray-500 tracking-widest">
                      Profit Target (%)
                    </label>
                    <input
                      type="number"
                      value={profitTarget}
                      onChange={(e) => setProfitTarget(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 p-4 mt-1 font-black italic text-white focus:border-[#b87209] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setIsTrading(!isTrading)}
                    disabled={lifecycleState === 4}
                    className={`w-full py-6 font-black italic uppercase tracking-widest transition-all duration-500 ${
                      lifecycleState === 4
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : isTrading
                          ? "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                          : "bg-[#b87209] text-black shadow-[0_0_30px_rgba(184,114,9,0.3)] hover:bg-white"
                    }`}
                  >
                    {lifecycleState === 4
                      ? "Script Cancelled"
                      : isTrading
                        ? "Stop Production"
                        : "Start Production"}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE FEED */}
            <div className="border border-white/5 bg-black p-4 font-mono text-[10px] text-gray-500 h-32 overflow-hidden relative">
              <div className="animate-pulse">
                {lifecycleState === 2 && (
                  <p className="text-orange-500">
                    [WARNING] Strategy STALLED: Insufficient ETH Balance.
                  </p>
                )}
                {lifecycleState === 4 && (
                  <p className="text-red-500">
                    [FATAL] Strategy CANCELLED: Max Stalls Reached.
                  </p>
                )}
                {isTrading && lifecycleState === 0 ? (
                  <p className="text-green-500">
                    [SYSTEM] Executing trade on Base... Success.
                  </p>
                ) : (
                  <p>[SYSTEM] Awaiting instructions...</p>
                )}
                <p>
                  {" "}
                  {">"} Security Protocol: Reentrancy & Slippage protection
                  ACTIVE.
                </p>
                <p>
                  {" "}
                  {">"} ID: {address?.slice(0, 10)}... (Verified Producer)
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
          </div>

          {/* 2. SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-[#b87209]/5 border border-[#b87209]/30 p-8 relative">
              <h3 className="text-[#b87209] text-[10px] font-black uppercase mb-4 tracking-widest">
                Founder&apos;s Cut (Royalties)
              </h3>
              <p className="text-5xl font-black italic drop-shadow-gold">
                0.00 <span className="text-sm">ETH</span>
              </p>
              <div className="mt-4 h-[1px] bg-[#b87209]/20 w-full" />
              <p className="text-[9px] text-gray-500 mt-4 uppercase font-bold tracking-tighter">
                Profit Calculated | Settlement Pending
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-[10px] font-black uppercase tracking-widest">
                  Cast Referral
                </h3>
                <Share2 size={14} className="text-[#b87209]" />
              </div>
              <p className="text-gray-500 text-[9px] uppercase font-bold mb-4 italic">
                Earn 1% of lifetime production from your recruits.
              </p>
              <div className="flex bg-black border border-white/10 overflow-hidden">
                <input
                  readOnly
                  value={referralLink}
                  className="bg-transparent flex-1 p-3 font-mono text-[9px] text-gray-400 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-[#b87209] px-4 hover:bg-white transition-colors"
                >
                  <Copy size={14} className="text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
