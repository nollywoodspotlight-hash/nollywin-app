"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

export default function LiveTicker() {
  // These are your placeholders - we can connect real API data here later
  const tickerItems = [
    {
      id: 1,
      label: "LATEST POST",
      content: "Exploring the New Era of Nollywood Cinema",
      url: "https://nollywoodspotlight.org",
      color: "#b87209", // Gold
    },
    {
      id: 2,
      label: "NEW MEMBER",
      content: "Farcaster ID: @nolly_dev just joined the engine",
      url: "https://warpcast.com",
      color: "#ffffff", // White
    },
    {
      id: 3,
      label: "PROFIT ALERT",
      content: "0x7a2... realized +1.45 ETH profit on $NOLLY",
      url: "https://basescan.org",
      color: "#22c55e", // Green for profit
    },
    {
      id: 4,
      label: "SPOTLIGHT",
      content: "Read: The top 10 movies of 2026",
      url: "https://nollywoodspotlight.org",
      color: "#b87209",
    },
  ];

  return (
    <div className="w-full bg-[#1d02cb] py-2 border-b border-[#b87209]/20 z-50">
      <Marquee speed={40} gradient={false} pauseOnHover={true}>
        {tickerItems.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mx-10 group"
          >
            <span
              className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm mr-3 text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </span>
            <span className="text-xs font-bold text-white group-hover:text-[#b87209] transition-colors uppercase tracking-tight">
              {item.content}
            </span>
            <span className="ml-10 text-[#b87209]/30">/ /</span>
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
