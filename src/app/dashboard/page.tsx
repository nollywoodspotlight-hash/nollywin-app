"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useSignIn, useProfile } from "@farcaster/auth-kit";

export default function Dashboard() {
  const { address, isConnected: isWagmiConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Farcaster Hooks
  const {
    isConnected: isFarcasterConnected,
    isSuccess,
    data: farcasterData,
  } = useSignIn({});

  const { isAuthenticated, profile } = useProfile();

  // Loading state
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    ticker: "",
    dcaAmount: "",
    frequency: "1",
    profitTarget: "20",
    multiplier: "2X",
  });

  useEffect(() => {
    const hasAuth =
      isWagmiConnected || isFarcasterConnected || isSuccess || isAuthenticated;

    if (hasAuth) {
      setIsCheckingAuth(false);
    } else {
      const timeout = setTimeout(() => {
        if (!hasAuth) {
          router.push("/");
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [
    isWagmiConnected,
    isFarcasterConnected,
    isSuccess,
    isAuthenticated,
    router,
  ]);

  const handleLogout = () => {
    disconnect();
    window.location.href = "/";
  };

  const userIdentifier =
    profile?.username ||
    farcasterData?.username ||
    (address ? `${address.slice(0, 6)}...` : "Producer");
  const referralLink = `https://nollywin.app/?ref=${userIdentifier}`;

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white">
        <div className="w-12 h-12 border-2 border-[#b87209] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#b87209] font-black uppercase italic tracking-widest text-[10px] animate-pulse">
          Reviewing Production Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#b87209] selection:text-black p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
              NollyWin Studio
            </h2>
            <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter">
              Current Production
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                Executive: <span className="text-white">@{userIdentifier}</span>
              </p>
              <button
                onClick={handleLogout}
                className="text-[9px] font-black text-red-500 hover:text-white hover:bg-red-500 transition-all uppercase border border-red-500/20 px-2 py-0.5"
              >
                Terminate Session
              </button>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-[#b87209]/10 border border-[#b87209]/30 p-4 rounded-sm w-full md:w-auto">
            <span className="text-[#b87209] text-[9px] font-black uppercase tracking-widest block mb-2">
              1% Founder Royalty Link
            </span>
            <div className="flex items-center gap-3">
              <code className="text-white text-xs font-mono bg-black/40 px-3 py-1 border border-white/5">
                {referralLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  alert("Referral Link Copied");
                }}
                className="text-[10px] font-bold text-[#b87209] hover:text-white transition-colors uppercase"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Strategy Input */}
          <div className="lg:col-span-1 bg-black/40 border border-white/10 p-8 rounded-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#b87209]/5 -rotate-45 translate-x-8 -translate-y-8" />
            <h2 className="text-white font-black uppercase italic tracking-widest text-sm border-b border-white/5 pb-4">
              The Script (Strategy)
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                  Target Memecoin
                </label>
                <input
                  type="text"
                  placeholder="$TICKER"
                  className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#b87209] transition-all"
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
                    className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#b87209]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black mb-2">
                    Freq (Hrs)
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#b87209]"
                  />
                </div>
              </div>

              <button className="w-full bg-[#b87209] text-black font-black py-4 uppercase italic tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(184,114,9,0.2)]">
                Start Production
              </button>
            </div>
          </div>

          {/* Right Column: Live Monitor */}
          <div className="lg:col-span-2 bg-[#1d02cb]/5 border border-white/10 p-8 rounded-sm flex flex-col justify-between relative">
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-white font-black uppercase italic tracking-widest text-sm">
                  Live Feed
                </h2>
                <div className="flex gap-2">
                  <div className="px-3 py-1 text-[8px] font-black border bg-[#b87209] border-[#b87209] text-black shadow-[0_0_10px_#b87209]">
                    ACTIVE
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    Active Script
                  </span>
                  <span className="text-white font-mono text-xs">
                    {formData.ticker || "AWAITING INPUT..."}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black mb-1">
                      Cost Basis
                    </p>
                    <p className="text-2xl font-black italic">
                      0.00{" "}
                      <span className="text-xs not-italic text-gray-600">
                        ETH
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black mb-1">
                      Current Value
                    </p>
                    <p className="text-2xl font-black italic">
                      0.00{" "}
                      <span className="text-xs not-italic text-gray-600">
                        ETH
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black mb-1">
                      PnL (%)
                    </p>
                    <p className="text-2xl font-black italic text-[#b87209]">
                      +0.00%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-black/40 border-l-2 border-[#b87209] text-[10px] text-gray-500 italic flex items-center gap-3">
              <span className="w-2 h-2 bg-[#b87209] rounded-full animate-ping" />
              Production Note: 3% royalty applies only to realized profits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
