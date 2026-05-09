"use client";

import React, { useEffect, useState } from "react";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { WalletButton } from "@/app/components/WalletButton";

import "@farcaster/auth-kit/styles.css";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();

  const { isSuccess, isConnected, data } = useSignIn({
    onSuccess: (res) => {
      console.log("Farcaster login success:", res);
      triggerRedirect();
    },
  });

  const { isConnected: walletConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerRedirect = () => {
    if (isRedirecting) return;

    setIsRedirecting(true);

    console.log("Redirecting to dashboard...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  useEffect(() => {
    if (!mounted || isRedirecting) return;

    if (isSuccess || isConnected || data?.username || walletConnected) {
      triggerRedirect();
    }
  }, [isSuccess, isConnected, data, walletConnected, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="flex flex-col items-center pt-10 md:pt-16 pb-32 min-h-screen bg-black text-white">
      {/* HERO */}
      <div className="text-center space-y-6 max-w-4xl px-4">
        <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-tight">
          LIGHTS. CAMERA. <span className="text-[#b87209]">PROFITS.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Onchain automation on Base with Farcaster identity.
        </p>
      </div>

      {/* AUTH */}
      <div className="mt-12 w-full max-w-sm bg-black/40 border border-[#b87209]/20 p-8">
        {isRedirecting ? (
          <div className="text-center py-10">
            <p className="text-[#b87209] font-bold">Opening Dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* WALLET (wagmi component version) */}
            <WalletButton />

            {/* FARCASTER */}
            <SignInButton />
          </div>
        )}
      </div>
    </div>
  );
}
