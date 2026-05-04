"use client";

import { useEffect } from "react";
import { SignInButton } from "@farcaster/auth-kit";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useReferralSignature } from "@/hooks/useReferralSignature";

export default function AuthSection() {
  const { createSignature } = useReferralSignature();

  // Debugging: Checks if the browser can resolve the Alchemy DNS on load
  useEffect(() => {
    const checkRPC = async () => {
      try {
        const response = await fetch(
          "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_blockNumber",
              params: [],
              id: 1,
            }),
          },
        );
        console.log(
          "Alchemy RPC Status Check:",
          response.status === 200 ? "Connected ✅" : "Error ❌",
        );
      } catch (err) {
        console.error("Alchemy RPC unreachable. Check DNS/VPN/Allowlist:", err);
      }
    };
    checkRPC();
  }, []);

  const handleFarcasterSuccess = async (res: any) => {
    console.log("Farcaster Linked successfully:", res);

    try {
      // Logic for securing the referral signature for the protocol
      const signature = await createSignature(12345);

      if (signature) {
        console.log("Referral Signature secured:", signature);
        alert(`Linked as @${res.username}. Referral signature generated!`);
      }
    } catch (err) {
      console.error("Signature process interrupted:", err);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-10 bg-zinc-900/80 border border-zinc-800 rounded-[2rem] shadow-2xl backdrop-blur-md">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tighter italic">
          NOLLYWIN
        </h1>
        <p className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          Identity & Rewards
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Wallet Connection (OnchainKit) */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-1">
            01. Connect Base Wallet
          </p>
          <Wallet>
            <ConnectWallet className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-7 shadow-lg shadow-blue-900/20 transition-all border-none font-bold">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Step 2: Farcaster Link (Auth-Kit) */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest ml-1">
            02. Link Farcaster Profile
          </p>
          <div className="w-full">
            <SignInButton onSuccess={handleFarcasterSuccess} />
          </div>
        </div>
      </div>

      <p className="text-[9px] text-zinc-500 text-center leading-relaxed px-4">
        By linking both, you activate the{" "}
        <span className="text-zinc-300">1% Referral Reward</span> and enable
        gasless trading via the{" "}
        <span className="text-zinc-300">Principal Shield</span>.
      </p>
    </div>
  );
}
