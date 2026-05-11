"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

// 5.1 ENUM Mapping
const LifecycleState: Record<number, string> = {
  0: "ACTIVE",
  1: "PAUSED",
  2: "STALLED",
  3: "COMPLETED",
  4: "CANCELLED",
};

export default function DashboardPage() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Mandatory Specification Data [cite: 65-115]
  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200,
    lifecycle_state: 0 as number,
    stall_count: 1, //
    is_founder: true, // [cite: 55]
    total_cost_basis_eth: "0.05", // [cite: 178]
    referral_earnings: "0.002", // [cite: 167]
  };

  const handleExecute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExecuting(true);
    // 6.2 Logic: execute_trade_cycle() [cite: 109]
    setTimeout(() => setIsExecuting(false), 2000);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (address) {
      navigator.clipboard.writeText(`https://nollywin.com/join?ref=${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-[#0a0a0a] text-white antialiased`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,114,9,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative z-30 max-w-6xl mx-auto px-6 pt-32 pb-20 pointer-events-auto">
        {/* Cinematic Header [cite: 198] */}
        <div className="border-b border-[#b87209]/30 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 font-serif italic">
          <div>
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-[#b87209] leading-none drop-shadow-[0_0_15px_rgba(184,114,9,0.3)]">
              Production Dashboard
            </h1>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-3 font-black">
              Base Mainnet • Script: {address ? address.slice(0, 8) : "0x000"}
              ...
            </p>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-[#b87209]/50 px-4 py-2 rounded-sm">
            <span
              className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#b87209] ${
                strategyData.lifecycle_state === 0
                  ? "bg-[#b87209]"
                  : "bg-red-600"
              }`}
            />
            <span className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.2em]">
              {LifecycleState[strategyData.lifecycle_state]}
            </span>
          </div>
        </div>

        {/* 13.0 Mandatory UI Text  */}
        <div className="mb-10 text-center border-y border-[#b87209]/10 py-4 bg-[#b87209]/5">
          <p className="text-[#b87209] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] italic">
            “3% fee applies ONLY to profits. No fees on principal or losses.”
          </p>
        </div>

        {/* 7.1 Buy Flow Manual Trigger [cite: 117-125] */}
        <div className="mb-10 bg-[#080808] border border-[#b87209]/60 p-1 shadow-[0_0_30px_rgba(184,114,9,0.1)] font-serif italic">
          <div className="border border-[#b87209]/20 p-8 flex flex-col items-center text-center">
            <h3 className="text-[#b87209] uppercase font-black italic mb-2 tracking-widest text-lg underline underline-offset-4">
              Force Production Cycle
            </h3>
            <p className="text-gray-500 text-[10px] uppercase mb-6 tracking-widest font-black">
              Manual override for 6.2 Processing Logic
            </p>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={`w-full md:w-80 py-5 px-10 font-black uppercase tracking-widest italic transition-all duration-300 ${
                isExecuting
                  ? "bg-zinc-900 text-zinc-600 border border-zinc-800"
                  : "bg-[#b87209] hover:bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_5px_15px_rgba(184,114,9,0.4)]"
              }`}
            >
              {isExecuting ? "Processing Script..." : "Start Trade Cycle"}
            </button>
          </div>
        </div>

        {/* 4.0 Founder System & 3.0 Referral [cite: 31-64] */}
        <div className="mb-10 bg-gradient-to-br from-[#0d0d0d] to-black border border-[#b87209]/30 p-8 relative overflow-hidden font-serif italic">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xl italic underline decoration-2 underline-offset-8">
                Founder's Cut
              </h3>
              {strategyData.is_founder && (
                <span className="text-[10px] bg-[#b87209] text-black px-2 py-0.5 font-black uppercase">
                  Active Founder
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs md:text-sm mb-6 uppercase italic font-bold tracking-tight max-w-2xl">
              1% Lifetime Royalties. Referral rewards require at least one
              profitable trade and one active strategy.
            </p>
            <div className="flex flex-col md:flex-row gap-0 border border-[#b87209]/40">
              <div className="flex-grow bg-black p-4 font-mono text-[10px] md:text-sm text-[#b87209] truncate italic">
                {address
                  ? `https://nollywin.com/join?ref=${address}`
                  : "Connect Wallet"}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] text-black font-black py-4 px-8 uppercase italic transition-colors text-xs active:scale-95"
              >
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-12 text-[180px] font-black text-white/[0.02] pointer-events-none italic select-none">
            NW
          </div>
        </div>

        {/* Strategy Parameters Grid [cite: 170-183] */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 font-serif italic">
          {[
            {
              label: "Ticker",
              val: strategyData.token_ticker,
              color: "text-[#b87209]",
            },
            {
              label: "Cost Basis",
              val: `${strategyData.total_cost_basis_eth} ETH`,
              color: "text-white",
            },
            {
              label: "Cycle",
              val: `Every ${strategyData.frequency_hours}H`,
              color: "text-white",
            },
            {
              label: "Royalties",
              val: `${strategyData.referral_earnings} ETH`,
              color: "text-[#b87209]",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-black/60 border border-white/5 p-6 backdrop-blur-md hover:border-[#b87209]/40 transition-all group"
            >
              <p className="text-gray-600 uppercase text-[9px] font-black tracking-[0.2em] mb-2 italic group-hover:text-[#b87209]">
                {item.label}
              </p>
              <p
                className={`text-xl md:text-3xl font-black italic tracking-tighter ${item.color}`}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* 5.2 Stall Monitor [cite: 82-91] */}
        <div className="max-w-md bg-black border border-red-900/30 p-6 shadow-[0_0_20px_rgba(220,38,38,0.05)] font-serif italic">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-red-600 uppercase font-black text-xs italic tracking-widest leading-none">
              Stall Counter
            </h4>
            <span className="text-xl font-black italic text-red-600 leading-none">
              {strategyData.stall_count} / 3
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-1000 shadow-[0_0_10px_#dc2626]"
              style={{ width: `${(strategyData.stall_count / 3) * 100}%` }}
            />
          </div>
          <p className="text-[9px] text-gray-500 mt-3 uppercase italic font-bold tracking-tight">
            Strategy terminates automatically after 3 insufficient balance
            events.
          </p>
        </div>

        <footer className="mt-24 opacity-30 text-[9px] uppercase tracking-[0.5em] text-center italic font-black">
          © 2026 NollyWin Productions • Base Mainnet • [cite: 140-152] 8.3
          Security: Non-Custodial
        </footer>
      </div>
    </div>
  );
}
