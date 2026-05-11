"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi"; // To get your real address

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address } = useAccount(); // Your unique wallet address
  const [copied, setCopied] = useState(false);

  // Your unique referral link logic
  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet to generate link";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200,
    lifecycle_state: 0,
    stall_count: 1,
    last_execution_error: "None",
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24 font-serif italic">
      {/* Cinematic Header */}
      <div className="max-w-6xl mx-auto border-b border-[#b87209]/30 pb-6 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#b87209]">
            Production Dashboard
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm mt-2">
            Nollywin Production System / Authorized via Base Mainnet
          </p>
        </div>
        <div className="text-right">
          <span className="px-4 py-1 border border-[#b87209] text-[#b87209] text-xs font-bold rounded-full animate-pulse">
            ● ACTIVE
          </span>
        </div>
      </div>

      {/* Referral Link / Founder's Cut Section */}
      <div className="max-w-6xl mx-auto mb-12 bg-gradient-to-r from-[#0a0a0a] to-[#1a1300] border border-[#b87209]/40 p-8 rounded-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xl mb-2 italic">
            Founder's Cut: Your Production Crew
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl uppercase tracking-tighter">
            Share your unique script link. Earn{" "}
            <span className="text-white">1% lifetime royalties</span> from every
            trade made by your crew members.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full bg-black/50 border border-[#b87209]/20 p-4 font-mono text-sm text-[#b87209] truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className="w-full md:w-auto bg-[#b87209] hover:bg-[#8e5807] text-black font-black py-4 px-8 uppercase tracking-widest transition-all italic whitespace-nowrap"
            >
              {copied ? "COPIED TO REEL" : "COPY REFERRAL LINK"}
            </button>
          </div>
        </div>
        {/* Background "N" watermark */}
        <div className="absolute -right-10 -bottom-20 text-[200px] font-black text-[#b87209]/5 pointer-events-none">
          NW
        </div>
      </div>

      {/* Strategy Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0a0a0a] border border-[#b87209]/20 p-6 rounded-sm shadow-[0_0_15px_rgba(184,114,9,0.05)]">
          <p className="text-gray-500 uppercase text-xs mb-1">
            Target Memecoin
          </p>
          <p className="text-3xl font-bold italic tracking-tighter underline decoration-[#b87209]/50">
            {strategyData.token_ticker}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#b87209]/20 p-6 rounded-sm">
          <p className="text-gray-500 uppercase text-xs mb-1">DCA Amount</p>
          <p className="text-2xl font-bold italic">
            {strategyData.dca_amount} ETH
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#b87209]/20 p-6 rounded-sm">
          <p className="text-gray-500 uppercase text-xs mb-1">Frequency</p>
          <p className="text-2xl font-bold italic">
            Every {strategyData.frequency_hours} Hours
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#b87209]/20 p-6 rounded-sm">
          <p className="text-gray-500 uppercase text-xs mb-1">Profit Target</p>
          <p className="text-2xl font-bold italic">
            {strategyData.profit_target}%
          </p>
        </div>
      </div>

      {/* Security Footer */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 text-[10px] text-gray-700 uppercase tracking-widest text-center">
        © 2026 NollyWin Productions • Lagos • Galveston • Onchain Settlement
      </div>
    </div>
  );
}
