"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useSwitchChain,
  useConnect,
  useDisconnect,
} from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import { parseEther } from "viem";
import { base, zora } from "wagmi/chains";
import { supabase } from "@/lib/supabase";

// Updated with your confirmed Zora Production Address
const CONTRACTS = {
  BASE: "0x0000000000000000000000000000000000000000", // Update this when you deploy to Base Mainnet
  ZORA: "0xc3f3dae9f64ce53bbd63b66954daaa5d2e105c90",
} as const;

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
  const { isConnected, address, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { isAuthenticated, profile } = useProfile();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [referrerWallet, setReferrerWallet] = useState<string>(
    "0x0000000000000000000000000000000000000000",
  );

  // This login specifically hunts for MetaMask/Rainbow to avoid Coinbase defaults
  const loginWithZora = () => {
    const preferredConnector =
      connectors.find((c) => c.id === "injected" || c.type === "injected") ||
      connectors[0];

    if (preferredConnector) {
      connect({
        connector: preferredConnector,
        chainId: zora.id,
      });
    }
  };

  const targetContract =
    chain?.id === zora.id
      ? CONTRACTS.ZORA
      : chain?.id === base.id
        ? CONTRACTS.BASE
        : null;

  useEffect(() => {
    async function getReferralData() {
      if (!address) return;
      const { data } = await supabase
        .from("users")
        .select("referrer_original_wallet")
        .eq("user_wallet", address.toLowerCase())
        .single();

      if (data?.referrer_original_wallet) {
        setReferrerWallet(data.referrer_original_wallet);
      }
    }
    getReferralData();
  }, [address]);

  const handleInitialize = () => {
    if (
      !amount ||
      !isConnected ||
      !targetContract ||
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

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">
            Live Terminal
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold">
            Real Asset Execution • {chain?.name || "Select Network"}
          </p>
        </header>

        {isConnected &&
          chain &&
          chain.id !== base.id &&
          chain.id !== zora.id && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-2xl text-red-400 text-[10px] uppercase font-bold tracking-widest text-center">
              Unsupported Network: Please switch to Base or Zora
            </div>
          )}

        {isConnected && (
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => switchChain?.({ chainId: base.id })}
              disabled={isSwitching}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                chain?.id === base.id
                  ? "bg-blue-600 border-blue-600"
                  : "border-zinc-800 hover:border-zinc-500"
              }`}
            >
              Base Mainnet
            </button>
            <button
              onClick={() => switchChain?.({ chainId: zora.id })}
              disabled={isSwitching}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                chain?.id === zora.id
                  ? "bg-purple-600 border-purple-600"
                  : "border-zinc-800 hover:border-zinc-500"
              }`}
            >
              Zora Mainnet
            </button>
          </div>
        )}

        {!isConnected ? (
          <div className="flex flex-col gap-6 w-full">
            <button
              onClick={loginWithZora}
              className="w-full bg-purple-600 hover:bg-purple-500 py-8 rounded-3xl font-black italic tracking-tighter text-2xl transition-all uppercase flex flex-col items-center justify-center gap-2 group"
            >
              <div className="flex items-center gap-3">
                <span className="bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm not-italic group-hover:scale-110 transition-transform">
                  Z
                </span>
                <span>Login with Zora Wallet</span>
              </div>
              <span className="text-[9px] font-bold tracking-[0.3em] opacity-60">
                MetaMask • Rainbow • WalletConnect
              </span>
            </button>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="p-4 border border-zinc-800 rounded-2xl bg-zinc-900/10 text-center text-[10px] text-zinc-500 uppercase font-bold tracking-widest hover:border-zinc-600 transition-colors"
            >
              Use Other Wallet (Coinbase, etc.)
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-green-500" : "bg-zinc-700"}`}
                />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isAuthenticated ? `@${profile?.username}` : "FC Not Linked"}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-[10px] font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest"
              >
                Disconnect {address?.slice(0, 4)}...
              </button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                01. Strategy Principal (REAL ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-3xl font-mono focus:border-white outline-none transition-all mb-6 text-white"
              />
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Profit-Only Reward
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
                !targetContract ||
                targetContract === "0x0000000000000000000000000000000000000000"
              }
              className={`w-full py-6 rounded-2xl font-black italic tracking-tighter text-xl transition-all uppercase ${
                chain?.id === zora.id
                  ? "bg-purple-600 hover:bg-purple-500"
                  : "bg-blue-600 hover:bg-blue-500"
              } disabled:bg-zinc-800 disabled:cursor-not-allowed`}
            >
              {isPending
                ? "Transacting..."
                : `Deploy ${chain?.id === zora.id ? "Zora" : "Base"} Strategy`}
            </button>

            {error && (
              <p className="text-red-400 text-[10px] uppercase font-bold text-center tracking-widest">
                Error:{" "}
                {error.message.includes("user rejected")
                  ? "User Rejected Transaction"
                  : "Execution Failed"}
              </p>
            )}

            {isSuccess && (
              <p className="text-green-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">
                Strategy Successfully Executed on {chain?.name}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
