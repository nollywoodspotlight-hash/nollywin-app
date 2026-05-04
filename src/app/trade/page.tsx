"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";

export default function TradePage() {
  const { isConnected, address } = useAccount();
  const { isAuthenticated, profile } = useProfile();
  const [amount, setAmount] = useState("");

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">
            Execute Trade
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">
            NollyWin Micro-DCA • Base Network
          </p>
        </header>

        {!isConnected ? (
          <div className="p-12 border border-dashed border-zinc-800 rounded-3xl text-center bg-zinc-900/20">
            <p className="text-zinc-400 font-medium">
              Please connect your Base wallet to access the trading terminal.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-purple-500" : "bg-zinc-700"}`}
                />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isAuthenticated
                    ? `@${profile?.username} Linked`
                    : "Farcaster Not Linked"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Base: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            {/* Strategy Input Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                01. Set Strategy Principal (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-3xl font-mono focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all mb-6"
              />

              <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Principal Shield
                  </span>
                  <span className="text-[10px] font-bold text-green-500 uppercase">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Protocol Fee
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase">
                    Profit-Only
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={!amount}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 py-6 rounded-2xl font-black italic tracking-tighter text-xl transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98]"
            >
              INITIALIZE DCA STRATEGY
            </button>

            <p className="text-[9px] text-zinc-600 text-center leading-relaxed px-12">
              By initializing, you authorize the self-custodial vault to execute
              trades based on your strategy. Fees are only deducted from
              realized profits.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
