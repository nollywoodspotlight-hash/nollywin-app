"use client";

import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import Link from "next/link";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pt-32 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-black italic tracking-tighter">
          DASHBOARD
        </h1>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            Account Identity
          </p>
          <p className="font-mono text-blue-400 break-all text-sm">
            {profile?.username
              ? `@${profile.username}`
              : address || "Not Connected"}
          </p>
        </div>

        {/* Quick Actions to move the user along */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/trade"
            className="bg-blue-600 hover:bg-blue-500 p-4 rounded-xl text-center font-bold text-xs uppercase tracking-widest transition-all"
          >
            Open Trade
          </Link>
          <div className="bg-zinc-800 p-4 rounded-xl text-center font-bold text-[10px] text-zinc-500 uppercase tracking-widest flex items-center justify-center">
            Referrals: 1% Active
          </div>
        </div>
      </div>
    </div>
  );
}
