"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full z-[100] relative">
      {/* --- BLUE MARQUEE TICKER --- */}
      <div className="bg-[#1d02cb] py-1.5 overflow-hidden whitespace-nowrap border-b border-white/10">
        <div className="inline-block animate-marquee hover:pause cursor-default">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-widest text-white mx-8"
            >
              • LIVE PRODUCTION: BASE MAINNET ACTIVE • 1% FOUNDER ROYALTIES
              ENABLED • NOLLYWIN DEPLOYMENT SUCCESSFUL •
            </span>
          ))}
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="text-xl font-black italic tracking-tighter text-white group-hover:text-[#b87209] transition-colors">
            NOLLY
            <span className="text-[#b87209] group-hover:text-white">WIN</span>
          </h1>
        </Link>

        <div className="flex gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "Dashboard", path: "/dashboard" },
            { name: "Archive", path: "/archive" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#b87209] ${
                pathname === link.path
                  ? "text-[#b87209] border-b-2 border-[#b87209] pb-1"
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
