"use client";

import React from "react";

export default function DashboardStats() {
  // These placeholders will eventually be replaced by live Supabase data
  const protocolStats = {
    newTradersToday: 5,
    totalTraders: 124,
    newestMember: "0xRebec...77",
    newestToken: "$NOLLY",
    referralCount: 3,
    isEligible: true, // Rule: active strategy + referrals
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            New Traders Today
          </p>
          <p className="text-3xl font-black text-green-500 mt-1">
            {protocolStats.newTradersToday}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Total Traders
          </p>
          <p className="text-3xl font-black text-white mt-1">
            {protocolStats.totalTraders}
          </p>
        </div>
      </div>

      {/* 2. Live Activity Ticker */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase">
            Newest Member
          </p>
          <p className="text-sm font-mono text-red-500">
            {protocolStats.newestMember}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase">
            Newest Token
          </p>
          <p className="text-sm font-bold text-white">
            {protocolStats.newestToken}
          </p>
        </div>
      </div>

      {/* 3. Referral Status Card */}
      <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-900/30 p-6 rounded-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">Your Referrals</h3>
            <p className="text-3xl font-black text-white mt-2">
              {protocolStats.referralCount}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                protocolStats.isEligible
                  ? "bg-green-500/20 text-green-500"
                  : "bg-yellow-500/20 text-yellow-500"
              }`}
            >
              {protocolStats.isEligible
                ? "1% Fee Eligible"
                : "Inactive Strategy"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Top 20 Profitable Trades Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="bg-gray-800/50 p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">
            Top 20 Profitable Trades
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase">
              <span>Token</span>
              <span>Profit (ETH)</span>
            </div>

            {/* Placeholder Rows */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-800/50 pb-2"
              >
                <span className="text-sm font-mono text-gray-400">
                  0x71c...{i}f2
                </span>
                <span className="text-sm font-bold text-green-400">
                  +{0.45 * i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
