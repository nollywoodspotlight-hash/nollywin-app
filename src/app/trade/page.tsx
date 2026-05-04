"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import { parseEther } from "viem";
import { supabase } from "@/lib/supabase";

// Protocol Contract Mapping
const CONTRACTS = {
  BASE_SEPOLIA: "0xC66A68821F69c5d626797c20189E1B2B085c79e3", //
  ZORA: "0xc3f3dae9f64ce53bbd63b66954daaa5d2e105c90", // Your Zora Mainnet Contract
  ZORA_SEPOLIA: "0x0000000000000000000000000000000000000000", // Placeholder for Zora Sepolia
};

const NOLLYWIN_ABI = [
  {
    inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
    name: "createStrategy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export default function TradePage() {
  const { isConnected, address, chainId } = useAccount();
  const { isAuthenticated, profile } = useProfile();
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [referrerWallet, setReferrerWallet] = useState<string>(
    "0x0000000000000000000000000000000000000000", //
  );

  // Logic to determine target network (7777777 = Zora, 999999999 = Zora Sepolia)
  const getTargetContract = () => {
    if (chainId === 7777777) return CONTRACTS.ZORA;
    if (chainId === 999999999) return CONTRACTS.ZORA_SEPOLIA;
    return CONTRACTS.BASE_SEPOLIA;
  };

  const targetContract = getTargetContract();

  useEffect(() => {
    async function getReferralData() {
      if (address) {
        // Fetching the original recruiter wallet from Supabase
        const { data } = await supabase
          .from("users")
          .select("referrer_original_wallet")
          .eq("user_wallet", address.toLowerCase())
          .single();

        if (data?.referrer_original_wallet) {
          setReferrerWallet(data.referrer_original_wallet);
        }
      }
    }
    getReferralData();
  }, [address]);

  const handleInitialize = () => {
    if (
      !amount ||
      !isConnected ||
      targetContract === "0x0000000000000000000000000000000000000000"
    )
      return;

    writeContract({
      address: targetContract as `0x${string}`,
      abi: NOLLYWIN_ABI,
      functionName: "createStrategy",
      args: [referrerWallet as `0x${string}`],
      value: parseEther(amount),
    });
  };

  const getNetworkName = () => {
    if (chainId === 7777777) return "Zora Network";
    if (chainId === 999999999) return "Zora Sepolia";
    return "Base Sepolia";
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">
            Execute Trade
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold">
            {getNetworkName()} • Micro-DCA
          </p>
        </header>

        {!isConnected ? (
          <div className="p-12 border border-dashed border-zinc-800 rounded-3xl text-center bg-zinc-900/20 uppercase tracking-widest text-[10px] font-bold text-zinc-500">
            Authentication Required
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-purple-500" : "bg-zinc-700"}`}
                />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isAuthenticated ? `@${profile?.username}` : "FC Not Linked"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                01. Set Strategy Principal (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-3xl font-mono focus:border-blue-600 outline-none transition-all mb-6 text-white"
              />
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Reward Recipient
                </span>
                <span className="text-[10px] font-bold text-white uppercase font-mono">
                  {referrerWallet !==
                  "0x0000000000000000000000000000000000000000"
                    ? `${referrerWallet.slice(0, 6)}...`
                    : "Standard Fee"}
                </span>
              </div>
            </div>

            <button
              onClick={handleInitialize}
              disabled={
                !amount ||
                isPending ||
                targetContract === "0x0000000000000000000000000000000000000000"
              }
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 py-6 rounded-2xl font-black italic tracking-tighter text-xl transition-all uppercase"
            >
              {isPending ? "Confirming..." : "Initialize DCA Strategy"}
            </button>

            {isSuccess && (
              <p className="text-green-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">
                Strategy Live
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
