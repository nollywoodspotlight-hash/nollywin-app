"use client";

import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import Link from "next/link";

export default function Dashboard() {
  const { address } = useAccount();
  const { profile } = useProfile();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 pt-32 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter">
            DASHBOARD
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
            Protocol Status: Active
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">
            Authenticated Identity
          </p>
          <p className="font-mono text-white break-all text-sm">
            {profile?.username ? `@${profile.username}` : address}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/trade"
            className="group bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl transition-all flex justify-between items-center"
          >
            <span className="font-black italic tracking-tight text-lg">
              OPEN TRADING TERMINAL
            </span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>

          <div className="border border-zinc-800 p-4 rounded-2xl flex justify-between items-center px-6">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Referral Reward
            </span>
            <span className="text-green-500 font-bold text-xs">1% ACTIVE</span>
          </div>
        </div>
      </div>
    </main>
  );
}
