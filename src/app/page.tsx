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

  // REDIRECT LOGIC:
  // If the user connects via the Navbar or this Hero button,
  // they are automatically moved to the Dashboard.
  useEffect(() => {
    if (mounted && isConnected) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000); // 1 second delay to let them see the "Connected" state
      return () => clearTimeout(timer);
    }
  }, [isConnected, mounted, router]);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="flex flex-col items-center pt-12 md:pt-20 pb-32 min-h-screen bg-black text-white selection:bg-[#b87209] selection:text-black overflow-x-hidden relative">
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#b87209]/10 via-transparent to-transparent pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <div className="text-center space-y-6 max-w-4xl px-6 relative z-10">
        <div className="inline-block border border-[#b87209]/40 px-3 py-1 mb-4">
          <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
            Now Showing: The Future of DCA
          </h2>
        </div>

        <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4">
          LIGHTS. CAMERA. <br />
          <span className="text-[#b87209] drop-shadow-[0_0_30px_rgba(184,114,9,0.5)]">
            PROFITS.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-tight italic">
          The world&apos;s first cinematic trading engine. Deploy automated
          scripts on{" "}
          <span className="text-white font-bold underline decoration-[#b87209]">
            Base
          </span>
          .
        </p>
      </div>

      {/* --- AUTH PORTAL (CENTERED & SYNCED) --- */}
      <div className="mt-16 w-full max-w-sm bg-black/60 border border-[#b87209]/30 p-10 backdrop-blur-xl relative z-20 shadow-2xl">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b87209] text-black text-[10px] font-black px-6 py-1 uppercase tracking-widest whitespace-nowrap text-center">
          Executive Access
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          {/* This uses the exact same logic as the Navbar. 
              If the user logs in up top, this button turns Gold here too.
          */}
          <NollyWallet className="w-full" />

          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em]">
            {isConnected ? "Welcome, Producer" : "Authorized via Base Mainnet"}
          </p>
        </div>
      </div>

      {/* --- PRODUCTION PROTOCOL --- */}
      <div className="mt-20 w-full max-w-6xl px-6 relative z-10">
        <div className="flex items-center space-x-4 mb-10">
          <div className="h-[1px] flex-1 bg-white/10" />
          <h3 className="text-white font-black uppercase italic tracking-widest text-sm text-center">
            The Production Protocol
          </h3>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group p-6 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all">
            <div className="text-3xl font-black italic text-[#b87209]/20 group-hover:text-[#b87209] mb-4 transition-colors">
              01
            </div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              Cast Your Wallet
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Connect your Base wallet to enter the studio.
            </p>
          </div>

          <div className="group p-6 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all">
            <div className="text-3xl font-black italic text-[#b87209]/20 group-hover:text-[#b87209] mb-4 transition-colors">
              02
            </div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              Write The Script
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Configure DCA intervals and risk parameters.
            </p>
          </div>

          <div className="group p-6 bg-white/[0.02] border border-white/5 hover:border-[#b87209]/50 transition-all">
            <div className="text-3xl font-black italic text-[#b87209]/20 group-hover:text-[#b87209] mb-4 transition-colors">
              03
            </div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              Roll Camera
            </h4>
            <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold">
              Your strategy executes 24/7 on-chain.
            </p>
          </div>

          <div className="p-6 bg-[#b87209]/10 border border-[#b87209]/40 shadow-[0_0_30px_rgba(184,114,9,0.1)]">
            <div className="text-3xl font-black italic text-[#b87209] mb-4">
              $$
            </div>
            <h4 className="text-[#b87209] font-black uppercase tracking-widest text-xs mb-2">
              Founder&apos;s Cut
            </h4>
            <p className="text-white text-[10px] leading-relaxed uppercase font-bold italic">
              Earn 1% lifetime royalties from your production crew.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
