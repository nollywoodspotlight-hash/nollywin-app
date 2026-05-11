"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address } = useAccount();
  const [isTradeActive, setIsTradeActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // INTERACTIVE CONFIGURATION
  const [contractAddress, setContractAddress] = useState("");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [sellMultiplier, setSellMultiplier] = useState("2"); // Default 2X
  const [stallCount] = useState(0);

  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet";

  const handleTradeAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTradeActive && contractAddress.length < 42) {
      alert("Invalid Contract Address");
      return;
    }
    setIsTradeActive(!isTradeActive);
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(referralLink);
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
        </div>

        {/* TRADING CONSOLE */}
        <div className="bg-[#080808] border border-[#b87209]/40 rounded-sm overflow-hidden shadow-2xl">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-4 py-2 flex justify-between items-center">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Script Editor
            </span>
            <span
              className={`text-[8px] md:text-[10px] font-black uppercase italic ${
                isTradeActive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isTradeActive ? "● RUNNING" : "● STANDBY"}
            </span>
          </div>

          <div className="p-4 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                {/* 1. Target Contract ID */}
                <div>
                  <label className="text-[#b87209] uppercase text-[8px] md:text-[10px] font-black tracking-widest mb-1 block italic">
                    Target Contract ID (CA)
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={contractAddress}
                    disabled={isTradeActive}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full bg-black border-b-2 border-white/10 py-2 text-sm md:text-xl font-mono font-bold text-white focus:border-[#b87209] outline-none disabled:opacity-40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                  {/* 2. DCA Amount */}
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      DCA Size
                    </label>
                    <input
                      type="number"
                      value={dcaAmount}
                      disabled={isTradeActive}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-white outline-none"
                    />
                    <span className="text-[10px] text-gray-500 italic">
                      ETH
                    </span>
                  </div>

                  {/* 3. Frequency */}
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      disabled={isTradeActive}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      <option value="1">1 Hour</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                    </select>
                  </div>

                  {/* 4. Sell Options (X Multiplier Only) */}
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Sell Option
                    </label>
                    <select
                      value={sellMultiplier}
                      disabled={isTradeActive}
                      onChange={(e) => setSellMultiplier(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      {[1, 2, 3, 4, 5, 10, 12].map((x) => (
                        <option key={x} value={x}>
                          {x}X Profit
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stall Monitor */}
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-1 text-[7px] md:text-[9px]">
                    <p className="text-red-900 uppercase font-black italic">
                      Stall Counter
                    </p>
                    <p className="font-bold text-red-600 italic">
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

              {/* ACTION BUTTON */}
              <div className="flex flex-col items-center justify-center pt-2 lg:pt-0 lg:border-l lg:border-white/5 lg:pl-12">
                <button
                  onClick={handleTradeAction}
                  className={`w-full max-w-[320px] h-20 md:h-64 flex flex-col items-center justify-center border-2 md:border-4 transition-all duration-300 active:scale-95 z-[60] ${
                    isTradeActive
                      ? "border-red-600 bg-red-600/10 text-red-600"
                      : "border-[#b87209] bg-transparent text-[#b87209]"
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

        {/* FOUNDER'S CUT & MANDATORY DISCLAIMERS [Spec 13.0] */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-4">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic mb-1">
              Founder's Cut
            </h3>
            <p className="text-gray-500 text-[8px] md:text-[9px] uppercase italic font-bold mb-4 leading-tight">
              Referral rewards require profitable trade & active strategy.
            </p>
            <div className="flex border border-[#b87209]/40">
              <div className="flex-grow bg-black p-3 font-mono text-[8px] text-[#b87209] truncate italic">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] text-black px-4 font-black uppercase text-[9px] italic"
              >
                COPY
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
      </div>
    </div>
  );
}
