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

  // Prevent layout shift during hydration
  if (!mounted) return <div className="h-[100px] bg-black" />;

  return (
    <nav className="w-full z-[100] relative bg-black border-b border-white/5">
      {/* --- THE COLORFUL MARQUEE BAR --- */}
      {/* 'group' allows us to pause the animation when the user hovers to read/click a link */}
      <div className="bg-[#1d02cb] py-2 overflow-hidden whitespace-nowrap border-b border-[#b87209]/30 group cursor-default">
        <div className="inline-block animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.3em] mx-10"
            >
              {/* Future clickable strategy/RSS links go inside these <a> tags */}
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
        {/* LOGO: Points back to the Homepage ("/") */}
        <Link href="/" className="group cursor-pointer">
          <h1 className="text-2xl font-black italic tracking-tighter text-white transition-transform group-hover:scale-105">
            NOLLY<span className="text-[#b87209]">WIN</span>
          </h1>
        </Link>

        {/* NAVIGATION LINKS & WALLET SECTION */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Desktop Navigation */}
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

          {/* SHARED WALLET COMPONENT: 
              Using scale-90 to make it slightly sleeker for the header 
          */}
          <NollyWallet className="transform scale-90 origin-right" />
        </div>
      </div>
    </nav>
  );
}
