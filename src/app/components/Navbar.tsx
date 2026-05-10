"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full z-[100] relative bg-black">
      {/* --- COLORFUL SCROLLING MARQUEE --- */}
      <div className="bg-[#1d02cb] py-2 overflow-hidden whitespace-nowrap border-b border-[#b87209]/30">
        <div className="inline-block animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.3em] mx-10"
            >
              <span className="text-white">
                🚀 LIVE PRODUCTION: BASE MAINNET ACTIVE
              </span>
              <span className="text-[#b87209] mx-10">|</span>
              <span className="text-yellow-400">
                🎬 1% FOUNDER ROYALTIES ENABLED
              </span>
              <span className="text-[#b87209] mx-10">|</span>
              <span className="text-cyan-400">
                💎 NOLLYWIN DEPLOYMENT SUCCESSFUL
              </span>
              <span className="text-[#b87209] mx-10">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* --- NAVIGATION BAR --- */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            NOLLY<span className="text-[#b87209]">WIN</span>
          </h1>
        </Link>

        {/* Links appear for everyone */}
        <div className="flex items-center gap-10">
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
                  ? "text-[#b87209] border-b border-[#b87209]"
                  : "text-gray-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
