"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import "@farcaster/auth-kit/styles.css";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isSuccess, isConnected } = useSignIn({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (isConnected || isSuccess)) {
      router.push("/dashboard");
    }
  }, [isConnected, isSuccess, router, mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center pt-10 md:pt-16 pb-32">
      {/* 1. HERO */}
      <div className="text-center space-y-6 max-w-4xl px-4">
        <h2 className="text-[#b87209] text-xs font-black uppercase tracking-[0.4em]">
          Now Showing: Onchain Automation
        </h2>
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
          LIGHTS. CAMERA. <br />
          <span className="text-[#b87209] drop-shadow-[0_0_20px_rgba(184,114,9,0.4)]">
            PROFITS.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The world's first cinematic trading engine. Deploy automated
          strategies on Base.
        </p>
      </div>

      {/* 2. AUTH PORTAL */}
      <div className="mt-12 w-full max-w-sm bg-black/40 border border-[#b87209]/20 p-8 relative z-50">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b87209] text-black text-[9px] font-black px-4 py-1 uppercase">
          Executive Access
        </div>
        <div className="space-y-4">
          <Wallet>
            <ConnectWallet className="w-full bg-white text-black font-black py-4 uppercase">
              Connect Wallet
            </ConnectWallet>
          </Wallet>
          <div className="flex items-center space-x-2 py-2">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="text-gray-600 text-[9px]">or</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>
          <div className="flex justify-center hover:scale-[1.02] transition-transform">
            <SignInButton />
          </div>
        </div>
      </div>

      {/* 3. GUIDE */}
      <div className="mt-12 w-full max-w-6xl px-6 border-t border-white/5 pt-10">
        <h3 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-10">
          From Script to <span className="text-[#b87209]">Settlement</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 border border-white/5">
            <div className="text-3xl font-black italic text-[#b87209]/20">
              01
            </div>
            <h4 className="text-white font-bold uppercase text-[11px]">
              Cast Your Wallet
            </h4>
            <p className="text-gray-400 text-[10px]">
              Connect your Base wallet or Farcaster ID to secure your producer’s
              pass.
            </p>
          </div>
          <div className="p-6 border border-white/5">
            <div className="text-3xl font-black italic text-[#b87209]/20">
              02
            </div>
            <h4 className="text-white font-bold uppercase text-[11px]">
              Set the Script
            </h4>
            <p className="text-gray-400 text-[10px]">
              Pick a trading genre. Your agent executes onchain strategies while
              you sleep.
            </p>
          </div>
          <div className="p-6 border border-white/5">
            <div className="text-3xl font-black italic text-[#b87209]/20">
              03
            </div>
            <h4 className="text-white font-bold uppercase text-[11px]">
              Take Royalties
            </h4>
            <p className="text-gray-400 text-[10px]">
              Watch box office results live. Profits settle directly to your
              custodial wallet.
            </p>
          </div>
          <div className="p-6 bg-[#b87209]/10 border border-[#b87209]/40">
            <div className="text-3xl font-black italic text-[#b87209]">$$</div>
            <h4 className="text-[#b87209] font-black uppercase text-[11px]">
              Founder's Cut
            </h4>
            <p className="text-white text-[10px] font-bold">
              Earn a 1% lifetime incentive on every trade made by your referred
              crew.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
