"use client";

import React from "react";
import TradeWindow from "@/components/TradeWindow";
import DashboardStats from "@/components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* 1. Header Section */}
      <header className="pt-12 pb-8 px-6 border-b border-gray-900 bg-gradient-to-b from-gray-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tighter italic text-red-600 uppercase">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-2 font-medium tracking-wide">
                Live Trading Terminal & Protocol Analytics
              </p>
            </div>

            {/* Quick Status Bar */}
            <div className="flex gap-6 py-2 px-6 bg-gray-900/50 rounded-full border border-gray-800 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Base Mainnet
                </span>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Network Gas: <span className="text-white">Fast</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (5/12 width): The Trading Console */}
          <section className="lg:col-span-5 space-y-6">
            <div className="sticky top-8">
              <TradeWindow />

              {/* Extra Dashboard Tip for the user */}
              <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-xs text-blue-400 leading-relaxed">
                  <strong>Director's Note:</strong> Your strategy will begin
                  executing immediately after the transaction is confirmed on
                  the Base network.
                </p>
              </div>
            </div>
          </section>

          {/* Right Column (7/12 width): Statistics & Leaders */}
          <section className="lg:col-span-7">
            <DashboardStats />
          </section>
        </div>
      </main>

      {/* 3. Footer Stats (Optional Ticker) */}
      <footer className="mt-12 py-6 border-t border-gray-900 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          NollyWin Protocol v2.0 • Secured by Base Smart Contracts
        </p>
      </footer>
    </div>
  );
}
