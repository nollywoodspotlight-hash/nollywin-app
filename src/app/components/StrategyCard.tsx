"use client";

import React from "react";

interface StrategyProps {
  title: string;
  status: "active" | "paused" | "draft";
  profit: string;
  asset: string;
}

export default function StrategyCard({
  title,
  status,
  profit,
  asset,
}: StrategyProps) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-nolly-gold/50 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-nolly-gold transition-colors">
            {title}
          </h3>
          <p className="text-xs text-nolly-gray uppercase tracking-widest">
            {asset} Strategy
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold ${
            status === "active"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm text-nolly-gray">Total Profit</p>
        <p className="text-3xl font-black text-white">{profit}</p>
      </div>

      <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all">
        VIEW DETAILS
      </button>
    </div>
  );
}
