"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Inter } from "next/font/google";
import {
  Share2,
  TrendingUp,
  TrendingDown,
  XCircle,
  Loader2,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// --- VERCEL BUILD FIX: Strict Safe Initialization ---
// We check for 'http' to ensure it's a valid URL string before initializing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl.startsWith("http") && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default function ArchivePage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (supabase) {
      fetchLiveArchive();
    } else {
      // If supabase is null (e.g. during Vercel build), we stop loading and show empty state
      setLoading(false);
      console.warn("Supabase configuration missing or invalid.");
    }
  }, []);

  async function fetchLiveArchive() {
    try {
      setLoading(true);
      if (!supabase) return;

      // 10.2 Database Integration
      const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .in("lifecycle_state", ["COMPLETED", "CANCELLED"])
        .order("id", { ascending: false });

      if (error) throw error;

      // 2.1 Core Financial Logic Integration
      const categorized = (data || []).map((trade: any) => {
        const profit = trade.final_sell_eth - trade.total_cost_basis_eth;

        let type = "CANCELLED";
        if (trade.lifecycle_state === "COMPLETED") {
          type = profit > 0 ? "PROFIT" : "LOSS";
        }

        return { ...trade, profit, type };
      });

      setTrades(categorized);
    } catch (err) {
      console.error("Archive Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTrades = trades.filter(
    (t) => filter === "ALL" || t.type === filter,
  );

  const handleShare = (trade: any) => {
    // 15.0 Social Proofing logic
    const text =
      trade.type === "PROFIT"
        ? `🎬 Production wrap! $${trade.token_ticker} profit: ${(
            (trade.profit / trade.total_cost_basis_eth) *
            100
          ).toFixed(2)}%. Onchain via @NollyWin.`
        : `🎬 Production Log: Closed $${trade.token_ticker} script on Base. @NollyWin.`;

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
        {/* Cinematic Header */}
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Archive</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-2 font-bold italic">
            Historical Records / Performance Logs
          </p>
        </div>

        {/* 10.2 Categorization Tabs */}
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

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#b87209]" size={40} />
            <p className="text-[10px] font-black uppercase italic tracking-widest text-[#b87209]">
              Syncing Productions...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                className="bg-[#080808] border border-white/5 p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-[#b87209]/30 transition-all shadow-2xl"
              >
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
                    {trade.type === "PROFIT" ? (
                      <TrendingUp size={24} />
                    ) : trade.type === "LOSS" ? (
                      <TrendingDown size={24} />
                    ) : (
                      <XCircle size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                      ${trade.token_ticker}
                    </h3>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                      Script ID: {trade.id} • {trade.lifecycle_state}
                    </p>
                  </div>
                </div>

                <div className="flex gap-10 w-full md:w-auto border-y md:border-y-0 border-white/5 py-4 md:py-0">
                  <div className="text-center md:text-left">
                    <p className="text-gray-600 uppercase text-[8px] font-black italic mb-1">
                      Net PnL (ETH)
                    </p>
                    <p
                      className={`text-xl font-black italic ${
                        trade.profit > 0
                          ? "text-green-500"
                          : trade.profit < 0
                          ? "text-red-500"
                          : "text-zinc-600"
                      }`}
                    >
                      {trade.profit > 0 ? "+" : ""}
                      {(trade.profit || 0).toFixed(4)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleShare(trade)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 border-2 border-[#b87209] text-[#b87209] hover:bg-[#b87209] hover:text-black px-8 py-4 font-black uppercase italic text-xs active:scale-95 transition-all"
                >
                  <Share2 size={14} />
                  Share Script
                </button>
              </div>
            ))}

            {filteredTrades.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10 italic">
                <p className="text-gray-600 uppercase font-black text-[10px] tracking-widest">
                  No Production Logs Found.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 13.0 Mandatory Disclaimer */}
        <div className="mt-12 opacity-30 text-[9px] text-center italic font-bold uppercase tracking-widest leading-relaxed">
          “3% fee applies ONLY to profits • No fees on principal or losses”
        </div>
      </div>
    </div>
  );
}
