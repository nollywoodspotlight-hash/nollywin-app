"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useSignIn } from "@farcaster/auth-kit";

export default function Dashboard() {
  const { address, isConnected: isWagmiConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Farcaster Auth Hook
  const {
    isConnected: isFarcasterConnected,
    isSuccess,
    data: farcasterData,
  } = useSignIn({});

  // Loading state
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  // State for the Cinematic Trade Form
  const [formData, setFormData] = useState({
    ticker: "",
    dcaAmount: "",
    frequency: "1",
    profitTarget: "20",
    multiplier: "2X",
  });

  const [lifecycleState, setLifecycleState] = useState("ACTIVE");

  /**
   * REVISED SESSION PROTECTION
   * This version is "stickier." It waits for the Farcaster data to resolve
   * and only redirects if after a significant delay there is still no auth.
   */
  useEffect(() => {
    const checkAuth = () => {
      const hasFarcaster =
        isFarcasterConnected || isSuccess || farcasterData?.username;
      const hasWallet = isWagmiConnected && address;

      if (hasFarcaster || hasWallet) {
        // User is found! Stop the timer and show the dashboard.
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        setIsAuthorizing(false);
      } else {
        // No user found yet. Start a 3-second timer.
        // This gives the SDK plenty of time to fetch the Farcaster session from the cookie.
        if (!redirectTimerRef.current) {
          redirectTimerRef.current = setTimeout(() => {
            console.log("NollyWin: No session resolved. Redirecting home...");
            router.push("/");
          }, 3000);
        }
      }
    };

    checkAuth();

    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [
    isWagmiConnected,
    isFarcasterConnected,
    isSuccess,
    farcasterData,
    address,
    router,
  ]);

  const handleLogout = () => {
    disconnect();
    // Force a hard reload to home to clear all auth states
    window.location.href = "/";
  };

  const userIdentifier =
    farcasterData?.username ||
    (address ? `${address.slice(0, 6)}...` : "Producer");
  const referralLink = `https://nollywin.app/?ref=${farcasterData?.username || address || "anon"}`;

  const statusLights = [
    "ACTIVE",
    "PAUSED",
    "STALLED",
    "COMPLETED",
    "CANCELLED",
  ];

  // Loading Screen
  if (isAuthorizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-[#b87209]/20 border-t-[#b87209] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#b87209] animate-pulse">
            NW
          </div>
        </div>
        <h2 className="mt-6 text-[#b87209] font-black uppercase italic tracking-[0.3em] text-[10px]">
          Verifying Executive Producer Credentials...
        </h2>
        <p className="mt-2 text-gray-600 text-[8px] uppercase tracking-widest font-bold">
          Checking Farcaster & Base Mainnet...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            Current Production
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              Executive Producer:{" "}
              <span className="text-white">
                {farcasterData?.username
                  ? `@${farcasterData.username}`
                  : address}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="text-[9px] font-black text-red-500 hover:text-white hover:bg-red-500 uppercase tracking-tighter border border-red-500/20 px-2 py-0.5 transition-all"
            >
              Terminate Session
            </button>
          </div>
        </div>

        {/* UNIQUE REFERRAL BOX */}
        <div className="bg-[#b87209]/10 border border-[#b87209]/30 p-4 rounded-sm w-full md:w-auto">
          <span className="text-[#b87209] text-[9px] font-black uppercase tracking-widest block mb-2">
            Founder Referral Link (1% Royalty)
          </span>
          <div className="flex items-center gap-3">
            <code className="text-white text-[10px] font-mono bg-black/40 px-2 py-1">
              {referralLink}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert("Referral link copied to clipboard!");
              }}
              className="text-[10px] font-bold text-[#b87209] hover:text-white uppercase transition-colors"
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
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#b87209] outline-none transition-all placeholder:text-gray-700"
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
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#b87209] placeholder:text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                  Freq (Hours)
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#b87209] placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                Sell Options (Take Profit)
              </label>
              <select className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none appearance-none cursor-pointer focus:border-[#b87209]">
                {[1, 2, 3, 5, 10, 12].map((x) => (
                  <option
                    key={x}
                    value={`${x}X`}
                    className="bg-black text-white"
                  >
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
