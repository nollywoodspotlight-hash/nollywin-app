"use client";

import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Nolly<span className="text-red-600">Win</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Dashboard
          </Link>

          {/* Placeholder for Wallet - OnchainKit/ConnectButton should be injected here */}
          <div className="pl-4 border-l border-white/10">
            <button className="bg-white text-black px-6 py-2 text-xs font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
