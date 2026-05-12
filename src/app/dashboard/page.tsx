"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAccount, useSendTransaction, useDisconnect } from "wagmi";
import { parseEther } from "viem";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Trade Feed & Selection States
  const [trades, setTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [isTradeActive, setIsTradeActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Royalty Eligibility States
  const [hasRealizedProfit, setHasRealizedProfit] = useState(false);
  const [isCurrentlyActive, setIsCurrentlyActive] = useState(false);

  const { sendTransaction } = useSendTransaction();

  const [contractAddress, setContractAddress] = useState("");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [sellMultiplier, setSellMultiplier] = useState("2");
  const [stallCount] = useState(0);

  // 1. SECURITY GUARD: Immediate Redirect on Disconnect
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !url.startsWith("http") || !key) return null;
    return createClient(url, key);
  }, []);

  // 2. DATA SYNC: Fetch Status and Live Feed
  useEffect(() => {
    async function syncDashboard() {
      if (!address || !supabase) return;

      try {
        const { data, error } = await supabase
          .from("strategies")
          .select("*")
          .eq("wallet_address", address)
          .order("created_at", { ascending: false });

        if (data) {
          setTrades(data);
          const active = data.some((s) => s.lifecycle_state === "ACTIVE");
          const profit = data.some((s) => (s.profit_eth || 0) > 0);

          setIsCurrentlyActive(active);
          setHasRealizedProfit(profit);
          if (active) setIsTradeActive(true);
        }
      } catch (err) {
        console.error("Dashboard sync error:", err);
      }
    }
    syncDashboard();
  }, [address, supabase]);

  const royaltiesEnabled = isCurrentlyActive && hasRealizedProfit;
  const referralLink = address
    ? `https://nollywin.xyz/join?ref=${address}`
    : "Connect Wallet";

  // 3. ABORT ENGINE: Sell back to Eth and Archive
  const handleAbortTrade = async (trade: any) => {
    const confirmAbort = window.confirm(
      "CRITICAL: Abort production and liquidate to ETH immediately?",
    );
    if (!confirmAbort) return;

    try {
      const response = await fetch("/api/abort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeId: trade.id, wallet_address: address }),
      });

      if (response.ok) {
        setSelectedTrade(null);
        window.location.reload(); // Refresh to sync Archive and Dashboard
      }
    } catch (error) {
      alert("Abort failed. System remains online.");
    }
  };

  const handleTradeAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTradeActive) {
      if (contractAddress.length < 42) {
        alert("Invalid Base Contract Address");
        return;
      }
      try {
        sendTransaction({
          to: "0x0000000000000000000000000000000000000000" as `0x${string}`,
          value: parseEther(dcaAmount),
        });

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

        if (!response.ok) throw new Error("Database sync failed");
        setIsTradeActive(true);
        setIsCurrentlyActive(true);
      } catch (error) {
        console.error("❌ Startup Failed:", error);
      }
    } else {
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

  // 4. ACCESS DENIED OVERLAY
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-[#b87209] font-black uppercase italic tracking-[0.3em] text-xs">
          ACCESS DENIED // REDIRECTING...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased`}
    >
      <nav className="relative z-[70] flex justify-between items-center px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              isCurrentlyActive ? "bg-green-500" : "bg-[#b87209]"
            }`}
          />
          <span className="text-[10px] font-black uppercase italic tracking-[0.3em] text-[#b87209]">
            {isCurrentlyActive ? "Strategy Online" : "System Standby"}
          </span>
        </div>

        <button
          onClick={() => disconnect()}
          className="group relative px-4 py-1 border border-[#b87209]/30 hover:border-[#b87209] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[#b87209]/5 group-hover:bg-[#b87209]/10 transition-colors" />
          <span className="relative text-[9px] font-black uppercase italic tracking-widest text-[#b87209]">
            [ Terminate Session / {address?.slice(0, 4)}...{address?.slice(-4)}{" "}
            ]
          </span>
        </button>
      </nav>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.12),transparent_60%)] pointer-events-none" />

      <div className="relative z-50 max-w-5xl mx-auto px-4 pt-12 pb-12 pointer-events-auto">
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
              </div>

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
                    {isTradeActive ? "Manual Override" : "Start Production"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. LIVE PRODUCTION FEED */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#b87209]/40 to-transparent" />
            <h2 className="text-[#b87209] font-black uppercase italic tracking-[0.3em] text-xs whitespace-nowrap">
              Live Production Feed
            </h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[#b87209]/40 via-transparent to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {trades.filter((t) => t.lifecycle_state === "ACTIVE").length ===
            0 ? (
              <p className="text-center text-gray-700 font-black uppercase italic text-[10px] tracking-widest py-12 border border-dashed border-white/5">
                No active scripts in production.
              </p>
            ) : (
              trades
                .filter((t) => t.lifecycle_state === "ACTIVE")
                .map((trade) => (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade)}
                    className="group flex justify-between items-center bg-[#080808] border border-white/5 hover:border-[#b87209]/50 p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6 text-left">
                      <span className="text-[#b87209] font-black italic text-xs tracking-tighter">
                        /{trade.id.toString().padStart(3, "0")}
                      </span>
                      <div>
                        <p className="text-white font-bold uppercase text-[10px] tracking-widest leading-none">
                          Target: {trade.target_contract_address.slice(0, 10)}
                          ...
                        </p>
                        <p className="text-gray-500 text-[8px] uppercase mt-1 italic font-black">
                          Investment: {trade.dca_amount_eth} ETH
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black italic text-[#b87209] group-hover:animate-pulse">
                      [ VIEW INTEL ]
                    </span>
                  </button>
                ))
            )}
          </div>
        </div>

        {/* 6. MISSION BRIEFING MODAL */}
        {selectedTrade && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-[#080808] border-2 border-[#b87209] shadow-[0_0_50px_rgba(184,114,9,0.2)]">
              <div className="bg-[#b87209] px-6 py-3 flex justify-between items-center">
                <h3 className="text-black font-black uppercase italic tracking-tighter text-lg">
                  Mission Briefing: {selectedTrade.id}
                </h3>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="text-black font-black hover:scale-125 transition-transform"
                >
                  [X]
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6 border-b border-white/5 pb-8">
                  <div>
                    <p className="text-[#b87209] text-[9px] uppercase font-black italic mb-1">
                      Contract ID
                    </p>
                    <p className="text-white text-xs truncate font-mono">
                      {selectedTrade.target_contract_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#b87209] text-[9px] uppercase font-black italic mb-1">
                      Production State
                    </p>
                    <p className="text-white text-xs uppercase font-black italic">
                      Active Strategy
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAbortTrade(selectedTrade)}
                  className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-xl tracking-tighter shadow-2xl transition-all active:scale-95"
                >
                  ABORT & LIQUIDATE TO ETH
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER & REFERRALS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-5 md:p-8">
            <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic mb-2 underline decoration-white/10 underline-offset-8">
              Founder&apos;s Cut: Production Crew
            </h3>
            <div className="flex border border-[#b87209]/40 mt-4">
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
          <div
            className={`border p-6 flex flex-col justify-center text-center transition-all duration-500 ${
              royaltiesEnabled
                ? "bg-[#b87209]/10 border-[#b87209]"
                : "bg-red-950/20 border-red-900/50"
            }`}
          >
            <p
              className={`text-[7px] md:text-[10px] font-black uppercase italic leading-loose tracking-widest ${
                royaltiesEnabled ? "text-[#b87209]" : "text-red-600"
              }`}
            >
              1% Founders Royalties {royaltiesEnabled ? "Active" : "Inactive"}
              <br />
              {!royaltiesEnabled
                ? "LOCKED // REQUIRE PROFIT"
                : "AUTHORIZED // REWARDS ENABLED"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
