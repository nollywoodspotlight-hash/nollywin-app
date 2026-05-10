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
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Archive", path: "/archive" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-black/95 backdrop-blur-sm border-b border-[#b87209]/30 h-20 transform-gpu">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* --- BRAND LOGO: NW Nollywin by Nollywood spotlight --- */}
        <div
          className="flex flex-col cursor-pointer shrink-0 leading-none"
          onClick={() => router.push("/")}
        >
          <div className="flex items-baseline space-x-1">
            <span className="font-black italic text-2xl text-white uppercase tracking-tighter">
              NW
            </span>
            <span className="font-black italic text-2xl text-[#b87209] uppercase tracking-tighter">
              Nollywin
            </span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50 italic">
            by Nollywood spotlight
          </span>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="text-[11px] font-black italic uppercase tracking-widest text-white/70 hover:text-[#b87209] transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* --- ACTION SECTION --- */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* MOBILE CONNECT BUTTON (Visible only on mobile) */}
          <div className="md:hidden flex items-center shrink-0">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none transition-all active:scale-95"
              >
                Connect
              </ConnectWallet>
            </Wallet>
          </div>

          {/* DESKTOP CONNECT BUTTON */}
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
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE NOIR DROPDOWN --- */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-black border-b border-[#b87209]/40 p-8 flex flex-col space-y-6 z-[10000] animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  router.push(link.path);
                  setIsMenuOpen(false);
                }}
                className="text-left text-white font-black italic uppercase text-3xl hover:text-[#b87209] transition-all border-l-2 border-[#b87209]/20 pl-4 hover:border-[#b87209]"
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <p className="text-[#b87209]/50 text-[9px] font-black uppercase tracking-widest italic">
              Nollywin Design Protocol v1.0
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
