"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

// 5.1 ENUM Mapping with TypeScript Type Safety
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

  // 6.2 Processing Logic Data (Placeholder for Supabase Sync)
  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200, // 2X target
    lifecycle_state: 0 as number,
    stall_count: 1,
    last_execution_error: null as string | null,
  };

  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet to generate link";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (address) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-[#b87209] selection:text-black`}
    >
      {/* Main Container: 
          - relative z-10 ensures it sits above any global background effects 
          - pt-32 ensures clearance from the fixed Header
      */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 pt-32 pb-16">
        {/* Header Section - Cinematic Noir */}
        <div className="border-b border-[#b87209]/20 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div className="italic">
            <h1 className="text-2xl md:text-5xl font-black uppercase tracking-tight text-[#b87209] leading-none">
              Production Dashboard
            </h1>
            <p className="text-gray-500 uppercase tracking-[0.15em] text-[9px] md:text-xs mt-1 font-bold">
              Base Mainnet / Execution Interval: 130s ± 60s /{" "}
              {LifecycleState[strategyData.lifecycle_state]}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 border rounded-sm ${
              strategyData.stall_count >= 1
                ? "border-red-900 bg-red-900/10"
                : "border-[#b87209]/30 bg-[#b87209]/10"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                strategyData.lifecycle_state === 0
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-white">
              {LifecycleState[strategyData.lifecycle_state]}
            </span>
          </div>
        </div>

        {/* Founder's Cut - Referral Logic (Your 1% Lifetime Royalties) */}
        <div className="mb-8 bg-[#080808] border border-[#b87209]/30 p-5 md:p-8 rounded-sm relative overflow-hidden group">
          <div className="relative z-20">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-base md:text-xl mb-1 italic">
              Founder's Cut: Production Crew
            </h3>
            <p className="text-gray-500 text-[10px] md:text-sm mb-5 max-w-xl uppercase tracking-tight italic font-semibold">
              Earn{" "}
              <span className="text-white font-black">
                1% Lifetime Royalties
              </span>{" "}
              on every trade from your script's crew.
            </p>

            <div className="flex flex-col gap-2">
              <div className="bg-black border border-white/10 p-3 font-mono text-[9px] md:text-sm text-[#b87209] truncate rounded-sm">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="w-full bg-[#b87209] hover:bg-white text-black font-black py-3 px-6 uppercase tracking-widest transition-all italic text-[11px] active:scale-[0.98] cursor-pointer"
              >
                {copied ? "COPIED TO REEL" : "COPY REFERRAL LINK"}
              </button>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-10 text-[120px] font-black text-[#b87209]/5 pointer-events-none italic select-none">
            NW
          </div>
        </div>

        {/* Strategy Parameters Grid (Target, Amount, Frequency, Profit) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Target Memecoin",
              val: strategyData.token_ticker,
              highlight: true,
            },
            { label: "DCA Amount", val: `${strategyData.dca_amount} ETH` },
            { label: "Frequency", val: `${strategyData.frequency_hours}H` },
            { label: "Profit Target", val: `${strategyData.profit_target}%` },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#050505] border border-white/5 p-4 hover:border-[#b87209]/40 transition-all"
            >
              <p className="text-gray-600 uppercase text-[8px] font-black tracking-widest mb-1 italic">
                {item.label}
              </p>
              <p
                className={`text-lg md:text-2xl font-black italic tracking-tighter ${
                  item.highlight ? "text-[#b87209]" : "text-white"
                }`}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* 6.3 Stall Monitor & Execution Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          <div className="bg-[#080808] border-l-4 border-red-600 p-5">
            <h4 className="text-red-600 uppercase font-black text-[10px] italic mb-3 tracking-widest">
              Safety Monitor: Stall Counter
            </h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-[9px] uppercase font-bold italic">
                Insufficient ETH (Max 3)
              </span>
              <span className="text-xl font-black">
                {strategyData.stall_count} / 3
              </span>
            </div>
            <div className="w-full bg-white/5 h-1">
              <div
                className="bg-red-600 h-1 transition-all duration-700"
                style={{ width: `${(strategyData.stall_count / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-[8px] text-gray-600 mt-2 uppercase italic tracking-tighter">
              Status:{" "}
              {strategyData.stall_count >= 3 ? "CANCELLED" : "MONITORING"}
            </p>
          </div>

          <div className="bg-[#080808] border-l-4 border-[#b87209] p-5">
            <h4 className="text-[#b87209] uppercase font-black text-[10px] italic mb-3 tracking-widest">
              Execution Feed
            </h4>
            <p className="text-white/80 font-mono text-[9px] uppercase leading-relaxed">
              {strategyData.last_execution_error
                ? `[!] FAILURE: ${strategyData.last_execution_error}`
                : `[OK] Logic: 7.3 Settlement Order Active (Profit > Fee > Refund).`}
            </p>
            <p className="text-[8px] text-gray-700 mt-2 uppercase italic font-bold">
              RPC Latency: Stable • Security: 8.2 No-Custody Mode Active
            </p>
          </div>
        </div>

        {/* 8.3 Security Constraints Summary */}
        <div className="bg-[#b87209]/5 border border-[#b87209]/20 p-4 mb-8">
          <p className="text-[9px] md:text-xs text-gray-500 italic leading-relaxed">
            <strong className="text-[#b87209] uppercase tracking-widest mr-2">
              Security:
            </strong>
            Transparent Upgradeable Proxy (UUPS). Reentrancy and Slippage
            protection required. All funds MUST be returned to user wallet
            within the same transaction window. No long-term custody allowed.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 opacity-20 text-[8px] uppercase tracking-[0.4em] text-center italic font-bold">
          © 2026 NollyWin Productions • Lagos • Galveston • Base Mainnet
        </div>
      </div>
    </div>
  );
}
