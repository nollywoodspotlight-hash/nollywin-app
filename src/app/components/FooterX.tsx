"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/5 py-16 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic tracking-tighter text-white">
              NOLLY<span className="text-[#b87209]">WIN</span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] leading-relaxed max-w-[200px]">
              The world&apos;s first cinematic trading engine. Built for the
              bold on Base.
            </p>
          </div>

          {/* Status Column */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
                Network Status
              </h4>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                  Base Mainnet Live
                </p>
              </div>
            </div>
          </div>

          {/* Legal/Studio Tag */}
          <div className="md:text-right flex flex-col md:items-end justify-between h-full">
            <div className="space-y-1">
              <p className="text-gray-700 text-[8px] font-black uppercase tracking-[1em]">
                Nollywood City
              </p>
              <p className="text-gray-800 text-[7px] font-black uppercase tracking-[0.5em]">
                Lagos • Galveston • Onchain
              </p>
            </div>
            <p className="mt-8 md:mt-0 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
              © 2026 NollyWin Productions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
