"use client";

import React, { useState } from "react";

export default function TradeWindow() {
  // State variables to hold the user's input
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("60"); // Default to 1 minute

  // This function will eventually trigger your Smart Contract
  const handleStartTrade = () => {
    if (!tokenAddress || !amount) {
      alert("Please fill in all fields, Director!");
      return;
    }
    console.log(`🎬 Action! Deploying strategy for ${tokenAddress}`);
    // Your Hardhat/Base contract logic will be hooked up here next
  };

  return (
    <div className="bg-gray-900 border-2 border-gray-800 p-8 rounded-3xl shadow-2xl w-full">
      {/* Header with a Nollywood vibe */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
          New <span className="text-red-600">Scene</span>
        </h2>
        <span className="bg-red-600/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-600/20">
          LIVE ON BASE
        </span>
      </div>

      <div className="space-y-6">
        {/* Token Address Input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
            Token Contract Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all font-mono text-sm"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
            Total Budget (ETH)
          </label>
          <input
            type="number"
            placeholder="0.05"
            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Frequency/Interval Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
            Execution Interval
          </label>
          <select
            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none appearance-none"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="30">Every 30 Seconds (Fast Cut)</option>
            <option value="60">Every 1 Minute (Standard)</option>
            <option value="300">Every 5 Minutes (Slow Burn)</option>
            <option value="3600">Every 1 Hour (Feature Film)</option>
          </select>
        </div>

        {/* The Big Red Button */}
        <div className="pt-4">
          <button
            onClick={handleStartTrade}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)] uppercase tracking-widest"
          >
            Deploy Strategy
          </button>
          <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
            Self-Custodial • Profit-Only Fees • Powered by Base
          </p>
        </div>
      </div>
    </div>
  );
}
