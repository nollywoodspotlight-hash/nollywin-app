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
        {/* When NOT connected: Shows a white "Connect Wallet" button.
          When CONNECTED: Automatically switches to show Avatar + ENS Name/Address.
        */}
        <ConnectWallet
          className={`w-full font-black py-4 px-8 uppercase transition-all rounded-none border-none shadow-xl ${
            isConnected
              ? "bg-[#b87209] text-black"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          <Avatar className="h-4 w-4 mr-2" />
          <Name />
        </ConnectWallet>

        <WalletDropdown className="bg-black border border-[#b87209]/30 rounded-none mt-2">
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className="text-gray-500 font-mono text-[10px]" />
          </Identity>

          {/* Direct link to your production dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-[#b87209] hover:bg-[#b87209]/10 transition-colors"
          >
            Go to Control Room
          </button>

          <WalletDropdownDisconnect className="bg-transparent hover:bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-none" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
