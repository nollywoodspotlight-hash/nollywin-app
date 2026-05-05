"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import { parseEther } from "viem";
import { base } from "wagmi/chains"; // Focused on Base Mainnet
import { supabase } from "@/lib/supabase";

// UPDATE: Replace with your actual Base Mainnet contract address
const NOLLYWIN_BASE_CONTRACT = "0x0000000000000000000000000000000000000000";

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
  const { switchChain } = useSwitchChain();
  const { isAuthenticated, profile } = useProfile();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [referrerWallet, setReferrerWallet] = useState<string>(
    "0x0000000000000000000000000000000000000000",
  );

  // Fetch referrer logic remains key for the profit-sharing model
  useEffect(() => {
    async function getReferralData() {
      if (address) {
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
      NOLLYWIN_BASE_CONTRACT === "0x0000000000000000000000000000000000000000"
    )
      return;

    // Ensure the user is on Base before transacting
    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    writeContract({
      address: NOLLYWIN_BASE_CONTRACT,
      abi: NOLLYWIN_ABI,
      functionName: "createStrategy",
      args: [referrerWallet as `0x${string}`],
      value: parseEther(amount),
    });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">
            Base Terminal
          </h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold">
            Real Assets • High Efficiency • No Fees on Principal
          </p>
        </header>

        {/* Action Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] backdrop-blur-xl">
          {!isConnected ? (
            <div className="py-10">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-6">
                Connection Required to Execute
              </p>
              {/* Insert your standard <ConnectWallet /> component here */}
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-2">
                <span className="text-blue-500">Network: Base Mainnet</span>
                <span className="text-zinc-500">
                  Wallet: {address?.slice(0, 6)}...
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01 ETH"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-8 text-4xl font-mono focus:border-blue-600 outline-none transition-all text-white"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">
                  ETH
                </div>
              </div>

              <button
                onClick={handleInitialize}
                disabled={
                  !amount ||
                  isPending ||
                  NOLLYWIN_BASE_CONTRACT ===
                    "0x0000000000000000000000000000000000000000"
                }
                className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black italic tracking-tighter text-2xl transition-all uppercase disabled:bg-zinc-800"
              >
                {isPending ? "Waiting for Wallet..." : "Deploy Strategy"}
              </button>
            </div>
          )}
        </div>

        {isSuccess && (
          <p className="mt-6 text-green-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">
            Strategy Active on Base
          </p>
        )}
      </div>
    </main>
  );
}
