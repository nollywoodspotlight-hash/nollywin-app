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
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Archive", path: "/archive" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-[#b87209]/20 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* NOLLYWIN LOGO: NW Nollywin by Nollywood spotlight */}
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

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="text-[11px] font-black italic uppercase tracking-widest text-white hover:text-[#b87209] transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* ACTION CONTAINER */}
        <div className="flex items-center space-x-3">
          {/* MOBILE CONNECT BUTTON */}
          <div className="flex md:hidden items-center">
            <Wallet>
              <ConnectWallet
                onConnect={handleConnect}
                className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none"
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
                className="bg-[#b87209] text-black font-black italic text-[11px] uppercase py-3 px-6 rounded-none hover:bg-white transition-all"
              >
                Connect Wallet
              </ConnectWallet>
            </Wallet>
          </div>

          {/* HAMBURGER MENU */}
          <button
            className="md:hidden text-[#b87209] p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-[#b87209]/20 p-8 flex flex-col space-y-6 z-[101] animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                router.push(link.path);
                setIsMenuOpen(false);
              }}
              className="text-left text-2xl font-black italic uppercase text-white hover:text-[#b87209] border-l-2 border-[#b87209]/40 pl-4"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
