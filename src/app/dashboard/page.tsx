"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push("/");
    }
  }, [isConnected, mounted, router]);

  if (!mounted || !isConnected) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end border-b border-[#b87209]/20 pb-8">
          <div>
            <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
              Executive Producer
            </h2>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">
              Control Room
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold mt-2 font-mono">
              ID: {address}
            </p>
          </div>

          <button
            onClick={() => disconnect()}
            className="text-[9px] font-black text-red-500 border border-red-500/20 px-6 py-2 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
          >
            End Session
          </button>
        </div>

        {/* Content Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-sm">
            <h3 className="text-[#b87209] text-[10px] font-black uppercase mb-4">
              Total Royalties
            </h3>
            <p className="text-3xl font-black italic">0.00 ETH</p>
          </div>
          {/* Add more cards as needed */}
        </div>
      </div>
    </div>
  );
}
