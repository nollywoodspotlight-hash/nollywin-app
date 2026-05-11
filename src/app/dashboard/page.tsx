"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

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

  const strategyData = {
    token_ticker: "DEGEN",
    dca_amount: "0.01",
    frequency_hours: 4,
    profit_target: 200,
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-[#b87209] selection:text-black`}
    >
      {/* Z-INDEX & SPACING: 
          - relative z-10: keeps clicks active.
          - pt-28: moves content below mobile navbar.
      */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 pt-28 pb-16">
        {/* Header - Scaled for Mobile */}
        <div className="border-b border-[#b87209]/20 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div className="italic">
            <h1 className="text-2xl md:text-5xl font-black uppercase tracking-tight text-[#b87209] leading-none">
              Production Dashboard
            </h1>
            <p className="text-gray-500 uppercase tracking-[0.15em] text-[9px] md:text-xs mt-1 font-bold">
              Nollywin / Production Protocol 0.1
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#b87209]/10 px-3 py-1 border border-[#b87209]/30 rounded-sm">
            <span className="w-1.5 h-1.5 bg-[#b87209] rounded-full animate-pulse" />
            <span className="text-[#b87209] text-[9px] font-black uppercase tracking-widest italic">
              System Active
            </span>
          </div>
        </div>

        {/* Founder's Cut - Simplified for Mobile Clickability */}
        <div className="mb-8 bg-[#080808] border border-[#b87209]/30 p-5 md:p-8 rounded-sm relative overflow-hidden">
          <div className="relative z-20">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-base md:text-xl mb-1 italic">
              Founder's Cut
            </h3>
            <p className="text-gray-500 text-[10px] md:text-sm mb-5 max-w-xl uppercase tracking-tight italic font-semibold">
              Share your link. Earn{" "}
              <span className="text-white">1% royalties</span> from your crew.
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
        </div>

        {/* Strategy Grid - 2 columns on mobile to prevent squishing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

        <div className="mt-16 opacity-20 text-[8px] uppercase tracking-[0.4em] text-center italic font-bold">
          © 2026 NollyWin Productions • Base Mainnet
        </div>
      </div>
    </div>
  );
}
