"use client";

import React from "react";
import Link from "next/navigation";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-20">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6">
        <h2 className="text-[#b87209] text-xs font-black uppercase tracking-[0.5em] animate-pulse">
          The Script
        </h2>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
          Where Nollywood Drama <br />
          <span className="text-[#b87209]">meets DeFi Logic.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
          NollyWin is the world's first cinematic trading protocol. We believe
          decentralized finance shouldn't just be about numbers—it should have
          soul, style, and high-stakes energy.
        </p>
      </section>

      {/* 2. CORE PROTOCOL LOGIC */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-black uppercase italic text-white tracking-tight">
            How the <span className="text-[#b87209]">Engine</span> Works
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Built on the{" "}
            <span className="text-white font-bold">Base network</span>, NollyWin
            is a self-custodial Micro-DCA automation protocol designed for
            maximum transparency and user protection.
          </p>
          <ul className="space-y-4">
            {[
              {
                title: "Self-Custodial",
                desc: "The protocol executes strategies using your supplied ETH; you always retain ownership.",
              },
              {
                title: "Profit-Only Fees",
                desc: "A 3% fee applies ONLY to realized profits. If you don't win, we don't win.",
              },
              {
                title: "Principal Protection",
                desc: "Zero fees on principal or losses. Your initial capital is never reduced by the protocol.",
              },
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="text-[#b87209] font-black italic">
                  /0{i + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#1d02cb]/10 border border-[#b87209]/20 p-8 rounded-sm backdrop-blur-md">
          <div className="text-[10px] font-black text-[#b87209] uppercase tracking-widest mb-4 italic">
            Technical Note v2.0
          </div>
          <p className="text-white font-mono text-[11px] leading-relaxed">
            profit = final_sell_eth - total_cost_basis_eth <br />
            <br />
            if (profit {">"} 0) {"{"} <br />
            &nbsp;&nbsp;fee = profit * 0.03; <br />
            {"}"} else {"{"} <br />
            &nbsp;&nbsp;fee = 0; <br />
            {"}"}
          </p>
        </div>
      </section>

      {/* 3. FOUNDER'S CUT */}
      <section className="bg-[#b87209]/5 border-y border-[#b87209]/20 py-16 px-8 relative overflow-hidden">
        <div className="max-w-2xl">
          <h3 className="text-3xl font-black uppercase italic text-[#b87209] mb-6">
            The Founder’s Cut
          </h3>
          <p className="text-white text-sm leading-relaxed mb-8 font-medium">
            Every great production needs a great crew. Earn a{" "}
            <span className="underline decoration-white font-black italic">
              1% lifetime incentive
            </span>{" "}
            on the profits of the actors you bring into the engine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px]">
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-widest">
                Real-Time Eligibility
              </h4>
              <p className="text-gray-500">
                To earn the 1% share, you must have at least one ACTIVE strategy
                running at the time of settlement.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-widest">
                Automatic Fallback
              </h4>
              <p className="text-gray-500">
                If a referrer is inactive, the share is redirected to the
                protocol treasury to keep the lights on.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <span className="text-[120px] font-black italic text-[#b87209] tracking-tighter">
            1%
          </span>
        </div>
      </section>

      {/* 4. CONTACT & CALL TO ACTION */}
      <section className="text-center space-y-10 pt-10">
        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase tracking-[0.3em] text-xs underline decoration-[#b87209] underline-offset-8">
            Contact & Socials
          </h3>
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <a
              href="https://www.nollywoodspotlight.org"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              Blog
            </a>
            <a
              href="https://farcaster.xyz/nollyspot"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              Farcaster
            </a>
            <a
              href="https://x.com/nollyspotlight"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              X / Twitter
            </a>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-[#1d02cb] hover:bg-[#b87209] text-white px-12 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-2xl"
        >
          Join the Production
        </button>
      </section>
    </div>
  );
}
