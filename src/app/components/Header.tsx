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
    <header className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
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

        <div className="hidden md:flex items-center space-x-8">
          <Wallet>
            <ConnectWallet
              onConnect={handleConnect}
              className="bg-white text-black font-black text-[11px] uppercase py-3 px-6 rounded-none hover:bg-gray-200 transition-all"
            >
              Connect Wallet
            </ConnectWallet>
          </Wallet>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-[#b87209]/20 p-6 flex flex-col space-y-6">
          <Wallet>
            <ConnectWallet
              onConnect={handleConnect}
              className="w-full bg-[#b87209] text-black font-black text-xs uppercase py-4 rounded-none"
            >
              Connect Wallet
            </ConnectWallet>
          </Wallet>
        </div>
      )}
    </header>
  );
}
