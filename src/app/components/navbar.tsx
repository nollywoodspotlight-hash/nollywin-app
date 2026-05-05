"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  // Helper function to highlight the active page
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <span className="text-white font-black text-2xl italic">N</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Nolly<span className="text-red-600">Win</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">
              Box Office DeFi
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/") ? "text-red-600" : "text-white hover:text-red-500"
            }`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/dashboard")
                ? "text-red-600"
                : "text-white hover:text-red-500"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/archive"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/archive")
                ? "text-red-600"
                : "text-white hover:text-red-500"
            }`}
          >
            Archive
          </Link>

          <Link
            href="/about"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive("/about")
                ? "text-red-600"
                : "text-white hover:text-red-500"
            }`}
          >
            About
          </Link>

          {/* Action Area */}
          <div className="pl-6 border-l border-white/10">
            <button className="relative group overflow-hidden bg-white text-black px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:pr-10">
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute top-0 -right-full h-full w-full bg-red-600 transition-all group-hover:right-0 z-0" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Trigger (Visual Only) */}
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
