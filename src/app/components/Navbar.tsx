"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NollyWallet from "./NollyWallet";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[92px] bg-black" />;

  return (
    <nav className="w-full z-[100] relative bg-black border-b border-white/5 overflow-x-hidden">
      {/* THE ORIGINAL BLUE MARQUEE */}
      <div className="bg-[#1d02cb] py-2 overflow-hidden whitespace-nowrap border-b border-[#b87209]/30">
        <div className="inline-block animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.3em] mx-10"
            >
              <span className="text-white">
                🚀 LIVE PRODUCTION: BASE MAINNET ACTIVE
              </span>
              <span className="text-[#b87209] mx-6">|</span>
              <span className="text-yellow-400">
                🎬 1% FOUNDER ROYALTIES ENABLED
              </span>
              <span className="text-[#b87209] mx-6">|</span>
              <span className="text-cyan-400">
                💎 NOLLYWIN DEPLOYMENT SUCCESSFUL
              </span>
              <span className="text-[#b87209] mx-6">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* NAV CONTENT: px-4 and gap-2 ensures things stay on one line on mobile */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-2">
        <Link href="/" className="shrink-0 group cursor-pointer">
          <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-white transition-transform group-hover:scale-105">
            NOLLY<span className="text-[#b87209]">WIN</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2 md:gap-8">
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

          {/* WALLET BUTTON: Scaled for mobile fit */}
          <div className="transform scale-90 md:scale-100 origin-right shrink-0">
            <NollyWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}
