"use client";

import React from "react";

interface StrategyProps {
  title: string;
  status: "active" | "paused" | "draft" | "completed" | "pending";
  profit: string;
  asset: string;
}

export default function StrategyCard({
  title,
  status,
  profit,
  asset,
}: StrategyProps) {
  // Dynamically scales cinematic badge styling based on backend pipeline output states
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-green-500/10 border border-green-500/30 text-green-500";
      case "pending":
        return "bg-[#b87209]/10 border border-[#b87209]/30 text-[#b87209]";
      default:
        return "bg-zinc-800 border border-zinc-700 text-zinc-400";
    }
  };

  return (
    <div className="group relative p-6 bg-[#080808]/90 backdrop-blur-sm border border-white/5 hover:border-[#b87209]/60 transition-all duration-500 shadow-xl text-left">
      {/* Decorative accent background gradient matching the main system dashboard */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#b87209]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-[#b87209] transition-colors">
            {title}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1 italic">
            {asset} Target Strategy
          </p>
        </div>
        <span
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-sm ${getBadgeStyle()}`}
        >
          ● {status}
        </span>
      </div>

      <div className="relative z-10 mt-8 border-t border-white/5 pt-4">
        <p className="text-[#b87209] uppercase text-[9px] font-black tracking-widest italic mb-1">
          Total Realized Yield
        </p>
        <p className="text-3xl font-black italic text-white tracking-tighter">
          {profit}
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <button className="w-full py-3 bg-transparent border border-white/10 text-white font-black uppercase text-xs italic tracking-widest hover:bg-[#b87209] hover:text-black hover:border-[#b87209] transition-all duration-300 active:scale-95">
          [ View Intel Archive ]
        </button>
      </div>
    </div>
  );
}
