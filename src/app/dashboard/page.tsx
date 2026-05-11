"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

const LifecycleState: Record<number, string> = {
  0: "ACTIVE",
  1: "PAUSED",
  2: "STALLED",
  3: "COMPLETED",
  4: "CANCELLED",
};

export default function DashboardPage() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [isTradeActive, setIsTradeActive] = useState(false);

  // INTERACTIVE CONFIGURATION STATE
  const [ticker, setTicker] = useState("DEGEN");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [profitTarget, setProfitTarget] = useState("200");
  const [stallCount] = useState(1); // Usually managed by backend

  const handleTradeAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTradeActive(!isTradeActive);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (address) {
      const link = `https://nollywin.com/join?ref=${address}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.12),transparent_60%)] pointer-events-none" />

      <div className="relative z-50 max-w-5xl mx-auto px-4 pt-24 pb-12 pointer-events-auto">
        {/* HEADER */}
        <div className="border-l-2 border-[#b87209] pl-4 mb-6 italic">
          <h1 className="text-xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
            Production <span className="text-[#b87209]">Dashboard</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-[7px] md:text-xs mt-1 font-bold">
            {address
              ? `ID: ${address.slice(0, 6)}...${address.slice(-4)}`
              : "CONNECT WALLET"}
          </p>
        </div>

        {/* TRADING CONSOLE */}
        <div className="bg-[#080808] border border-[#b87209]/40 rounded-sm overflow-hidden shadow-2xl">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-4 py-2 flex justify-between items-center">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Configuration Mode
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isTradeActive ? "bg-green-500 animate-pulse" : "bg-red-600"
                }`}
              />
              <span className="text-[8px] md:text-[10px] font-black uppercase italic">
                {isTradeActive ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* INTERACTIVE INPUTS */}
              <div className="space-y-6">
                <div>
                  <label className="text-[#b87209] uppercase text-[8px] md:text-[10px] font-black tracking-widest mb-1 block italic">
                    Target Memecoin
                  </label>
                  <select
                    value={ticker}
                    disabled={isTradeActive}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full bg-black border-b-2 border-white/10 text-2xl md:text-5xl font-black italic tracking-tighter text-white focus:border-[#b87209] outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="DEGEN">DEGEN</option>
                    <option value="VIRTUAL">VIRTUAL</option>
                    <option value="AI16Z">AI16Z</option>
                    <option value="ANON">ANON</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      DCA Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcaAmount}
                      disabled={isTradeActive}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg md:text-xl font-bold italic text-white focus:border-[#b87209] outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      disabled={isTradeActive}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg md:text-xl font-bold italic text-[#b87209] outline-none appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="1">Every 1H</option>
                      <option value="4">Every 4H</option>
                      <option value="8">Every 8H</option>
                      <option value="12">Every 12H</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Profit Target %
                    </label>
                    <input
                      type="number"
                      value={profitTarget}
                      disabled={isTradeActive}
                      onChange={(e) => setProfitTarget(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg md:text-xl font-bold italic text-white focus:border-[#b87209] outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Sell Options
                    </label>
                    <select
                      value={Math.floor(Number(profitTarget) / 100)}
                      disabled={isTradeActive}
                      onChange={(e) =>
                        setProfitTarget(
                          (Number(e.target.value) * 100).toString(),
                        )
                      }
                      className="w-full bg-transparent border-b border-white/10 text-lg md:text-xl font-bold italic text-[#b87209] outline-none appearance-none cursor-pointer disabled:opacity-50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => (
                        <option key={x} value={x}>
                          {x}X Profit
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-red-900 uppercase text-[7px] md:text-[9px] font-black italic">
                      Stall Counter
                    </p>
                    <p className="text-[9px] font-bold text-red-600 italic">
                      {stallCount}/3
                    </p>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full"
                      style={{ width: `${(stallCount / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC ACTION BUTTON */}
              <div className="flex flex-col items-center justify-center pt-2 lg:pt-0 lg:border-l lg:border-white/5 lg:pl-12">
                <button
                  onClick={handleTradeAction}
                  className={`w-full max-w-[320px] h-20 md:h-64 flex flex-col items-center justify-center border-2 md:border-4 transition-all duration-300 active:scale-95 touch-manipulation z-[60] ${
                    isTradeActive
                      ? "border-red-600 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white"
                      : "border-[#b87209] bg-transparent text-[#b87209] hover:bg-[#b87209] hover:text-black"
                  }`}
                >
                  <span className="text-lg md:text-3xl font-black uppercase italic tracking-tighter">
                    {isTradeActive
                      ? "Manual Override / Abort"
                      : "Start Production"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOUNDER'S CUT & FOOTER */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-4 md:p-6">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic mb-1">
              Founder's Cut
            </h3>
            <p className="text-gray-500 text-[7px] md:text-[9px] uppercase italic font-bold mb-4 leading-tight">
              Referral rewards require profitable trade & active strategy [Spec
              13.0].
            </p>
            <div className="flex border border-[#b87209]/40">
              <div className="flex-grow bg-black p-3 font-mono text-[8px] text-[#b87209] truncate italic">
                {address
                  ? `nollywin.com/join?ref=${address.slice(0, 6)}`
                  : "CONNECT WALLET"}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] text-black px-4 font-black uppercase text-[9px] italic"
              >
                {copied ? "OK" : "COPY"}
              </button>
            </div>
          </div>

          <div className="bg-[#b87209]/5 border border-[#b87209]/20 p-4 flex flex-col justify-center text-center">
            <p className="text-[7px] md:text-[9px] text-[#b87209] font-black uppercase italic leading-tight tracking-widest">
              3% fee applies ONLY to profits.
              <br />
              No fees on principal or losses.
            </p>
          </div>
        </div>

        <footer className="mt-10 opacity-20 text-[7px] md:text-[9px] uppercase tracking-[0.4em] text-center italic font-black">
          © 2026 NollyWin Productions • Base Mainnet
        </footer>
      </div>
    </div>
  );
}
