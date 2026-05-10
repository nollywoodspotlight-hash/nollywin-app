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

  // Protect the route: If not connected, kick back to home
  useEffect(() => {
    if (mounted && !isConnected) {
      router.push("/");
    }
  }, [isConnected, mounted, router]);

  const handleLogout = () => {
    disconnect();
    router.push("/");
  };

  if (!mounted || !isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#b87209]">
        <div className="w-12 h-12 border-2 border-[#b87209] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-black uppercase italic tracking-widest text-[10px]">
          Verifying Executive Access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-[#b87209] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <div>
            <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
              NollyWin Studio
            </h2>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Current Production
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold mt-2">
              Producer:{" "}
              <span className="text-white font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[9px] font-black text-red-500 border border-red-500/20 px-4 py-2 hover:bg-red-500 hover:text-white transition-all uppercase"
          >
            Terminate Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-6">
              The Script
            </h2>
            <p className="text-gray-500 text-xs italic">
              Awaiting DCA strategy deployment...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
