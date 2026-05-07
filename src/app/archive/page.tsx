"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useSignIn } from "@farcaster/auth-kit";

export default function ArchivePage() {
  const router = useRouter();
  const { isConnected: isWagmiConnected } = useAccount();
  const { isConnected: isFarcasterConnected, isSuccess } = useSignIn({});

  // Loading state to hide content until session is verified
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  // MOCK DATA - Replace with your actual trade history fetch
  const archiveData = [
    {
      name: "Blockbuster Alpha",
      status: "LIQUIDATED",
      profit: "+45%",
      date: "2026-04-12",
    },
    {
      name: "Nolly Gamma",
      status: "COMPLETED",
      profit: "+12%",
      date: "2026-04-10",
    },
    {
      name: "Script Test v1",
      status: "CANCELLED",
      profit: "0%",
      date: "2026-04-05",
    },
  ];

  /**
   * SESSION PROTECTION
   * Redirects unauthorized users to the home page after a 1.5s grace period.
   */
  useEffect(() => {
    const authTimer = setTimeout(() => {
      const isUserAuthenticated =
        isWagmiConnected || isFarcasterConnected || isSuccess;

      if (!isUserAuthenticated) {
        router.push("/");
      } else {
        setIsAuthorizing(false);
      }
    }, 1500);

    return () => clearTimeout(authTimer);
  }, [isWagmiConnected, isFarcasterConnected, isSuccess, router]);

  if (isAuthorizing) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#b87209] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-[#b87209] font-black uppercase italic tracking-widest text-[10px] animate-pulse">
          Opening Historical Vaults...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-white/5 pb-8">
        <h2 className="text-[#b87209] text-[10px] font-black uppercase tracking-[0.4em]">
          Protocol History
        </h2>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          The <span className="text-[#b87209]">Archive</span>
        </h1>
        <p className="text-gray-500 text-xs mt-2 max-w-xl">
          Reviewing past production cycles and liquidated scripts from the
          NollyWin engine.
        </p>
      </header>

      {/* VAULT TABLE */}
      <div className="bg-black/40 border border-white/10 overflow-hidden rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">Production Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Final PnL</th>
              <th className="px-6 py-4">Settlement Date</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-white divide-y divide-white/5">
            {archiveData.map((trade, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono">{trade.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded-none ${
                      trade.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-500"
                        : trade.status === "LIQUIDATED"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {trade.status}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 font-black ${trade.profit.startsWith("+") ? "text-[#b87209]" : "text-white"}`}
                >
                  {trade.profit}
                </td>
                <td className="px-6 py-4 text-gray-500">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
