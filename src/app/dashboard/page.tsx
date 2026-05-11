"use client";

import React, { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address } = useAccount();
  const [isTradeActive, setIsTradeActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hook to trigger wallet authorization
  const { sendTransaction } = useSendTransaction();

  // INTERACTIVE CONFIGURATION [Master Spec 2.0]
  const [contractAddress, setContractAddress] = useState("");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [sellMultiplier, setSellMultiplier] = useState("2");
  const [stallCount] = useState(0);

  const referralLink = address
    ? `https://nollywin.com/join?ref=${address}`
    : "Connect Wallet";

  // MASTER DEV UPDATE: Logic 7.1 - Connects UI to Blockchain + Supabase
  const handleTradeAction = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isTradeActive) {
      // 1. Validation
      if (contractAddress.length < 42) {
        alert("Invalid Base Contract Address");
        return;
      }

      try {
        // 2. TRIGGER WALLET NOTIFICATION (Pay the protocol)
        // REPLACE this 0x000 with your real Vault/Treasury address
        sendTransaction({
          to: "0x0000000000000000000000000000000000000000" as `0x${string}`,
          value: parseEther(dcaAmount),
        });

        // 3. SAVE TO SUPABASE (Wake up the Bot)
        // This calls the API route we built earlier
        const response = await fetch("/api/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: address,
            contract_address: contractAddress,
            amount: dcaAmount,
            frequency: frequency,
            multiplier: sellMultiplier,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save strategy to database.");
        }

        setIsTradeActive(true);
        console.log("🚀 Production Started: Strategy synced to Supabase.");
      } catch (error) {
        console.error("❌ Startup Failed:", error);
        alert("Could not start production. Check console for details.");
      }
    } else {
      // Manual Override / Abort logic
      setIsTradeActive(false);
    }
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
          <p className="text-gray-500 uppercase tracking-widest text-[8px] md:text-xs mt-1 font-bold">
            Authorized Protocol / Base Mainnet /{" "}
            {address ? address.slice(0, 10) : "STANDBY"}
          </p>
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
                {/* 1. Target Contract ID (CA) */}
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
                  {/* 2. DCA Size */}
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      DCA Size (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcaAmount}
                      disabled={isTradeActive}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-white outline-none disabled:opacity-40"
                    />
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
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none disabled:opacity-40 cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="4">4 Hours</option>
                      <option value="8">8 Hours</option>
                    </select>
                  </div>

                  {/* 4. Sell Options */}
                  <div>
                    <label className="text-gray-600 uppercase text-[7px] md:text-[9px] font-black italic block mb-1">
                      Sell Option
                    </label>
                    <select
                      value={sellMultiplier}
                      disabled={isTradeActive}
                      onChange={(e) => setSellMultiplier(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none disabled:opacity-40 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 10, 12].map((x) => (
                        <option key={x} value={x}>
                          {x}X Profit
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5.2 Stall Monitor */}
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-1 text-[7px] md:text-[9px]">
                    <p className="text-red-900 uppercase font-black italic">
                      Stall Counter (Auto-Cancel at 3)
                    </p>
                    <p className="font-bold text-red-600 italic">
                      {stallCount}/3
                    </p>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-1000"
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

        {/* FOOTER & REFERRALS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-5 md:p-8">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic mb-2 underline decoration-white/10 underline-offset-8">
              Founder's Cut: Production Crew
            </h3>
            <p className="text-gray-500 text-[8px] md:text-[9px] uppercase italic font-bold mb-4 leading-tight">
              Referral rewards require at least one profitable trade and one
              active strategy. [Spec 13.0]
            </p>
            <div className="flex border border-[#b87209]/40">
              <div className="flex-grow bg-black p-4 font-mono text-[8px] text-[#b87209] truncate italic select-all">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] hover:bg-white text-black px-6 font-black uppercase text-[9px] italic transition-colors"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <div className="bg-[#b87209]/5 border border-[#b87209]/20 p-6 flex flex-col justify-center text-center">
            <p className="text-[7px] md:text-[10px] text-[#b87209] font-black uppercase italic leading-loose tracking-widest">
              3% fee applies ONLY to profits.
              <br />
              No fees on principal or losses.
              <br />
              [Spec 13.0]
            </p>
          </div>
        </div>

        <footer className="mt-16 opacity-20 text-[8px] uppercase tracking-[0.4em] text-center italic font-black">
          © 2026 NollyWin Productions • Onchain Non-Custodial [Spec 8.3]
        </footer>
      </div>
    </div>
  );
}
