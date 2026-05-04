"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export default function TradePage() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState("");

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">
            EXECUTE TRADE
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">
            Micro-DCA Protocol • Base Network
          </p>
        </header>

        {!isConnected ? (
          <div className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center">
            <p className="text-zinc-400">
              Please connect your wallet to access the trading terminal.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Strategy Input Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
              <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">
                01. Strategy Amount (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-xl font-mono focus:border-blue-600 outline-none transition-all"
              />
              <div className="mt-4 flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                <span>Principal Shield Active</span>
                <span>Fee: 0% (Profit Only)</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black italic tracking-tighter transition-all shadow-lg shadow-blue-900/20">
              INITIALIZE DCA STRATEGY
            </button>

            <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
