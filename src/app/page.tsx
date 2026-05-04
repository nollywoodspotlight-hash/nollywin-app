"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import AuthSection from "@/components/AuthSection";

export default function Home() {
  const { isConnected } = useAccount();
  const { isAuthenticated } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (isConnected || isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isConnected, isAuthenticated, router]);

  // If already logged in, show a simple loader while redirecting
  if (isConnected || isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-zinc-500 animate-pulse uppercase tracking-widest text-xs">
          Entering NollyWin...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm px-6">
        <AuthSection />
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-zinc-800" />
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
            Built on Base
          </p>
        </div>
      </div>
    </main>
  );
}
