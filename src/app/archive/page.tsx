"use client";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import { Share2, TrendingUp, TrendingDown, XCircle } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// 10.2 Strategy Data Mock (Reflecting Supabase Schema)
const ARCHIVE_MOCK = [
  {
    id: 1,
    ticker: "DEGEN",
    pnl: 0.045,
    pnlPercent: 450,
    status: "COMPLETED",
    type: "PROFIT",
    date: "2026-05-09",
  },
  {
    id: 2,
    ticker: "VIRTUAL",
    pnl: -0.002,
    pnlPercent: -12,
    status: "COMPLETED",
    type: "LOSS",
    date: "2026-05-08",
  },
  {
    id: 3,
    ticker: "AI16Z",
    pnl: 0,
    pnlPercent: 0,
    status: "CANCELLED",
    type: "CANCELLED",
    date: "2026-05-07",
    reason: "3 Stalls",
  },
];

export default function ArchivePage() {
  const [filter, setFilter] = useState("ALL");

  const filteredTrades = ARCHIVE_MOCK.filter(
    (t) => filter === "ALL" || t.type === filter,
  );

  const handleShare = (trade: any) => {
    const text =
      trade.type === "PROFIT"
        ? `🎬 Just wrapped a production on $${trade.ticker} for ${trade.pnlPercent}% profit! Powered by @NollyWin.`
        : `🎬 Production Log: Closed $${trade.ticker} script. Onchain & Non-custodial via @NollyWin.`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      <div className="relative z-30 max-w-5xl mx-auto px-5 pt-32 pb-20">
        {/* Archive Header */}
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Archive</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-2 font-bold italic">
            Historical Records / Script Performance Logs
          </p>
        </div>

        {/* 🎬 CATEGORY TABS */}
        <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["ALL", "PROFIT", "LOSS", "CANCELLED"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-[10px] font-black uppercase italic tracking-widest border transition-all ${
                filter === cat
                  ? "bg-[#b87209] border-[#b87209] text-black"
                  : "bg-transparent border-white/10 text-gray-500 hover:border-[#b87209]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TRADES LIST */}
        <div className="space-y-4">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="bg-[#080808] border border-white/5 hover:border-[#b87209]/40 transition-all p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 group"
            >
              {/* Left: Ticker & Date */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div
                  className={`p-4 rounded-sm ${
                    trade.type === "PROFIT"
                      ? "bg-green-500/10 text-green-500"
                      : trade.type === "LOSS"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {trade.type === "PROFIT" && <TrendingUp size={24} />}
                  {trade.type === "LOSS" && <TrendingDown size={24} />}
                  {trade.type === "CANCELLED" && <XCircle size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                    ${trade.ticker}
                  </h3>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                    {trade.date} • {trade.status}
                  </p>
                </div>
              </div>

              {/* Middle: Performance Stats */}
              <div className="flex gap-10 w-full md:w-auto border-y md:border-y-0 border-white/5 py-4 md:py-0">
                <div className="text-center md:text-left">
                  <p className="text-gray-600 uppercase text-[8px] font-black italic mb-1">
                    PnL (ETH)
                  </p>
                  <p
                    className={`text-xl font-black italic ${
                      trade.type === "PROFIT"
                        ? "text-green-500"
                        : trade.type === "LOSS"
                        ? "text-red-500"
                        : "text-zinc-600"
                    }`}
                  >
                    {trade.pnl > 0 ? "+" : ""}
                    {trade.pnl}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-gray-600 uppercase text-[8px] font-black italic mb-1">
                    Return
                  </p>
                  <p
                    className={`text-xl font-black italic ${
                      trade.type === "PROFIT"
                        ? "text-green-500"
                        : trade.type === "LOSS"
                        ? "text-red-500"
                        : "text-zinc-600"
                    }`}
                  >
                    {trade.pnlPercent}%
                  </p>
                </div>
              </div>

              {/* Right: Share Button */}
              <button
                onClick={() => handleShare(trade)}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-transparent border-2 border-[#b87209] text-[#b87209] hover:bg-[#b87209] hover:text-black px-8 py-4 font-black uppercase italic text-xs transition-all active:scale-95"
              >
                <Share2 size={16} />
                Share Script
              </button>
            </div>
          ))}

          {filteredTrades.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 italic">
              <p className="text-gray-600 uppercase font-black text-sm tracking-widest">
                No matching script logs found.
              </p>
            </div>
          )}
        </div>

        {/* 13.0 Mandatory Disclaimer */}
        <div className="mt-12 opacity-30 text-[9px] text-center italic font-bold uppercase tracking-widest">
          3% profit-only fee applied to all historical gains. No fees on
          principal.
        </div>
      </div>
    </div>
  );
}
