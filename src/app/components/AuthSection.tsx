"use client";

import { useEffect, useState } from "react";
import { SignInButton } from "@farcaster/auth-kit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useReferralSignature } from "@/hooks/useReferralSignature";

export default function AuthSection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { createSignature } = useReferralSignature();

  const [rpcStatus, setRpcStatus] = useState("checking");

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

        setRpcStatus(response.status === 200 ? "connected" : "error");
      } catch (err) {
        console.error(err);
        setRpcStatus("error");
      }
    };

    checkRPC();
  }, []);

  const handleFarcasterSuccess = async (res: any) => {
    console.log("Farcaster linked:", res);

    try {
      const signature = await createSignature(12345);
      console.log("Referral signature:", signature);
    } catch (err) {
      console.error("Signature error:", err);
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

      {/* WALLET CONNECTION (WAGMI) */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-1">
          01. Connect Wallet
        </p>

        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-4 font-bold"
          >
            Disconnect {address?.slice(0, 6)}...
          </button>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 font-bold"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* FARCASTER AUTH */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest ml-1">
          02. Link Farcaster Profile
        </p>

        <SignInButton onSuccess={handleFarcasterSuccess} />
      </div>

      <p className="text-[9px] text-zinc-500 text-center leading-relaxed px-4">
        By linking both, you activate the{" "}
        <span className="text-zinc-300">1% Referral Reward</span> and enable
        gasless trading via the{" "}
        <span className="text-zinc-300">Principal Shield</span>.
      </p>

      <p className="text-[10px] text-zinc-600 text-center">
        RPC Status: {rpcStatus}
      </p>
    </div>
  );
}
