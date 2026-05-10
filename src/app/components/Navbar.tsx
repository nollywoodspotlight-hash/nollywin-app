"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleConnect = useCallback(() => {
    setIsMenuOpen(false);
    // Navigation to dashboard is handled by the useEffect listener in page.tsx
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-black/95 backdrop-blur-sm border-b border-[#b87209]/30 h-20 transform-gpu">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* --- BRAND LOGO --- */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 bg-[#b87209] flex items-center justify-center font-black italic text-black mr-2 shadow-[0_0_15px_rgba(184,114,9,0.3)]">
            B
          </div>
          <span className="font-black italic text-xl text-white uppercase tracking-tighter">
            THE <span className="text-[#b87209]">STUDIO</span>
          </span>
        </div>

        {/* --- NAVIGATION & ACTIONS --- */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* MOBILE CONNECT BUTTON (Fits perfectly on small screens) */}
          <div className="md:hidden flex items-center shrink-0">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none border border-transparent hover:bg-white hover:text-black transition-all transform-gpu active:scale-95"
              >
                Connect
              </ConnectWallet>
            </Wallet>
          </div>

          {/* DESKTOP LINKS & BUTTON */}
          <nav className="hidden md:flex items-center space-x-8 mr-4">
            <a
              href="#"
              className="text-white/70 font-black italic uppercase text-xs tracking-widest hover:text-[#b87209] transition-colors"
            >
              Archives
            </a>
            <a
              href="#"
              className="text-white/70 font-black italic uppercase text-xs tracking-widest hover:text-[#b87209] transition-colors"
            >
              Cinema
            </a>
          </nav>

          <div className="hidden md:flex items-center">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="bg-[#b87209] text-black font-black italic text-[11px] uppercase py-3 px-6 rounded-none hover:bg-white transition-all shadow-[0_0_20px_rgba(184,114,9,0.2)]"
              >
                Connect Wallet
              </ConnectWallet>
            </Wallet>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 text-[#b87209] border border-[#b87209]/20 hover:bg-[#b87209]/10 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE NOIR DROPDOWN --- */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-black border-b border-[#b87209]/40 p-8 flex flex-col space-y-8 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col space-y-6">
            <div className="space-y-1">
              <p className="text-[#b87209]/50 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                Navigation
              </p>
              <a
                href="#"
                className="block text-[#b87209] font-black italic uppercase text-3xl hover:translate-x-2 transition-transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Archives
              </a>
            </div>
            <a
              href="#"
              className="block text-white font-black italic uppercase text-3xl hover:text-[#b87209] hover:translate-x-2 transition-transform"
              onClick={() => setIsMenuOpen(false)}
            >
              Cinema
            </a>
          </nav>

          <div className="pt-6 border-t border-white/5">
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest italic">
              Nollywin Design Protocol v1.0
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
