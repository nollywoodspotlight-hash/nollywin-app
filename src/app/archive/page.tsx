"use client";
import React, { useEffect, useState } from "react";
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
} from "lucide-react";

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
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (supabase && isConnected && address) {
      fetchLiveArchive();
    } else if (!supabase) {
      setLoading(false);
    }
  }, [isConnected, address]);

  async function fetchLiveArchive() {
    try {
      setLoading(true);
      if (!supabase || !address) return;

      console.log(
        `📡 Fetching archive profiles for connected account actor: ${address}`,
      );

      // Fetch ALL orders for this user address to perform case-insensitive local resolution
      const { data, error } = await supabase
        .from("dca_orders")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const userLower = address.toLowerCase();

      // ✅ CASE-INSENSITIVE MATCHING LAYER: Catches both upper/lower variants perfectly
      const userConcludedOrders = (data || []).filter((order: any) => {
        const dbUser = String(order.user_address || "").toLowerCase();
        const dbStatus = String(order.status || "").toUpperCase();

        // Match user's wallet AND verify if the order is in a concluded or requested abort state
        return (
          dbUser === userLower &&
          (dbStatus === "COMPLETED" ||
            dbStatus === "ABORTED" ||
            dbStatus === "ABORT_REQUESTED" ||
            dbStatus === "FAILED")
        );
      });

      const categorized = userConcludedOrders.map((order: any) => {
        const profit = order.profit_eth || 0;
        const currentStatus = String(order.status || "").toUpperCase();
        let type = "ABORTED";

        if (currentStatus === "COMPLETED") {
          type = profit > 0 ? "PROFIT" : "LOSS";
        } else if (currentStatus === "FAILED") {
          type = "LOSS";
        } else {
          // Both ABORTED and intermediate ABORT_REQUESTED fallback here
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
        };
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
    const text =
      trade.type === "PROFIT"
        ? `🎬 Production wrap! Profit: ${trade.profit.toFixed(
            4,
          )} ETH. Onchain sniper parameters handled via @NollyWin.`
        : `🎬 Production Log: Position tracking terminated on Base Mainnet block loops. Secure via @NollyWin.`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-[#b87209] font-black uppercase italic tracking-[0.3em] text-xs">
          ENCRYPTED ARCHIVE // REDIRECTING...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      <div className="relative z-30 max-w-5xl mx-auto px-5 pt-32 pb-20">
        {/* Cinematic Header Layout */}
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic text-left">
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Archive</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-2 font-bold italic">
            Historical Records / Performance Logs / {address?.slice(0, 14)}...
          </p>
        </div>

        {/* Categorization Tabs Grid */}
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
                className="bg-[#080808] border border-white/5 p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-[#b87209]/30 transition-all shadow-2xl"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div
                    className={`p-4 rounded-sm ${
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
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                      ${trade.target_contract_address.slice(0, 14)}...
                    </h3>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                      Script ID: {trade.id} • STATUS:{" "}
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
                  </div>
                </div>

                <div className="flex gap-10 w-full md:w-auto border-y md:border-y-0 border-white/5 py-4 md:py-0 text-left">
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
