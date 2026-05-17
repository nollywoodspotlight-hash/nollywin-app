"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { Loader2, Share2, ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

function ReferralProcessor({
  onReferrerCaptured,
}: {
  onReferrerCaptured: (addr: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const referrerAddress = searchParams.get("ref");

    if (
      referrerAddress &&
      referrerAddress.startsWith("0x") &&
      referrerAddress.length === 42
    ) {
      console.log(
        `🎯 REFERRAL RECOGNIZED: Tracking captain address -> ${referrerAddress}`,
      );
      localStorage.setItem("nollywin_referrer", referrerAddress.trim());
      onReferrerCaptured(referrerAddress.trim());
    }

    // Give users slightly more time to view the custom share action panel before forwarding
    const timer = setTimeout(() => {
      router.push("/");
    }, 4000);

    return () => clearTimeout(timer);
  }, [searchParams, router, onReferrerCaptured]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="animate-spin text-[#b87209]" size={44} />
      <h2 className="text-xl font-black uppercase tracking-widest italic text-white leading-none">
        Validating <span className="text-[#b87209]">Crew Pass</span>
      </h2>
      <p className="text-gray-500 uppercase tracking-[0.4em] text-[9px] font-bold italic mt-1">
        Synchronizing Referral Ledger Nodes...
      </p>
    </div>
  );
}

export default function JoinPage() {
  const [referrer, setReferrer] = useState<string | null>(null);

  // Viral CTA Copy for marketing engagement
  const handleShareOnX = () => {
    const shareText = `🎬 Just locked my target credentials into @NollyWin—the high-frequency parallel sniper engine running on Base Mainnet. Zero delay execution blocks. Join the deployment crew here:`;
    const targetLink = referrer
      ? `https://nollywin.xyz/join?ref=${referrer}`
      : `https://nollywin.xyz`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText,
      )}&url=${encodeURIComponent(targetLink)}`,
      "_blank",
    );
  };

  return (
    <div
      className={`${inter.className} min-h-screen bg-black flex items-center justify-center antialiased select-none`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(184,114,9,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative z-50 max-w-md w-full mx-auto px-6 py-12 bg-[#080808]/80 border border-[#b87209]/30 backdrop-blur-md rounded-sm shadow-2xl space-y-8">
        {/* Dynamic Parameter Interceptor */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="animate-spin text-[#b87209]" size={44} />
              <p className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold italic">
                Loading Secure Node...
              </p>
            </div>
          }
        >
          <ReferralProcessor onReferrerCaptured={setReferrer} />
        </Suspense>

        {/* Tactical Ambient Line Splitter */}
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-white/5" />
          <ShieldCheck size={14} className="text-gray-700" />
          <div className="h-[1px] flex-grow bg-white/5" />
        </div>

        {/* 🌟 UPGRADED MULTI-USER SHARE CALL-TO-ACTION CONTAINER */}
        <div className="space-y-4 text-center">
          <div className="text-left bg-black/40 p-4 border border-white/5 rounded-sm">
            <p className="text-[#b87209] uppercase text-[9px] font-black tracking-widest mb-1 italic">
              Encrypted Inviter Node
            </p>
            <p className="text-gray-400 text-xs font-mono truncate">
              {referrer ? referrer : "Direct Platform Authorization"}
            </p>
          </div>

          <button
            onClick={handleShareOnX}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#b87209] text-[#b87209] hover:bg-[#b87209] hover:text-black px-6 py-4 font-black uppercase italic text-xs tracking-wider active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(184,114,9,0.1)] hover:shadow-[0_0_30px_rgba(184,114,9,0.25)]"
          >
            <Share2 size={14} />
            Broadcast Protocol to X
          </button>

          <p className="text-gray-600 text-[8px] uppercase tracking-normal font-bold italic">
            Spread the pipeline • Earn Founders Cut allocations on active
            tracking loops
          </p>
        </div>
      </div>
    </div>
  );
}
