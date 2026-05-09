"use client";

import React, { useEffect, useState } from "react";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import "@farcaster/auth-kit/styles.css";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { isSuccess, isConnected, data } = useSignIn({
    onSuccess: (res) => {
      console.log("✅ Farcaster Sign-in Success:", res);
      forceRedirect();
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const forceRedirect = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    console.log("🚀 Forcing redirect to dashboard...");

    // Multiple attempts for Warpcast reliability
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 300);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  // Strong watchdog
  useEffect(() => {
    if (!mounted || isRedirecting) return;

    const hasAuth = isSuccess || isConnected || !!data?.username;

    if (hasAuth) {
      forceRedirect();
    }
  }, [isSuccess, isConnected, data, mounted, isRedirecting]);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="flex flex-col items-center pt-10 md:pt-16 pb-32 min-h-screen bg-black text-white selection:bg-[#b87209] selection:text-black">
      {/* HERO SECTION */}
      <div className="text-center space-y-6 max-w-4xl px-4 relative z-10">
        <h2 className="text-[#b87209] text-xs font-black uppercase tracking-[0.4em] animate-pulse">
          Now Showing: Onchain Automation
        </h2>
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
          LIGHTS. CAMERA. <br />
          <span className="text-[#b87209] drop-shadow-[0_0_20px_rgba(184,114,9,0.4)]">
            PROFITS.
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          The world's first cinematic trading engine. Deploy automated
          strategies on{" "}
          <span className="text-white font-bold underline decoration-[#b87209]">
            Base
          </span>{" "}
          with the speed of a Lagos blockbuster.
        </p>
      </div>

      {/* AUTH PORTAL */}
      <div className="mt-12 w-full max-w-sm bg-black/40 border border-[#b87209]/20 p-8 rounded-sm backdrop-blur-md shadow-2xl relative z-50">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b87209] text-black text-[9px] font-black px-4 py-1 uppercase tracking-widest whitespace-nowrap">
          Executive Access
        </div>

        {isRedirecting ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b87209] mx-auto mb-4"></div>
            <p className="text-[#b87209] font-black uppercase text-[10px] tracking-widest">
              Opening Studio... Please wait
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Wallet>
                <ConnectWallet className="w-full bg-white text-black font-black py-4 uppercase tracking-tighter flex items-center justify-center space-x-3 hover:bg-gray-200 transition-all shadow-lg group rounded-none">
                  <div className="w-5 h-5 bg-[#0052FF] rounded-full group-hover:scale-110 transition-transform" />
                  <span>Connect Wallet</span>
                </ConnectWallet>
              </Wallet>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <div className="h-[1px] bg-white/10 flex-grow" />
              <span className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="h-[1px] bg-white/10 flex-grow" />
            </div>

            <div className="farcaster-button-wrapper hover:scale-[1.02] transition-transform flex justify-center relative z-[100] pointer-events-auto">
              <SignInButton />
            </div>
          </div>
        )}
      </div>

      {/* PRODUCTION GUIDE SECTION (unchanged) */}
      <div className="mt-24 w-full max-w-6xl px-6 border-t border-white/5 pt-10 relative z-10">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Production Protocol
          </h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-tight">
            From Script to <span className="text-[#b87209]">Settlement</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Your 4 cards here - keep them exactly as before */}
          <div className="group space-y-4 p-6 bg-[#1d02cb]/5 border border-white/5 hover:border-[#b87209]/30 transition-all rounded-sm">
            <div className="text-3xl font-black italic text-[#b87209]/20 group-hover:text-[#b87209] transition-colors">
              01
            </div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[11px]">
              Cast Your Wallet
            </h4>
            <p className="text-gray-400 text-[10px] leading-relaxed font-medium">
              Connect your Base wallet or Farcaster ID to secure your producer’s
              pass.
            </p>
          </div>

          {/* Repeat for cards 02, 03, and Founder's Cut */}
          {/* ... (copy from your previous version) */}
        </div>
      </div>
    </div>
  );
}
