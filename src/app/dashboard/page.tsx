"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useAccount,
  useSendTransaction,
  useDisconnect,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { base } from "wagmi/chains";
import { parseEther } from "viem";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { refetch: refreshBalance } = useBalance({ address });
  const router = useRouter();

  // --- STATE ---
  const [trades, setTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [isTradeActive, setIsTradeActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasRealizedProfit, setHasRealizedProfit] = useState(false);
  const [isCurrentlyActive, setIsCurrentlyActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [manualHash, setManualHash] = useState("");

  // Form Inputs
  const [contractAddress, setContractAddress] = useState("");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [sellMultiplier, setSellMultiplier] = useState("2");

  const { sendTransactionAsync } = useSendTransaction();

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !url.startsWith("http") || !key) return null;
    return createClient(url, key);
  }, []);

  const royaltiesEnabled = isCurrentlyActive && hasRealizedProfit;
  const referralLink = address
    ? `https://nollywin.xyz/join?ref=${address}`
    : "";

  // --- HANDLERS ---
  const handleTerminate = () => {
    disconnect();
    router.push("/");
  };

  const handleManualSync = async () => {
    const cleanHash = manualHash.trim();
    if (!cleanHash.startsWith("0x") || cleanHash.length < 64) {
      alert("Please paste a valid transaction hash.");
      return;
    }

    setIsSyncing(true);
    try {
      const recoveryCA =
        contractAddress.length >= 42
          ? contractAddress
          : "0x0000000000000000000000000000000000000000";

      // 1. Try API first
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          contract_address: recoveryCA,
          amount: dcaAmount,
          frequency: frequency,
          multiplier: sellMultiplier,
          txHash: cleanHash,
          isManualSync: true,
        }),
      });

      if (response.ok) {
        alert("SUCCESS: Trade discovered and linked.");
        window.location.reload();
      } else {
        // 2. FALLBACK: Direct DB Insert if API fails
        console.log(
          "🔄 API Sync failed, attempting direct database recovery...",
        );
        if (!supabase) throw new Error("Database client not initialized");

        const { error: dbError } = await supabase.from("strategies").insert([
          {
            wallet_address: address,
            target_contract_address: recoveryCA,
            dca_amount_eth: parseFloat(dcaAmount),
            frequency_hours: parseInt(frequency),
            sell_multiplier: parseFloat(sellMultiplier),
            tx_hash: cleanHash,
            lifecycle_state: "ACTIVE",
          },
        ]);

        if (dbError) throw dbError;
        alert("FORCE SYNC SUCCESS: Trade added directly to feed.");
        window.location.reload();
      }
    } catch (e: any) {
      alert(`SYNC FAILED: ${e.message || "Hash already used or invalid"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAbortTrade = async (trade: any) => {
    if (!window.confirm("Abort production and liquidate for profit?")) return;
    try {
      const res = await fetch("/api/abort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeId: trade.id, wallet_address: address }),
      });
      if (res.ok) {
        setSelectedTrade(null);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTradeAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTradeActive) return;
    if (contractAddress.length < 42) {
      alert("Invalid Target CA");
      return;
    }
    if (chain?.id !== base.id) {
      switchChain?.({ chainId: base.id });
      return;
    }

    try {
      setIsSyncing(true);
      const tx = await sendTransactionAsync({
        to: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        value: parseEther(dcaAmount),
      });

      await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          contract_address: contractAddress,
          amount: dcaAmount,
          frequency: frequency,
          multiplier: sellMultiplier,
          txHash: tx,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isConnected) router.push("/");
    if (isConnected && chain?.id !== base.id)
      switchChain?.({ chainId: base.id });
  }, [isConnected, chain, router, switchChain]);

  useEffect(() => {
    async function syncDashboard() {
      if (!address || !supabase) return;
      const { data } = await supabase
        .from("strategies")
        .select("*")
        .eq("wallet_address", address)
        .order("created_at", { ascending: false });
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", address);
      if (data) {
        setTrades(data);
        const active = data.some((s) => s.lifecycle_state === "ACTIVE");
        const profit = data.some((s) => (s.profit_eth || 0) > 0);
        setIsCurrentlyActive(active);
        setHasRealizedProfit(profit);
        if (active) setIsTradeActive(true);
      }
      if (count !== null) setReferralCount(count);
    }
    syncDashboard();
  }, [address, supabase]);

  if (!isConnected) return null;

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-[#b87209] selection:text-black`}
    >
      <nav className="fixed top-0 left-0 right-0 z-[200] bg-black/95 border-b border-[#b87209]/20 shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
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
            onClick={handleTerminate}
            className="px-6 py-2 border border-[#b87209]/50 hover:bg-[#b87209] hover:text-black transition-all bg-black cursor-pointer rounded-sm"
          >
            <span className="text-[10px] font-black uppercase italic tracking-widest">
              [ Terminate Session ]
            </span>
          </button>
        </div>
      </nav>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.15),transparent_60%)] pointer-events-none z-[1]" />

      <div className="relative z-50 max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 italic text-left">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Production <span className="text-[#b87209]">Dashboard</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mt-3 font-bold">
            Authorized Protocol / Base Mainnet / {address?.slice(0, 14)}...
          </p>
        </div>

        <div className="bg-[#080808] border border-[#b87209]/40 shadow-2xl mb-12">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-6 py-3 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Script Editor
            </span>
            <span
              className={`text-[10px] font-black uppercase italic ${
                isTradeActive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isSyncing
                ? "● SYNCING"
                : isTradeActive
                ? "● RUNNING"
                : "● STANDBY"}
            </span>
          </div>

          <div className="p-6 md:p-12 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <label className="text-[#b87209] uppercase text-[10px] font-black tracking-widest mb-2 block italic">
                    Target CA
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={contractAddress}
                    disabled={isTradeActive}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full bg-black border-b-2 border-white/10 py-3 text-xl font-mono text-white outline-none focus:border-[#b87209]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Size (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcaAmount}
                      disabled={isTradeActive}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-xl font-bold italic text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Interval
                    </label>
                    <select
                      value={frequency}
                      disabled={isTradeActive}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      <option value="1">1H</option>
                      <option value="4">4H</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Exit
                    </label>
                    <select
                      value={sellMultiplier}
                      disabled={isTradeActive}
                      onChange={(e) => setSellMultiplier(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      <option value="2">2X</option>
                      <option value="5">5X</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center lg:border-l lg:border-white/5 lg:pl-12">
                <button
                  onClick={handleTradeAction}
                  disabled={isSyncing}
                  className={`w-full h-32 md:h-64 border-4 transition-all duration-500 active:scale-95 ${
                    isTradeActive
                      ? "border-red-600 bg-red-600/5 text-red-600"
                      : "border-[#b87209] bg-transparent text-[#b87209] hover:bg-[#b87209] hover:text-black"
                  }`}
                >
                  <span className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
                    {isSyncing ? "SYNCING" : isTradeActive ? "ABORT" : "START"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {!isTradeActive && (
          <div className="mb-12 bg-[#080808]/80 border border-[#b87209]/30 p-6 flex flex-col md:flex-row gap-4 items-center rounded-sm shadow-xl">
            <div className="text-left flex-grow">
              <h4 className="text-[#b87209] text-[11px] font-black uppercase italic tracking-widest">
                Protocol Recovery
              </h4>
              <p className="text-gray-500 text-[8px] uppercase font-bold italic mt-1">
                Paste Hash to claim trade if it didn&apos;t appear.
              </p>
            </div>
            <input
              type="text"
              placeholder="0x... (Hash)"
              value={manualHash}
              onChange={(e) => setManualHash(e.target.value)}
              className="bg-black border border-white/10 px-4 py-3 text-[11px] font-mono text-[#b87209] w-full md:w-96 outline-none focus:border-[#b87209]/60"
            />
            <button
              onClick={handleManualSync}
              className="whitespace-nowrap px-8 py-3 bg-[#b87209] text-black text-[10px] font-black uppercase italic hover:bg-white transition-all"
            >
              Claim Production
            </button>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[#b87209] font-black uppercase italic tracking-[0.4em] text-xs">
              Live Feed
            </h2>
            <div className="h-[1px] flex-grow bg-white/5" />
          </div>
          <div className="space-y-3 text-left">
            {trades.length === 0 ? (
              <div className="py-12 border border-dashed border-white/10 text-center">
                <p className="text-gray-700 text-[10px] font-black uppercase italic tracking-[0.3em]">
                  No Active Productions
                </p>
              </div>
            ) : (
              trades.map((trade) => (
                <button
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade)}
                  className={`w-full flex justify-between items-center bg-[#080808] border p-6 transition-all group ${
                    trade.lifecycle_state === "COMPLETED"
                      ? "border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                      : "border-white/5 hover:border-[#b87209]/50"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-white font-bold uppercase text-xs tracking-widest">
                      Target: {trade.target_contract_address.slice(0, 12)}...
                    </p>
                    <p
                      className={`text-[10px] mt-1 font-mono italic ${
                        trade.lifecycle_state === "COMPLETED"
                          ? "text-green-500"
                          : "text-gray-600"
                      }`}
                    >
                      {trade.lifecycle_state === "COMPLETED"
                        ? `PROFIT: +${trade.profit_eth || "0"} ETH`
                        : `HUNTING: ${trade.dca_amount_eth} ETH`}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black italic group-hover:tracking-[0.2em] transition-all underline ${
                      trade.lifecycle_state === "COMPLETED"
                        ? "text-green-500"
                        : "text-[#b87209]"
                    }`}
                  >
                    [{" "}
                    {trade.lifecycle_state === "COMPLETED"
                      ? "INTEL ARCHIVE"
                      : "VIEW INTEL"}{" "}
                    ]
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedTrade && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#080808] border-2 border-[#b87209] shadow-2xl">
              <div className="bg-[#b87209] px-8 py-4 flex justify-between items-center text-left">
                <h3 className="text-black font-black uppercase italic text-xl tracking-tighter">
                  Intel: {selectedTrade.id}
                </h3>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="text-black font-black hover:rotate-90 transition-all"
                >
                  [X]
                </button>
              </div>
              <div className="p-10 space-y-10 text-left">
                <div className="grid grid-cols-2 gap-10 border-b border-white/5 pb-10">
                  <div>
                    <p className="text-[#b87209] text-[10px] uppercase font-black italic mb-2 tracking-widest">
                      Contract
                    </p>
                    <p className="text-white text-xs truncate font-mono">
                      {selectedTrade.target_contract_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#b87209] text-[10px] uppercase font-black italic mb-2 tracking-widest">
                      Status
                    </p>
                    <p className="text-white text-xs uppercase font-black italic">
                      {selectedTrade.lifecycle_state}
                    </p>
                  </div>
                </div>
                {selectedTrade.lifecycle_state === "ACTIVE" && (
                  <button
                    onClick={() => handleAbortTrade(selectedTrade)}
                    className="w-full py-8 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-2xl tracking-tighter transition-all active:scale-95 shadow-lg"
                  >
                    ABORT PRODUCTION
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="md:col-span-2 bg-[#080808] border border-white/5 p-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic underline decoration-white/10 underline-offset-8">
                Production Crew
              </h3>
              <div className="text-right">
                <p className="text-[#b87209] font-black italic text-[10px] uppercase text-right">
                  Headcount
                </p>
                <p className="text-white font-black text-3xl italic leading-none">
                  {referralCount}
                </p>
              </div>
            </div>
            <div className="flex border border-[#b87209]/40 mt-4">
              <div className="flex-grow bg-black p-5 font-mono text-[10px] text-[#b87209] truncate italic">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#b87209] hover:bg-white text-black px-8 font-black uppercase text-[10px] italic transition-colors"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>
          <div
            className={`border-2 p-8 flex flex-col justify-center text-center ${
              royaltiesEnabled
                ? "bg-[#b87209]/5 border-[#b87209]"
                : "bg-red-950/10 border-red-900/40"
            }`}
          >
            <p
              className={`text-[11px] font-black uppercase italic leading-relaxed tracking-widest ${
                royaltiesEnabled ? "text-[#b87209]" : "text-red-600"
              }`}
            >
              Founders Cut {royaltiesEnabled ? "Active" : "Inactive"}
              <br />
              <span className="text-[8px] opacity-60 mt-2 block tracking-normal italic uppercase">
                {royaltiesEnabled
                  ? "REWARDS ENABLED"
                  : "ACTIVE TRADE + PROFIT REQ."}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
