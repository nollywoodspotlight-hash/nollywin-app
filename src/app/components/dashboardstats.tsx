"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function DashboardStats() {
  const { address } = useAccount();
  const [trades, setTrades] = useState<any[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);

  // 1. Fetch Live Data [Master Spec 15.0]
  useEffect(() => {
    async function fetchStats() {
      if (!address) return;

      // Get Active Trades
      const { data: tradeData } = await supabase
        .from("strategies")
        .select("*")
        .eq("wallet_address", address)
        .order("created_at", { ascending: false });

      // Get Referral Headcount
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", address);

      if (tradeData) {
        setTrades(tradeData);
        const hasActive = tradeData.some((t) => t.lifecycle_state === "ACTIVE");
        const hasProfit = tradeData.some((t) => (t.profit_eth || 0) > 0);
        setIsEligible(hasActive && hasProfit);
      }
      setReferralCount(count || 0);
    }
    fetchStats();
  }, [address]);

  const handleAbort = async (trade: any) => {
    // Logic 17.0: Immediate Liquidation Workflow
    const confirm = window.confirm(
      "ABORT PRODUCTION? Tokens will be sold for ETH immediately.",
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/abort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeId: trade.id, wallet: address }),
      });
      if (res.ok) {
        alert("PRODUCTION TERMINATED // LIQUIDATED");
        window.location.reload();
      }
    } catch (e) {
      console.error("Abort Failed", e);
    }
  };

  return (
    <div className="space-y-8 font-black italic">
      {/* 1. PROTOCOL INTELLIGENCE ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "CREW SIZE", val: referralCount, color: "text-white" },
          {
            label: "ACTIVE SCRIPTS",
            val: trades.filter((t) => t.lifecycle_state === "ACTIVE").length,
            color: "text-[#b87209]",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-[#080808] border border-white/5 p-4">
            <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl ${stat.color}`}>{stat.val}</p>
          </div>
        ))}

        {/* ELIGIBILITY INDICATOR */}
        <div
          className={`col-span-2 border p-4 flex items-center justify-between ${
            isEligible
              ? "border-[#b87209] bg-[#b87209]/5"
              : "border-red-900/30 bg-red-950/10"
          }`}
        >
          <p
            className={`text-[10px] uppercase tracking-tighter ${
              isEligible ? "text-[#b87209]" : "text-red-900"
            }`}
          >
            1% Royalties: {isEligible ? "AUTHORIZED" : "INACTIVE"}
          </p>
          <div
            className={`w-2 h-2 rounded-full ${
              isEligible ? "bg-[#b87209] animate-pulse" : "bg-red-900"
            }`}
          />
        </div>
      </div>

      {/* 2. LIVE PRODUCTION FEED (ACTIVE TRADES) */}
      <div className="bg-[#080808] border border-[#b87209]/40 overflow-hidden">
        <div className="bg-[#b87209]/10 px-4 py-2 border-b border-[#b87209]/20 flex justify-between">
          <span className="text-[10px] text-[#b87209] uppercase tracking-widest">
            Live Production Feed
          </span>
          <span className="text-[10px] text-gray-600">NEWEST → OLDEST</span>
        </div>
        <div className="divide-y divide-white/5">
          {trades
            .filter((t) => t.lifecycle_state === "ACTIVE")
            .map((trade) => (
              <div
                key={trade.id}
                className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center group"
              >
                <div>
                  <p className="text-white text-xs uppercase tracking-widest">
                    TARGET: {trade.target_contract_address.slice(0, 8)}...
                  </p>
                  <p className="text-[#b87209] text-[9px] mt-1 italic">
                    DCA: {trade.dca_amount_eth} ETH // FREQ:{" "}
                    {trade.frequency_hours}H
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTrade(trade)}
                  className="px-4 py-1 border border-[#b87209] text-[#b87209] text-[9px] hover:bg-[#b87209] hover:text-black transition-all"
                >
                  OPEN INTEL
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* 3. ULTRA-COMPACT MISSION BRIEFING MODAL */}
      {selectedTrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-4 backdrop-blur-sm">
          {/* SHRINK CHANGES:
            - max-w-sm: Caps total width at 384px instead of 448px so it sits perfectly inside phone boundaries.
            - p-4 sm:p-6: Relaxes padding constraints to reclaim substantial space for content parameters.
            - gap-4 & space-y-4: Compacted raw vertical space margins.
          */}
          <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto bg-[#080808] border-2 border-[#b87209] p-4 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-[#b87209] text-xl uppercase tracking-tighter mb-2">
                Mission Briefing
              </h3>
              <div className="space-y-2 border-y border-white/5 py-3 font-mono text-[9px] text-left">
                <p className="text-gray-500 break-all leading-relaxed">
                  CONTRACT:{" "}
                  <span className="text-white selection:bg-[#b87209]">
                    {selectedTrade.target_contract_address}
                  </span>
                </p>
                <p className="text-gray-500">
                  STATE:{" "}
                  <span className="text-green-500">ACTIVE PRODUCTION</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setSelectedTrade(null)}
                className="py-2.5 border border-white/20 text-white text-[9px] uppercase hover:bg-white/5 active:scale-95 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleAbort(selectedTrade)}
                className="py-2.5 bg-red-600 text-white text-[9px] uppercase hover:bg-red-700 active:scale-95 transition-all"
              >
                ABORT & LIQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROFIT ARCHIVE (SUMMARY) */}
      <div className="border border-white/5 bg-[#050505] p-4">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-4">
          Historical Archive
        </h3>
        <div className="space-y-2">
          {trades
            .filter((t) => t.lifecycle_state !== "ACTIVE")
            .slice(0, 5)
            .map((t, i) => (
              <div
                key={i}
                className="flex justify-between text-[11px] border-b border-white/5 pb-2"
              >
                <span className="text-gray-400 font-mono">
                  {t.target_contract_address.slice(0, 6)}...
                </span>
                <span
                  className={
                    t.profit_eth > 0 ? "text-[#b87209]" : "text-red-900"
                  }
                >
                  {t.profit_eth > 0 ? "+" : ""}
                  {t.profit_eth || "0.00"} ETH
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
