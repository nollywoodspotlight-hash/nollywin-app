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
    <header className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-[#b87209]/20">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center space-x-2 cursor-pointer shrink-0"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 bg-[#b87209] flex items-center justify-center font-black italic text-black">
            B
          </div>
          <span className="font-black italic text-xl tracking-tighter text-white uppercase">
            The <span className="text-[#b87209]">Studio</span>
          </span>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {/* MOBILE WALLET BUTTON - Forced Visibility */}
          <div className="md:hidden flex items-center min-w-[100px]">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                /* Added !important via square brackets to override OnchainKit defaults */
                className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-3 rounded-none hover:bg-white transition-all whitespace-nowrap"
              >
                Connect
              </ConnectWallet>
            </Wallet>
          </div>

          {/* DESKTOP WALLET BUTTON */}
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

          {/* HAMBURGER MENU TOGGLE */}
          <button
            className="p-2 text-[#b87209] hover:bg-[#b87209]/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="md:hidden">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
            {/* Keeping Menu visible on desktop only if you have links to show */}
            <div className="hidden md:block">
              <Menu size={24} />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-[#b87209]/20 p-6 flex flex-col space-y-6 animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-white font-black italic uppercase text-lg hover:text-[#b87209]"
            >
              Archives
            </a>
            <a
              href="#"
              className="text-white font-black italic uppercase text-lg hover:text-[#b87209]"
            >
              Cinema
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
