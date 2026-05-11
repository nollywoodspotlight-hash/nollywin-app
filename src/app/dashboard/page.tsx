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

  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet";

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
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.1),transparent_60%)] pointer-events-none" />

      <div className="relative z-30 max-w-5xl mx-auto px-4 pt-24 pb-12 pointer-events-auto">
        {/* HEADER - Scaled down for mobile */}
        <div className="border-l-2 md:border-l-4 border-[#b87209] pl-4 mb-8 italic">
          <h1 className="text-xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Dashboard</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-[8px] md:text-xs mt-1 font-bold">
            ID:{" "}
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Not Connected"}
          </p>
        </div>

        {/* TRADING CONSOLE */}
        <div className="bg-[#080808] border border-[#b87209]/30 rounded-sm overflow-hidden">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-4 py-2 flex justify-between items-center">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Execution Console
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  strategyData.lifecycle_state === 0
                    ? "bg-[#b87209]"
                    : "bg-red-600"
                }`}
              />
              <span className="text-[8px] md:text-[10px] font-black uppercase italic">
                {LifecycleState[strategyData.lifecycle_state]}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* PARAMETERS GRID */}
              <div className="space-y-6">
                <div>
                  <p className="text-[#b87209] uppercase text-[8px] md:text-[10px] font-black tracking-widest mb-0.5 italic">
                    Target Memecoin
                  </p>
                  <p className="text-3xl md:text-6xl font-black italic tracking-tighter text-white">
                    ${strategyData.token_ticker}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <p className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic">
                      DCA Amount
                    </p>
                    <p className="text-sm md:text-xl font-bold italic text-white">
                      {strategyData.dca_amount} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic">
                      Frequency
                    </p>
                    <p className="text-sm md:text-xl font-bold italic text-[#b87209]">
                      Every {strategyData.frequency_hours}H
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic">
                      Profit Target
                    </p>
                    <p className="text-sm md:text-xl font-bold italic text-white">
                      {strategyData.profit_target}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic">
                      Sell Options
                    </p>
                    <p className="text-sm md:text-xl font-bold italic text-[#b87209]">
                      {(strategyData.profit_target / 100).toFixed(0)}X Max
                    </p>
                  </div>
                </div>

                {/* Stall Monitor */}
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-red-900 uppercase text-[7px] md:text-[9px] font-black italic">
                      Stall Count
                    </p>
                    <p className="text-[9px] font-bold text-red-600 italic">
                      {strategyData.stall_count}/3
                    </p>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-1000"
                      style={{
                        width: `${(strategyData.stall_count / 3) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON - Sized for mobile touch */}
              <div className="flex flex-col items-center justify-center pt-4 lg:pt-0 lg:border-l lg:border-white/5 lg:pl-12">
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className={`w-full max-w-[280px] aspect-[3/1] lg:aspect-square flex flex-col items-center justify-center border-2 md:border-4 transition-all ${
                    isExecuting
                      ? "border-zinc-800 bg-zinc-900 text-zinc-600"
                      : "border-[#b87209] bg-transparent hover:bg-[#b87209] text-[#b87209] hover:text-black active:scale-95"
                  }`}
                >
                  <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest mb-1 italic">
                    Manual Override
                  </span>
                  <span className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">
                    {isExecuting ? "Processing..." : "Start Trade"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOUNDER'S CUT & DISCLAIMERS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-5">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-sm italic mb-1">
              Founder's Cut
            </h3>
            <p className="text-gray-500 text-[8px] md:text-[10px] uppercase italic font-bold mb-4 leading-tight">
              Earn 1% royalties.{" "}
              <span className="text-white underline underline-offset-2 italic">
                Requires profitable trade & active strategy [Spec 13.0].
              </span>
            </p>
            <div className="flex border border-[#b87209]/30">
              <div className="flex-grow bg-black p-3 font-mono text-[9px] text-[#b87209] truncate italic">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] text-black px-4 font-black uppercase text-[9px] italic"
              >
                {copied ? "OK" : "COPY"}
              </button>
            </div>
          </div>

          <div className="bg-[#b87209]/5 border border-[#b87209]/20 p-4 flex flex-col justify-center text-center">
            <p className="text-[8px] md:text-[10px] text-[#b87209] font-black uppercase italic leading-tight tracking-widest">
              3% fee applies ONLY to profits.
              <br />
              No fees on principal or losses.
            </p>
          </div>
        </div>

        <footer className="mt-12 opacity-20 text-[7px] md:text-[9px] uppercase tracking-[0.3em] text-center italic font-black">
          © 2026 NollyWin Productions • Base • Non-Custodial
        </footer>
      </div>
    </div>
  );
}
