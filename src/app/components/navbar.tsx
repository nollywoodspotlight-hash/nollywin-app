"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi"; // To detect connection status
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity } from "@coinbase/onchainkit/identity";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isConnected } = useAccount();

  // AUTOMATIC REDIRECT LOGIC
  // If the user connects and is currently on the home page, send them to dashboard
  useEffect(() => {
    if (isConnected && pathname === "/") {
      router.push("/dashboard");
    }
  }, [isConnected, pathname, router]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#1d02cb]/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#b87209] rounded-sm flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(184,114,9,0.4)]">
            <span className="text-white font-black text-2xl italic">NW</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
              Nolly<span className="text-[#b87209]">Win</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#ffffff]/60 font-bold">
              By Nollywood Spotlight
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/")
                ? "text-[#b87209]"
                : "text-white hover:text-[#b87209]"
            }`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/dashboard")
                ? "text-[#b87209]"
                : "text-white hover:text-[#b87209]"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/archive"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/archive")
                ? "text-[#b87209]"
                : "text-white hover:text-[#b87209]"
            }`}
          >
            Archive
          </Link>

          <Link
            href="/about"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/about")
                ? "text-[#b87209]"
                : "text-white hover:text-[#b87209]"
            }`}
          >
            About
          </Link>

          {/* Action Area */}
          <div className="pl-6 border-l border-white/10">
            <Wallet>
              <ConnectWallet className="relative group overflow-hidden bg-[#1d02cb] text-white px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border border-[#b87209]/30 hover:border-[#b87209] rounded-none">
                <span className="relative z-10">Connect Wallet</span>
                <div className="absolute top-0 -right-full h-full w-full bg-[#b87209] transition-all group-hover:right-0 z-0" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button className="p-2 text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
