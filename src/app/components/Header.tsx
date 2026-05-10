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
    <header className="fixed top-0 left-0 w-full z-[999] bg-black border-b border-[#b87209]/40 h-20">
      <div className="w-full h-full px-4 flex items-center justify-between gap-2">
        {/* 1. LOGO SECTION - Shrink to fit */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => router.push("/")}
        >
          <div className="w-7 h-7 bg-[#b87209] flex items-center justify-center font-black italic text-black mr-1.5 text-sm">
            B
          </div>
          <span className="font-black italic text-base text-white uppercase tracking-tighter">
            THE <span className="text-[#b87209]">STUDIO</span>
          </span>
        </div>

        {/* 2. ACTIONS SECTION - Button and Menu */}
        <div className="flex items-center space-x-2">
          {/* MOBILE CONNECT BUTTON */}
          <div className="md:hidden flex items-center shrink-0">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                /* Reduced padding to ensure it fits next to the menu */
                className="!flex bg-[#b87209] text-black font-black italic text-[9px] uppercase py-2 px-3 rounded-none min-w-[80px] justify-center"
              >
                Connect
              </ConnectWallet>
            </Wallet>
          </div>

          {/* HAMBURGER MENU - Now with explicit width/color */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-[#b87209] border border-[#b87209]/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* DESKTOP VIEW BUTTON */}
        <div className="hidden md:block">
          <Wallet>
            <ConnectWallet
              onConnect={handleConnect}
              className="bg-[#b87209] text-black font-black italic text-[11px] uppercase py-3 px-6 rounded-none hover:bg-white transition-all"
            >
              Connect Wallet
            </ConnectWallet>
          </Wallet>
        </div>
      </div>

      {/* MOBILE DROPDOWN OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-black border-b border-[#b87209]/40 p-8 flex flex-col space-y-6 z-[1000] animate-in fade-in slide-in-from-top-2">
          <a
            href="#"
            className="text-white font-black italic uppercase text-2xl border-l-2 border-[#b87209] pl-4"
          >
            Archives
          </a>
          <a
            href="#"
            className="text-white font-black italic uppercase text-2xl border-l-2 border-[#b87209] pl-4"
          >
            Cinema
          </a>
        </div>
      )}
    </header>
  );
}
