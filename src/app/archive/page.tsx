"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function ArchivePage() {
  const { isConnected } = useAccount();
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
    <div className="min-h-screen bg-black text-white p-12">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#b87209]">
        Production Archive
      </h1>
      <p className="text-gray-500 mt-4 uppercase text-[10px] font-bold tracking-widest text-center py-20 border border-white/5">
        No past productions found. Start your first script on the dashboard.
      </p>
    </div>
  );
}
