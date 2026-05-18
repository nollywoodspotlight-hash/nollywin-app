"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Inter } from "next/font/google";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  Share2,
  TrendingUp,
  TrendingDown,
  XCircle,
  Loader2,
  Clock,
  Gauge,
  Layers,
} from "lucide-react";

// ✅ 1. Expanded Type Definition for accurate archiving
interface Trade {
  id: string;
  target_contract_address: string;
  dca_amount_eth: number;
  status: string;
  tx_hash: string;
  profit: number;
  type: "PROFIT" | "LOSS" | "ABORTED";
  pool_fee: number; // Raw number from DB (e.g., 3000)
  sell_multiplier: number; // Multiplier value (e.g., 2 for 2x)
  frequency_hours: number; // Time gap between runs
  created_at: string; // Timestamp for UI logging
}

const inter = Inter({ subsets: ["latin"] });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl.startsWith("http") && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default function ArchivePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // ✅ 2. Complete Database Fetcher with newly provided columns
  const fetchLiveArchive = useCallback(
    async (isActive: () => boolean) => {
      if (!supabase || !address) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("dca_orders")
          .select(
            `
          id, 
          token_to_buy, 
          amount_per_trade, 
          status, 
          tx_hash, 
          profit_eth,
          pool_fee,
          sell_multiplier,
          frequency_hours,
          created_at
        `,
          )
          .ilike("user_address", address)
          .in("status", ["COMPLETED", "ABORTED", "ABORT_REQUESTED", "FAILED"])
          .order("created_at", { ascending: false }); // Ordered chronologically using the timestamp

        if (error) throw error;
        if (!isActive()) return;

        const categorized: Trade[] = (data || []).map((order) => {
          const profit = Number(order.profit_eth) || 0;
          const currentStatus = String(order.status || "").toUpperCase();
          let type: "PROFIT" | "LOSS" | "ABORTED" = "ABORTED";

          if (currentStatus === "COMPLETED") {
            type = profit > 0 ? "PROFIT" : "LOSS";
          } else if (currentStatus === "FAILED") {
            type = "LOSS";
          } else {
            type = "ABORTED";
          }

          return {
            id: order.id.toString(),
            target_contract_address: order.token_to_buy || "",
            dca_amount_eth: order.amount_per_trade || 0,
            status: currentStatus,
            tx_hash: order.tx_hash || "AWAITING_HIGH_SPEED_BLOCK_SWAP",
            profit,
            type,
            pool_fee: Number(order.pool_fee) || 0,
            sell_multiplier: Number(order.sell_multiplier) || 1,
            frequency_hours: Number(order.frequency_hours) || 0,
            created_at: order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "UNKNOWN",
          };
        });

        setTrades(categorized);
      } catch (err) {
        console.error("Archive Fetch Error:", err);
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [address],
  );

  useEffect(() => {
    let isMounted = true;
    const checkActive = () => isMounted;

    if (supabase && isConnected && address) {
      fetchLiveArchive(checkActive);
    } else if (!supabase) {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isConnected, address, fetchLiveArchive]);

  const filteredTrades = trades.filter(
    (t) => filter === "ALL" || t.type === filter,
  );

  const handleShare = (trade: Trade) => {
    const text =
      trade.type === "PROFIT"
        ? `🎬 Wrap! Captured +${trade.profit.toFixed(
            4,
          )} ETH via @NollyWin. [Target: ${
            trade.sell_multiplier
          }x Multiplier / Pool: ${(trade.pool_fee / 10000).toFixed(2)}%]`
        : `🎬 Production Log: Target position tracking offline on Base Mainnet. Safeguards deployed via @NollyWin.`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  if (!isConnected) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      <div className="relative z-30 max-w-5xl mx-auto px-5 pt-32 pb-20">
        {/* Header Block */}
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic text-left">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Archive</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-2 font-bold italic">
            Historical Records / Performance Logs / {address?.slice(0, 14)}...
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["ALL", "PROFIT", "LOSS", "ABORTED"].map((cat) => (
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
                className="bg-[#080808] border border-white/5 p-6 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 group hover:border-[#b87209]/30 transition-all shadow-2xl"
              >
                {/* Core Status & Identifier */}
                <div className="flex items-center gap-5 min-w-[280px]">
                  <div
                    className={`p-4 rounded-sm shrink-0 ${
                      trade.type === "PROFIT"
                        ? "bg-green-500/10 text-green-500"
                        : trade.type === "LOSS"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-zinc-800 text-red-500/40"
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
                  <div className="text-left">
                    <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white/90">
                      {trade.target_contract_address
                        ? `${trade.target_contract_address.slice(
                            0,
                            10,
                          )}...${trade.target_contract_address.slice(-4)}`
                        : "UNKNOWN TOKEN"}
                    </h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">
                      ID: {trade.id} • STATUS:{" "}
                      <span
                        className={
                          trade.status === "ABORT_REQUESTED" ||
                          trade.status === "ABORTED"
                            ? "text-red-500/80 font-mono"
                            : "text-green-500/80 font-mono"
                        }
                      >
                        {trade.status}
                      </span>
                    </p>
                    <p className="text-[8px] text-gray-600 font-mono uppercase mt-1">
                      TX: {trade.tx_hash.slice(0, 16)}...
                    </p>
                  </div>
                </div>

                {/* ✅ NEW: Script Blueprint Parameters Sub-Panel */}
                <div className="grid grid-cols-3 gap-4 border-t border-b xl:border-t-0 xl:border-b-0 border-white/5 py-4 xl:py-0 text-left flex-1 max-w-md">
                  <div>
                    <span className="flex items-center gap-1 text-gray-600 uppercase text-[8px] font-black italic mb-1">
                      <Layers size={10} /> Liquidity Pool
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-300">
                      {(trade.pool_fee / 10000).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-gray-600 uppercase text-[8px] font-black italic mb-1">
                      <Gauge size={10} /> Target Threshold
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-300">
                      {trade.sell_multiplier}x Milestone
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-gray-600 uppercase text-[8px] font-black italic mb-1">
                      <Clock size={10} /> Frequency Loop
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-300">
                      Every {trade.frequency_hours}h
                    </p>
                  </div>
                </div>

                {/* Financial Output Summary Block */}
                <div className="flex justify-between md:justify-start xl:justify-between items-center gap-12 text-left">
                  <div>
                    <p className="text-gray-600 uppercase text-[8px] font-black italic mb-1">
                      Size (ETH)
                    </p>
                    <p className="text-sm font-mono font-black text-gray-400">
                      {trade.dca_amount_eth.toFixed(4)}
                    </p>
                  </div>
                  <div>
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
                      {trade.profit.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center items-end text-right">
                  <button
                    onClick={() => handleShare(trade)}
                    className="w-full xl:w-auto flex items-center justify-center gap-2 border-2 border-[#b87209] text-[#b87209] hover:bg-[#b87209] hover:text-black px-6 py-3 font-black uppercase italic text-xs active:scale-95 transition-all"
                  >
                    <Share2 size={13} />
                    Share Manifest
                  </button>
                  <span className="hidden xl:block text-[8px] font-bold tracking-tighter font-mono text-zinc-600 uppercase mt-2">
                    Logged: {trade.created_at}
                  </span>
                </div>
              </div>
            ))}

            {filteredTrades.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10 italic">
                <p className="text-gray-600 uppercase font-black text-[10px] tracking-widest">
                  No Production Logs Found for {filter}.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 opacity-30 text-[9px] text-center italic font-bold uppercase tracking-widest leading-relaxed">
          “3% fee applies ONLY to profits • No fees on principal or losses”
        </div>
      </div>
    </div>
  );
}
