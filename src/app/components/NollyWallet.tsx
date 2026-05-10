"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Name, Avatar, Identity } from "@coinbase/onchainkit/identity";

export default function NollyWallet({ className }: { className?: string }) {
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <div className={className}>
      <Wallet>
        {/* NOLLYWIN BRANDING: 
            Changed to always use Gold (#b87209) or Gold-bordered Black.
            Added italic and font-black to match the Nollywin typography.
        */}
        <ConnectWallet
          className={`w-full font-black italic py-4 px-8 uppercase transition-all rounded-none border shadow-[0_0_20px_rgba(184,114,9,0.2)] ${
            isConnected
              ? "bg-[#b87209] text-black border-[#b87209]"
              : "bg-black text-[#b87209] border-[#b87209] hover:bg-[#b87209] hover:text-black"
          }`}
        >
          <Avatar className="h-4 w-4 mr-2" />
          <Name className={isConnected ? "text-black" : "text-[#b87209]"} />
        </ConnectWallet>

        {/* --- CINEMATIC DROPDOWN --- */}
        <WalletDropdown className="bg-black border-2 border-[#b87209]/40 rounded-none mt-2 shadow-2xl backdrop-blur-xl">
          <Identity className="px-4 pt-4 pb-2" hasCopyAddressOnClick>
            <Avatar className="border border-[#b87209]/30" />
            <Name className="text-white font-black italic uppercase" />
            <Address className="text-gray-500 font-mono text-[10px]" />
          </Identity>

          {/* Direct link to your production dashboard */}
          <div className="px-2 pb-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-center px-4 py-3 text-[11px] font-black italic uppercase bg-[#b87209]/10 text-[#b87209] hover:bg-[#b87209] hover:text-black transition-all border border-[#b87209]/20"
            >
              Go to Control Room
            </button>
          </div>

          <WalletDropdownDisconnect className="w-full bg-transparent hover:bg-red-950/30 text-red-600 text-[9px] font-black italic uppercase rounded-none py-3" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
