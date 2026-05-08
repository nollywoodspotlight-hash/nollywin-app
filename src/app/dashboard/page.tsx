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

    console.log("Auth check:", {
      isWagmiConnected,
      isFarcasterConnected,
      isSuccess,
      isAuthenticated,
      hasAuth,
    });

    if (hasAuth) {
      setIsCheckingAuth(false);
      console.log("✅ Auth successful - showing dashboard");
    } else {
      // Give more time for Farcaster auth to complete (especially in Warpcast)
      const timeout = setTimeout(() => {
        if (!hasAuth) {
          console.log("⏰ No auth detected after timeout → redirecting");
          router.push("/");
        }
      }, 4500); // Increased timeout

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

  // Loading screen
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white">
        <div className="w-12 h-12 border-2 border-[#b87209] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#b87209] font-black uppercase italic tracking-widest text-[10px] animate-pulse">
          Reviewing Production Credentials...
        </p>
        <p className="text-[10px] text-gray-500 mt-6">
          This may take a few seconds in Warpcast
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

        {/* Rest of your dashboard UI remains the same */}
        {/* ... (Main content grid unchanged) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Strategy Input */}
          <div className="lg:col-span-1 bg-black/40 border border-white/10 p-8 rounded-sm space-y-6 relative overflow-hidden">
            {/* ... your existing form ... */}
          </div>

          {/* Right Column: Live Monitor */}
          <div className="lg:col-span-2 bg-[#1d02cb]/5 border border-white/10 p-8 rounded-sm flex flex-col justify-between relative">
            {/* ... your existing monitor ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
