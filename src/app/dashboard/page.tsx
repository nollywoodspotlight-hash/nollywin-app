"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

// 5.1 ENUM Mapping [Master Spec 5.1]
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

  // --- VARIABLE DEFINITION FIX ---
  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet to generate link";

  // Strategy Data [Master Specs 2.0]
  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200,
    lifecycle_state: 0 as number,
    stall_count: 1,
  };

  const handleExecute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExecuting(true);
    // 6.2 Processing Logic: execute_trade_cycle()
    setTimeout(() => setIsExecuting(false), 2000);
  };

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
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(184,114,9,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative z-30 max-w-5xl mx-auto px-5 pt-32 pb-20 pointer-events-auto">
        {/* HEADER */}
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Dashboard</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-2 font-bold">
            Authorized Production: {address ? address.slice(0, 10) : "0x000..."}
          </p>
        </div>

        {/* UNIFIED TRADING CONSOLE */}
        <div className="bg-[#080808] border border-[#b87209]/30 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-6 py-3 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Script Config & Execution
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  strategyData.lifecycle_state === 0
                    ? "bg-[#b87209]"
                    : "bg-red-600"
                }`}
              />
              <span className="text-[10px] font-black uppercase italic">
                {LifecycleState[strategyData.lifecycle_state]}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* LEFT: THE 5 REQUIRED PARAMETERS [Master Spec Requirements] */}
              <div className="space-y-8">
                {/* 1. Target Memecoin */}
                <div>
                  <p className="text-[#b87209] uppercase text-[10px] font-black tracking-widest mb-1 italic">
                    Target Memecoin
                  </p>
                  <p className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
                    ${strategyData.token_ticker}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                  {/* 2. DCA Amount */}
                  <div>
                    <p className="text-gray-600 uppercase text-[9px] font-black italic">
                      DCA Amount
                    </p>
                    <p className="text-xl font-bold italic text-white">
                      {strategyData.dca_amount} ETH per cycle
                    </p>
                  </div>
                  {/* 3. Frequency */}
                  <div>
                    <p className="text-gray-600 uppercase text-[9px] font-black italic">
                      Frequency
                    </p>
                    <p className="text-xl font-bold italic text-[#b87209]">
                      Every {strategyData.frequency_hours} hours
                    </p>
                  </div>
                  {/* 4. Profit Target */}
                  <div>
                    <p className="text-gray-600 uppercase text-[9px] font-black italic">
                      Profit Target
                    </p>
                    <p className="text-xl font-bold italic text-white">
                      Sell automatically at {strategyData.profit_target}%
                    </p>
                  </div>
                  {/* 5. Sell Options */}
                  <div>
                    <p className="text-gray-600 uppercase text-[9px] font-black italic">
                      Sell Options
                    </p>
                    <p className="text-xl font-bold italic text-[#b87209]">
                      {(strategyData.profit_target / 100).toFixed(0)}X (1X to
                      12X)
                    </p>
                  </div>
                </div>

                {/* Stall Monitor: Master Spec 5.2 */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-red-900 uppercase text-[9px] font-black italic tracking-widest">
                      Safety: Stall Count
                    </p>
                    <p className="text-xs font-bold text-red-600 italic">
                      {strategyData.stall_count}/3
                    </p>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-1000"
                      style={{
                        width: `${(strategyData.stall_count / 3) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: THE ACTION BUTTON */}
              <div className="flex flex-col items-center justify-center border-l border-white/5 pl-0 lg:pl-12 pt-8 lg:pt-0">
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className={`group relative w-full aspect-square md:w-64 flex flex-col items-center justify-center border-4 transition-all duration-300 ${
                    isExecuting
                      ? "border-zinc-800 bg-zinc-900 text-zinc-600"
                      : "border-[#b87209] bg-transparent hover:bg-[#b87209] text-[#b87209] hover:text-black"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">
                    Manual Override
                  </span>
                  <span className="text-2xl font-black uppercase italic tracking-tighter">
                    {isExecuting ? "Processing" : "Start Trade Cycle"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOUNDER'S CUT & MANDATORY DISCLAIMERS [Spec 13.0] */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-8 flex flex-col justify-center">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-lg italic mb-2">
              Founder's Cut: Production Crew
            </h3>
            <p className="text-gray-500 text-[10px] uppercase italic font-bold mb-6 tracking-tight leading-relaxed">
              Share link to earn 1% royalties. <br />
              <span className="text-white underline underline-offset-4">
                Referral rewards require at least one profitable trade and one
                active strategy.
              </span>
            </p>
            <div className="flex border border-[#b87209]/30">
              <div className="flex-grow bg-black p-4 font-mono text-[10px] text-[#b87209] truncate italic">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] text-black px-6 font-black uppercase text-[10px] italic active:scale-95"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* MANDATORY TEXT [Spec 13.0] */}
          <div className="bg-[#b87209]/5 border border-[#b87209]/20 p-6 flex flex-col justify-center text-center">
            <p className="text-[10px] text-[#b87209] font-black uppercase italic leading-loose tracking-widest">
              3% fee applies ONLY to profits.
              <br />
              No fees on principal or losses.
            </p>
          </div>
        </div>

        <footer className="mt-20 opacity-20 text-[9px] uppercase tracking-[0.5em] text-center italic font-black">
          © 2026 NollyWin Productions • Base Mainnet • Non-Custodial [Spec 8.3]
        </footer>
      </div>
    </div>
  );
}
