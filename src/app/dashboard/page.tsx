"use client";

import React from "react";
// We use lowercase here because your files in the sidebar are lowercase
import TradeWindow from "../../components/tradewindow";
import DashboardStats from "../../components/dashboardstats";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* Header Section */}
      <header className="pt-12 pb-8 px-6 border-b border-gray-900 bg-gradient-to-b from-gray-900/20 to-black">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter italic text-red-600 uppercase">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium tracking-wide">
            Live Trading Terminal & Protocol Analytics
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (Trade Console) */}
          <section className="lg:col-span-5">
            <div className="sticky top-8">
              <TradeWindow />
            </div>
          </section>

          {/* Right Column (Stats & Leaderboard) */}
          <section className="lg:col-span-7">
            <DashboardStats />
          </section>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-900 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          NollyWin Protocol v2.0 • Secured by Base
        </p>
      </footer>
    </div>
  );
}
