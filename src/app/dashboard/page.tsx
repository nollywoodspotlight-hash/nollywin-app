"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

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

  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200,
    lifecycle_state: 0 as number,
    stall_count: 1,
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    // This is where your Execution Engine (6.2) logic will plug in
    console.log("7.1 BUY FLOW: ETH -> memecoin starting...");
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
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      {/* MOBILE FIX: relative z-20 and pointer-events-auto ensures buttons are clickable */}
      <div className="relative z-20 max-w-6xl mx-auto px-5 pt-32 pb-16 pointer-events-auto">
        {/* Header */}
        <div className="border-b border-[#b87209]/20 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div className="italic">
            <h1 className="text-2xl md:text-5xl font-black uppercase tracking-tight text-[#b87209]">
              Production Dashboard
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-[9px] mt-1 font-bold">
              Base Mainnet / Production ID:{" "}
              {address ? address.slice(0, 6) : "0x00"}...
            </p>
          </div>
        </div>

        {/* 🚀 THE EXECUTION BUTTON (New Feature) */}
        <div className="mb-8 p-6 bg-[#b87209]/5 border-2 border-[#b87209] rounded-sm text-center">
          <h3 className="text-[#b87209] uppercase font-black italic mb-4 tracking-widest">
            Manual Override / Force Cycle
          </h3>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`w-full md:w-64 py-4 px-8 font-black uppercase tracking-tighter italic transition-all ${
              isExecuting
                ? "bg-gray-800 text-gray-500"
                : "bg-[#b87209] hover:bg-white text-black active:scale-95"
            }`}
          >
            {isExecuting ? "EXECUTING..." : "START TRADE CYCLE"}
          </button>
          <p className="text-[10px] text-gray-600 mt-4 uppercase italic">
            Note: 6.1 Cycle Timing (130s ± 60s) applies to automated cycles.
          </p>
        </div>

        {/* Founder's Cut */}
        <div className="mb-8 bg-[#080808] border border-[#b87209]/30 p-5 rounded-sm relative overflow-hidden">
          <div className="relative z-30">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-base mb-1 italic">
              Founder's Cut
            </h3>
            <p className="text-gray-500 text-[10px] mb-5 uppercase italic font-semibold">
              1% Lifetime Royalties
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopy}
                className="w-full bg-[#b87209] text-black font-black py-3 px-6 uppercase italic text-[11px] active:scale-95"
              >
                {copied ? "COPIED TO REEL" : "COPY REFERRAL LINK"}
              </button>
            </div>
          </div>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Ticker",
              val: strategyData.token_ticker,
              highlight: true,
            },
            { label: "Amount", val: `${strategyData.dca_amount} ETH` },
            { label: "Frequency", val: `${strategyData.frequency_hours}H` },
            { label: "Target", val: `${strategyData.profit_target}%` },
          ].map((item, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 p-4">
              <p className="text-gray-600 uppercase text-[8px] font-black mb-1 italic">
                {item.label}
              </p>
              <p
                className={`text-lg md:text-2xl font-black italic ${
                  item.highlight ? "text-[#b87209]" : "text-white"
                }`}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* Stall Monitor */}
        <div className="max-w-md bg-[#080808] border-l-4 border-red-600 p-5 mb-8">
          <h4 className="text-red-600 uppercase font-black text-[10px] italic mb-3 tracking-widest">
            Stall Counter
          </h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-[9px] uppercase font-bold">
              Insufficient ETH (Max 3)
            </span>
            <span className="text-xl font-black">
              {strategyData.stall_count} / 3
            </span>
          </div>
          <div className="w-full bg-white/5 h-1">
            <div
              className="bg-red-600 h-1 transition-all"
              style={{ width: `${(strategyData.stall_count / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
