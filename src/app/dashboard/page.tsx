"use client";

import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";

export default function Dashboard() {
  const { address } = useAccount();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">NollyWin Dashboard</h1>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-md">
        <p className="text-zinc-400 mb-2">Authenticated as:</p>
        <p className="font-mono text-blue-400 break-all">
          {profile?.username || address || "Not detected"}
        </p>
      </div>
      <p className="mt-8 text-zinc-500 text-sm">
        Protocol setup coming soon...
      </p>
    </div>
  );
}
