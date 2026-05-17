"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAccount, useDisconnect, useSwitchChain, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Share2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";

interface Trade {
  id: string;
  wallet_address: string;
  target_contract_address: string;
  dca_amount_eth: number;
  lifecycle_state: string;
  status: string;
  tx_hash: string;
  profit_eth?: number;
  created_at?: string;
  sell_multiplier_snapshot: string;
  frequency_hours_snapshot: string;
}

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { refetch: refreshBalance } = useBalance({ address });
  const router = useRouter();

  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [isTradeActive, setIsTradeActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasRealizedProfit, setHasRealizedProfit] = useState(false);
  const [isCurrentlyActive, setIsCurrentlyActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState("");
  const [manualHash, setManualHash] = useState("");

  const [contractAddress, setContractAddress] = useState("");
  const [dcaAmount, setDcaAmount] = useState("0.01");
  const [frequency, setFrequency] = useState("4");
  const [sellMultiplier, setSellMultiplier] = useState("2");

  const supabase = useMemo(() => {
    const url = "https://acwbclupfnunoqyhjrcx.supabase.co";
    const key = "sb_publishable_t1rYXtsc8AAEEIPCvApKlw_IXnDdBJj";
    return createClient(url, key);
  }, []);

  const royaltiesEnabled = isCurrentlyActive && hasRealizedProfit;
  const referralLink = address
    ? `https://nollywin.xyz/join?ref=${address}`
    : "";

  // Only keep track of live active positions here
  const activeSnipers = useMemo(() => {
    return trades.filter(
      (t) =>
        t.status === "PENDING" ||
        t.status === "ACTIVE_HUNTING" ||
        t.status === "TRACKING_PROFIT",
    );
  }, [trades]);

  // --- HANDLERS ---

  const handleShareReferralX = () => {
    const ctaText = `🎬 Just fired up the @NollyWin parallel sniper engine on Base Mainnet. Zero-delay block execution targets are locked. Grab your onboarding crew pass and track live allocations here:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        ctaText,
      )}&url=${encodeURIComponent(referralLink)}`,
      "_blank",
    );
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
        if (!supabase) throw new Error("Database client not initialized");
        const { error: dbError } = await supabase.from("dca_orders").insert([
          {
            user_address: address,
            token_to_buy: recoveryCA,
            amount_per_trade: parseFloat(dcaAmount),
            status: "ACTIVE_HUNTING",
            tx_hash: cleanHash,
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

  const handleTradeAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (contractAddress.length < 42 || !contractAddress.startsWith("0x")) {
      alert(
        "Invalid Target CA. Please input a complete 42-character Ethereum address.",
      );
      return;
    }
    if (chain?.id !== base.id) {
      switchChain?.({ chainId: base.id });
      return;
    }
    if (!supabase) {
      alert("Central database connection protocol offline.");
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStep("SNIPER DEPLOYMENT INITIATED");

      const savedMultiplier = sellMultiplier;
      const savedFrequency = frequency;
      const savedAmount = parseFloat(dcaAmount);

      const { error: dcaError } = await supabase.from("dca_orders").insert([
        {
          user_address: address,
          token_to_buy: contractAddress.trim(),
          amount_per_trade: savedAmount,
          status: "PENDING",
          tx_hash: "AWAITING_HIGH_SPEED_BLOCK_SWAP",
        },
      ]);

      if (dcaError) throw dcaError;

      alert(
        "SUCCESS: Sniper target locked. Nollywin High-Frequency Engine is scanning active blocks.",
      );
      setContractAddress("");

      const { data } = await supabase
        .from("dca_orders")
        .select("*")
        .eq("user_address", address)
        .order("id", { ascending: false });

      if (data) {
        const formattedTrades = data.map((order: any) => {
          return {
            id: order.id.toString(),
            wallet_address: order.user_address,
            target_contract_address: order.token_to_buy || "",
            dca_amount_eth: order.amount_per_trade || savedAmount,
            lifecycle_state: String(order.status).toUpperCase(),
            status: order.status || "PENDING",
            tx_hash: order.tx_hash || "AWAITING_HIGH_SPEED_BLOCK_SWAP",
            profit_eth: order.profit_eth || 0,
            sell_multiplier_snapshot: savedMultiplier,
            frequency_hours_snapshot: savedFrequency,
          };
        });
        setTrades(formattedTrades);
      }
    } catch (error: any) {
      console.error(error);
      alert(
        `DEPLOYMENT ABORTED: ${
          error.message || "Failed to broadcast sniper order parameters."
        }`,
      );
    } finally {
      setIsSyncing(false);
      setSyncStep("");
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAbortTrade = async (trade: Trade) => {
    if (
      !window.confirm(
        "Abort sniper position tracking and liquidate current assets for profit?",
      )
    )
      return;
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

  // --- EFFECTS ---

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) router.push("/");
    if (mounted && isConnected && chain?.id !== base.id)
      switchChain?.({ chainId: base.id });
  }, [isConnected, chain, router, switchChain, mounted]);

  useEffect(() => {
    async function syncDashboard() {
      if (!address || !supabase) return;

      const { data } = await supabase
        .from("dca_orders")
        .select("*")
        .eq("user_address", address)
        .order("id", { ascending: false });

      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", address);

      if (data) {
        const formattedTrades = data.map((order: any) => {
          let derivedMultiplier = "2";
          let derivedFrequency = "4";

          if (order.id % 2 === 0) {
            derivedMultiplier = "3";
            derivedFrequency = "8";
          }

          return {
            id: order.id.toString(),
            wallet_address: order.user_address,
            target_contract_address: order.token_to_buy || "",
            dca_amount_eth: order.amount_per_trade || 0,
            lifecycle_state: String(order.status).toUpperCase(),
            status: order.status || "PENDING",
            tx_hash: order.tx_hash || "AWAITING_HIGH_SPEED_BLOCK_SWAP",
            profit_eth: order.profit_eth || 0,
            sell_multiplier_snapshot: derivedMultiplier,
            frequency_hours_snapshot: derivedFrequency,
          };
        });

        setTrades(formattedTrades);

        const active = data.some(
          (s: any) =>
            s.status === "PENDING" ||
            s.status === "ACTIVE_HUNTING" ||
            s.status === "TRACKING_PROFIT",
        );
        const profit = data.some((s: any) => (s.profit_eth || 0) > 0);

        setIsCurrentlyActive(active);
        setHasRealizedProfit(profit);
        setIsTradeActive(active);
      }
      if (count !== null) setReferralCount(count);
    }
    if (mounted) syncDashboard();
  }, [address, supabase, mounted]);

  if (!mounted || !isConnected) return null;

  return (
    <div
      className={`${inter.className} min-h-screen bg-transparent text-white antialiased selection:bg-[#b87209] selection:text-black`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.1),transparent_60%)] pointer-events-none z-[1]" />

      <div className="relative z-50 max-w-5xl mx-auto px-4 pt-32 pb-20">
        <div className="border-l-4 border-[#b87209] pl-6 mb-12 text-left italic">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Production <span className="text-[#b87209]">Dashboard</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mt-3 font-bold">
            Authorized Protocol / Base Mainnet / {address?.slice(0, 14)}...
          </p>
        </div>

        {/* SNIPER WORKSPACE EDITOR MODULE */}
        <div className="bg-[#080808]/90 backdrop-blur-sm border border-[#b87209]/40 shadow-2xl mb-12">
          <div className="bg-[#b87209]/10 border-b border-[#b87209]/20 px-6 py-3 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest italic text-[#b87209]">
              Sniper Module Editor
            </span>
            <span
              className={`text-[10px] font-black uppercase italic ${
                activeSnipers.length > 0
                  ? "text-green-500 font-mono tracking-widest"
                  : "text-red-500"
              }`}
            >
              {isSyncing
                ? `● ${syncStep}`
                : activeSnipers.length > 0
                ? "● SNIPER ACTIVE (LISTENING H-F BLOCKS)"
                : "● STANDBY"}
            </span>
          </div>

          <div className="p-6 md:p-12 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <label className="text-[#b87209] uppercase text-[10px] font-black tracking-widest mb-2 block italic">
                    Target Token CA
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full bg-black/50 border-b-2 border-white/10 py-3 text-xl font-mono text-white outline-none focus:border-[#b87209]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Size (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={dcaAmount}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-xl font-bold italic text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                        <option
                          key={h}
                          value={h.toString()}
                          className="bg-black text-white"
                        >
                          {h}H
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 uppercase text-[9px] font-black block mb-2 italic">
                      Exit Target
                    </label>
                    <select
                      value={sellMultiplier}
                      onChange={(e) => setSellMultiplier(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 text-lg font-bold italic text-[#b87209] outline-none"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((m) => (
                        <option
                          key={m}
                          value={m.toString()}
                          className="bg-black text-white"
                        >
                          {m}X
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center lg:border-l lg:border-white/5 lg:pl-12">
                <button
                  onClick={handleTradeAction}
                  disabled={isSyncing}
                  className="w-full h-32 md:h-64 border-4 border-[#b87209] bg-transparent text-[#b87209] hover:bg-[#b87209] hover:text-black transition-all duration-500 active:scale-95"
                >
                  <span className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
                    {isSyncing ? "ENGAGING ENGINE" : "DEPLOY SNIPER"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: LIVE SNIPER MONITORING FEED */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-[#b87209] font-black uppercase italic tracking-[0.4em] text-xs">
              Live Sniper Feed
            </h2>
            <div className="h-[1px] flex-grow bg-white/5" />
          </div>
          <div className="space-y-3 text-left">
            {activeSnipers.length === 0 ? (
              <div className="py-12 border border-dashed border-white/10 bg-black/20 text-center">
                <p className="text-gray-700 text-[10px] font-black uppercase italic tracking-[0.3em]">
                  No Active Positions Monitored
                </p>
              </div>
            ) : (
              activeSnipers.map((trade) => (
                <button
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade)}
                  className="w-full flex justify-between items-center bg-[#080808]/90 backdrop-blur-sm border border-white/5 p-6 transition-all group hover:border-[#b87209]/50"
                >
                  <div className="text-left">
                    <p className="text-white font-bold uppercase text-xs tracking-widest">
                      Target CA: {trade.target_contract_address.slice(0, 12)}...
                    </p>
                    <p className="text-[10px] mt-1 font-mono italic text-gray-400">
                      STATUS: {trade.status} | MONITORING {trade.dca_amount_eth}{" "}
                      ETH
                    </p>
                  </div>
                  <span className="text-[10px] font-black italic group-hover:tracking-[0.2em] transition-all underline text-[#b87209]">
                    [ VIEW INTEL ]
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* HIGH-TELEMETRY DETAILED MODAL VIEWER */}
        {selectedTrade && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#080808] border-2 border-[#b87209] shadow-2xl">
              <div className="bg-[#b87209] px-8 py-4 flex justify-between items-center text-left">
                <h3 className="text-black font-black uppercase italic text-xl tracking-tighter">
                  Sniper Target Parameters: Order #{selectedTrade.id}
                </h3>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="text-black font-black hover:rotate-90 transition-all text-sm font-mono"
                >
                  [X]
                </button>
              </div>
              <div className="p-10 space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-6">
                  <div>
                    <label className="text-[#b87209] text-[10px] uppercase font-black italic mb-2 tracking-widest block">
                      Target Asset Contract
                    </label>
                    <p className="text-white text-xs truncate font-mono select-all bg-black/30 p-2 border border-white/5 rounded-sm">
                      {selectedTrade.target_contract_address}
                    </p>
                  </div>
                  <div>
                    <label className="text-[#b87209] text-[10px] uppercase font-black italic mb-2 tracking-widest block">
                      Pipeline State
                    </label>
                    <p
                      className={`text-xs uppercase font-black italic tracking-wider p-2 border rounded-sm inline-block ${
                        selectedTrade.status === "COMPLETED"
                          ? "text-green-500 border-green-500/20 bg-green-500/5"
                          : selectedTrade.status === "ABORT_REQUESTED" ||
                            selectedTrade.status === "ABORTED"
                          ? "text-red-500 border-red-500/20 bg-red-500/5"
                          : "text-[#b87209] border-[#b87209]/20 bg-[#b87209]/5"
                      }`}
                    >
                      {selectedTrade.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 border-b border-white/5 pb-6 text-left">
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black italic mb-1 tracking-wider">
                      Allocation Size
                    </p>
                    <p className="text-white text-base font-black italic font-mono">
                      {selectedTrade.dca_amount_eth}{" "}
                      <span className="text-[#b87209] text-xs">ETH</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black italic mb-1 tracking-wider">
                      Exit Multiplier
                    </p>
                    <p className="text-[#b87209] text-base font-black italic font-mono">
                      {selectedTrade.sell_multiplier_snapshot}X
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black italic mb-1 tracking-wider">
                      Block Cycle
                    </p>
                    <p className="text-white text-sm font-bold font-mono uppercase bg-white/5 px-2 py-1 rounded-sm text-center inline-block">
                      {selectedTrade.frequency_hours_snapshot}H Int.
                    </p>
                  </div>
                </div>

                <div className="border-b border-white/5 pb-8">
                  <label className="text-[#b87209] text-[10px] uppercase font-black italic mb-2 tracking-widest block">
                    Network Broadcast Hash
                  </label>
                  <p className="text-gray-400 text-xs font-mono select-all break-all bg-black/40 p-3 border border-white/5 rounded-sm tracking-tighter">
                    {selectedTrade.tx_hash}
                  </p>
                </div>

                {(selectedTrade.status === "PENDING" ||
                  selectedTrade.status === "ACTIVE_HUNTING" ||
                  selectedTrade.status === "TRACKING_PROFIT") && (
                  <button
                    onClick={() => handleAbortTrade(selectedTrade)}
                    className="w-full py-8 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic text-2xl tracking-tighter transition-all active:scale-95 shadow-lg"
                  >
                    ABORT POSITION TRACKING
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROTOCOL CREW AND REF ELEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="md:col-span-2 bg-[#080808]/90 backdrop-blur-sm border border-white/5 p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[#b87209] uppercase font-black tracking-widest text-xs italic underline decoration-white/10 underline-offset-8">
                  Production Crew
                </h3>
                <p className="text-gray-500 text-[8px] uppercase tracking-wider font-bold italic mt-2">
                  Invite new pilots to capture passive overrides
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#b87209] font-black italic text-[10px] uppercase">
                  Headcount
                </p>
                <p className="text-white font-black text-3xl italic leading-none">
                  {referralCount}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex border border-[#b87209]/40 bg-black">
                <div className="flex-grow p-4 font-mono text-[10px] text-[#b87209] truncate italic">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#b87209] hover:bg-white text-black px-8 font-black uppercase text-[10px] italic transition-colors"
                >
                  {copied ? "COPIED" : "COPY LINK"}
                </button>
              </div>

              <button
                onClick={handleShareReferralX}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#b87209] hover:bg-[#b87209] text-[#b87209] hover:text-black py-3 px-4 font-black text-[10px] uppercase italic tracking-wider transition-all duration-300 active:scale-95"
              >
                Share Referral Pass to X
              </button>
            </div>
          </div>

          <div
            className={`border-2 p-8 flex flex-col justify-center text-center backdrop-blur-sm ${
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
