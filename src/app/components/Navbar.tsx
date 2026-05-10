"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Name, Avatar, Identity } from "@coinbase/onchainkit/identity";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[92px] bg-black" />;

  return (
    <nav className="w-full z-[100] relative bg-black border-b border-white/5">
      {/* --- THE MARQUEE BAR --- */}
      {/* 'group' is added here so we can pause the animation on hover */}
      <div className="bg-[#1d02cb] py-2 overflow-hidden whitespace-nowrap border-b border-[#b87209]/30 group cursor-pointer">
        <div className="inline-block animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.3em] mx-10"
            >
              {/* Wrapped in anchor tags for future links (Nollywood Spotlight / Strategies) */}
              <a
                href="#"
                className="text-white hover:text-yellow-400 transition-colors"
              >
                🚀 LIVE PRODUCTION: BASE MAINNET ACTIVE
              </a>
              <span className="text-[#b87209] mx-6">|</span>

              <a
                href="#"
                className="text-yellow-400 hover:text-white transition-colors"
              >
                🎬 1% FOUNDER ROYALTIES ENABLED
              </a>
              <span className="text-[#b87209] mx-6">|</span>

              <a
                href="#"
                className="text-cyan-400 hover:text-white transition-colors"
              >
                💎 NOLLYWIN DEPLOYMENT SUCCESSFUL
              </a>
              <span className="text-[#b87209] mx-6">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* --- NAVIGATION & WALLET BAR --- */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="group cursor-pointer">
          <h1 className="text-2xl font-black italic tracking-tighter text-white transition-transform group-hover:scale-105">
            NOLLY<span className="text-[#b87209]">WIN</span>
          </h1>
        </Link>

        {/* NAVIGATION LINKS & WALLET */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 mr-4">
            {[
              { name: "Home", path: "/" },
              { name: "Dashboard", path: "/dashboard" },
              { name: "Archive", path: "/archive" },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#b87209] ${
                  pathname === link.path
                    ? "text-[#b87209] border-b-2 border-[#b87209] pb-1"
                    : "text-gray-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* COINBASE WALLET COMPONENT */}
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet className="bg-[#b87209] text-black font-black text-[10px] uppercase py-2 px-4 rounded-none hover:bg-white transition-colors border-none shadow-lg">
                <Avatar className="h-4 w-4 mr-2" />
                <Name />
              </ConnectWallet>
              <WalletDropdown className="bg-black border border-[#b87209]/30 rounded-none mt-2">
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address className="text-gray-500 font-mono text-[10px]" />
                </Identity>
                <WalletDropdownDisconnect className="bg-transparent hover:bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-none" />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </div>
    </nav>
  );
}
