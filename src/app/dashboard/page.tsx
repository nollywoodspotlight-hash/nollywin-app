"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // State for the Cinematic Trade Form
  const [formData, setFormData] = useState({
    ticker: "",
    dcaAmount: "",
    frequency: "1",
    profitTarget: "20",
    multiplier: "2X",
  });

  // Current Trade Status (Mocked for UI display)
  const [lifecycleState, setLifecycleState] = useState("ACTIVE");

  // Single Wallet Enforcement
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Generate Unique Referral Link
  const referralLink = `https://nollywin.app/?ref=${address?.slice(0, 8)}`;

  const statusLights = [
    "ACTIVE",
    "PAUSED",
    "STALLED",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            Current Production
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            Executive Producer: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* UNIQUE REFERRAL BOX */}
        <div className="bg-[#b87209]/10 border border-[#b87209]/30 p-4 rounded-sm w-full md:w-auto">
          <span className="text-[#b87209] text-[9px] font-black uppercase tracking-widest block mb-2">
            Founder Referral Link (1% Royalty)
          </span>
          <div className="flex items-center gap-3">
            <code className="text-white text-xs bg-black/40 px-2 py-1">
              {referralLink}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="text-[10px] font-bold text-[#b87209] hover:text-white uppercase"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* TRADE FORM (The Script) */}
        <div className="lg:col-span-1 bg-black/40 border border-white/10 p-8 rounded-sm space-y-6">
          <h2 className="text-white font-black uppercase italic tracking-widest text-sm border-b border-white/5 pb-4">
            The Script (Set Strategy)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                Target Memecoin
              </label>
              <input
                type="text"
                placeholder="$TICKER"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#b87209] outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, ticker: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                  DCA (ETH)
                </label>
                <input
                  type="number"
                  placeholder="0.01"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                  Freq (Hours)
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                Sell Options (Take Profit)
              </label>
              <select className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none appearance-none cursor-pointer">
                {[1, 2, 3, 5, 10, 12].map((x) => (
                  <option key={x} value={`${x}X`}>
                    {x}X (Moonshot)
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full bg-[#b87209] text-black font-black py-4 uppercase italic tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(184,114,9,0.3)]">
              Start Production
            </button>
          </div>
        </div>

        {/* MONITORING WINDOW (The Set) */}
        <div className="lg:col-span-2 bg-[#1d02cb]/5 border border-white/10 p-8 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm">
                Live Feed
              </h2>

              {/* PRODUCTION STATUS LIGHTS */}
              <div className="flex gap-2">
                {statusLights.map((status) => (
                  <div
                    key={status}
                    className={`px-3 py-1 text-[8px] font-black border transition-all ${
                      lifecycleState === status
                        ? "bg-[#b87209] border-[#b87209] text-black shadow-[0_0_10px_#b87209]"
                        : "bg-transparent border-white/10 text-gray-600"
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>

            {/* MOCKED TRADE DATA DISPLAY */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500 text-[10px] font-bold uppercase">
                  Active Strategy
                </span>
                <span className="text-white font-mono text-xs">
                  {formData.ticker || "NO ACTIVE SCRIPT"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-black">
                    Cost Basis
                  </p>
                  <p className="text-xl font-black italic">0.00 ETH</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-black">
                    Current Value
                  </p>
                  <p className="text-xl font-black italic">0.00 ETH</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase font-black">
                    PnL (%)
                  </p>
                  <p className="text-xl font-black italic text-[#b87209]">
                    +0.00%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-black/40 border-l-2 border-[#b87209] text-[10px] text-gray-400 italic">
            Note: 3% fee applies ONLY to profits. Principal is never reduced.
          </div>
        </div>
      </div>
    </div>
  );
}
