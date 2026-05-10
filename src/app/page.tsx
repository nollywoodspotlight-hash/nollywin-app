"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import NollyWallet from "./components/NollyWallet";

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, mounted, router]);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="flex flex-col items-center min-h-screen bg-black text-white selection:bg-[#b87209] selection:text-black overflow-x-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[40%] bg-[#b87209]/20 blur-[100px] rounded-full transform-gpu opacity-100" />
      </div>

      <div className="text-center space-y-6 max-w-5xl px-6 pt-28 md:pt-40 relative z-10">
        <div className="inline-block border border-[#b87209]/40 px-4 py-1 mb-6">
          <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
            Now Showing: The Future of DCA
          </h2>
        </div>

        <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] mb-4">
          LIGHTS. CAMERA. <br />
          <span className="text-[#b87209] filter drop-shadow-[0_0_30px_rgba(184,114,9,0.5)] transform-gpu">
            PROFITS.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-tight italic">
          The world&apos;s first cinematic trading engine. Deploy automated
          scripts on{" "}
          <span className="text-white font-bold underline decoration-[#b87209] underline-offset-4">
            Base
          </span>
          .
        </p>
      </div>

      <div className="w-full mt-12 py-6 bg-[#b87209]/5 border-y border-[#b87209]/20 relative z-10 overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-24 md:mx-48">
              <span className="text-[#b87209] font-black italic uppercase text-lg md:text-xl tracking-[0.5em] drop-shadow-[0_0_12px_rgba(184,114,9,0.5)]">
                DEPLOYING ON BASE
              </span>
              <span className="mx-24 md:mx-48 text-white/10 text-2xl font-thin tracking-widest">
                ///
              </span>
              <span className="text-white font-black italic uppercase text-lg md:text-xl tracking-[0.5em]">
                NOLLYWIN PRODUCTION SYSTEM
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 w-[90%] max-w-sm bg-black border border-[#b87209]/30 p-10 backdrop-blur-xl relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform-gpu">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b87209] text-black text-[10px] font-black px-6 py-1 uppercase tracking-widest whitespace-nowrap text-center">
          Executive Access
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <NollyWallet className="w-full" />
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em]">
            {isConnected ? "Welcome, Producer" : "Authorized via Base Mainnet"}
          </p>
        </div>
      </div>

      <div className="mt-24 w-full max-w-6xl px-6 pb-24 relative z-10">
        <div className="flex items-center space-x-4 mb-12">
          <div className="h-[1px] flex-1 bg-[#b87209]/30" />
          <h3 className="text-white font-black uppercase italic tracking-[0.3em] text-sm text-center">
            The Production Protocol
          </h3>
          <div className="h-[1px] flex-1 bg-[#b87209]/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group p-8 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all duration-500">
            <div className="text-4xl font-black italic mb-4 transition-colors text-[#b87209] drop-shadow-[0_0_10px_rgba(184,114,9,0.8)] md:text-[#b87209]/10 md:drop-shadow-none md:group-hover:text-[#b87209] md:group-hover:drop-shadow-[0_0_10px_rgba(184,114,9,0.5)]">
              01
            </div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-xs mb-3">
              Cast Your Wallet
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Connect your Base wallet to enter the studio.
            </p>
          </div>

          <div className="group p-8 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all duration-500">
            <div className="text-4xl font-black italic mb-4 transition-colors text-[#b87209] drop-shadow-[0_0_10px_rgba(184,114,9,0.8)] md:text-[#b87209]/10 md:drop-shadow-none md:group-hover:text-[#b87209] md:group-hover:drop-shadow-[0_0_10px_rgba(184,114,9,0.5)]">
              02
            </div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-xs mb-3">
              Write The Script
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Configure DCA intervals and risk parameters.
            </p>
          </div>

          <div className="group p-8 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all duration-500">
            <div className="text-4xl font-black italic mb-4 transition-colors text-[#b87209] drop-shadow-[0_0_10px_rgba(184,114,9,0.8)] md:text-[#b87209]/10 md:drop-shadow-none md:group-hover:text-[#b87209] md:group-hover:drop-shadow-[0_0_10px_rgba(184,114,9,0.5)]">
              03
            </div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-xs mb-3">
              Roll Camera
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Your strategy executes 24/7 on-chain.
            </p>
          </div>

          <div className="p-8 bg-[#b87209]/5 border border-[#b87209]/40 shadow-[0_0_40px_rgba(184,114,9,0.15)] relative overflow-hidden transform-gpu">
            <div className="absolute top-0 right-0 p-2 opacity-30">
              <div className="w-12 h-12 border-t-2 border-r-2 border-[#b87209]"></div>
            </div>
            <div className="text-4xl font-black italic text-[#b87209] mb-4 drop-shadow-[0_0_10px_rgba(184,114,9,0.5)]">
              $$
            </div>
            <h4 className="text-[#b87209] font-black italic uppercase tracking-widest text-xs mb-3">
              Founder&apos;s Cut
            </h4>
            <p className="text-white text-[10px] leading-relaxed uppercase font-bold italic">
              Earn 1% lifetime royalties from your production crew.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
