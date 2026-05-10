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
          className="flex items-center space-x-2 cursor-pointer"
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
        <div className="flex items-center space-x-4">
          {/* MOBILE PAGE BUTTON: 
              Visible on mobile (flex), hidden on medium screens (md:hidden)
          */}
          <div className="flex md:hidden">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none hover:bg-white transition-all"
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

          {/* HAMBURGER MENU TOGGLE */}
          <button
            className="md:hidden text-[#b87209]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-[#b87209]/20 p-6 flex flex-col space-y-6 animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-white font-black italic uppercase text-lg"
            >
              Archives
            </a>
            <a
              href="#"
              className="text-white font-black italic uppercase text-lg"
            >
              Cinema
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
