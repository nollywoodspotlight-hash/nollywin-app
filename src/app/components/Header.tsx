"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleConnect = useCallback(() => {
    setIsMenuOpen(false);
    router.push("/dashboard");
  }, [router]);

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-black/90 backdrop-blur-md border-b border-[#b87209]/30 h-20 transform-gpu">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* --- LOGO SECTION --- */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 bg-[#b87209] flex items-center justify-center font-black italic text-black mr-2">
            B
          </div>
          <span className="font-black italic text-xl text-white uppercase tracking-tighter">
            THE <span className="text-[#b87209]">STUDIO</span>
          </span>
        </div>

        {/* --- ACTION SECTION --- */}
        <div className="flex items-center space-x-3">
          {/* MOBILE PAGE BUTTON: Forced visibility on small screens */}
          <div className="flex md:hidden items-center">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none hover:bg-white transition-all transform-gpu"
              >
                Connect
              </ConnectWallet>
            </Wallet>
          </div>

          {/* DESKTOP PAGE BUTTON */}
          <div className="hidden md:flex items-center">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="bg-[#b87209] text-black font-black italic text-[11px] uppercase py-3 px-6 rounded-none hover:bg-white transition-all"
              >
                Connect Wallet
              </ConnectWallet>
            </Wallet>
          </div>

          {/* NOLLYWIN HAMBURGER TOGGLE */}
          <button
            className="text-[#b87209] p-2 hover:bg-[#b87209]/10 transition-colors border border-[#b87209]/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE NOIR OVERLAY --- */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-black border-b border-[#b87209]/40 p-8 flex flex-col space-y-6 z-[10000] animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-6">
            <a
              href="#"
              className="text-[#b87209] font-black italic uppercase text-2xl border-l-4 border-[#b87209] pl-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Archives
            </a>
            <a
              href="#"
              className="text-white font-black italic uppercase text-2xl border-l-4 border-white/10 pl-4 hover:border-[#b87209] hover:text-[#b87209] transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Cinema
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
