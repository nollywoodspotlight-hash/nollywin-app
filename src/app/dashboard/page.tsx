"use client";

import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";
import Link from "next/link";
import {
  Wallet,
  ConnectWallet,
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

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { profile } = useProfile();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 pt-32 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black italic tracking-tighter">
            DASHBOARD
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
            Protocol Status: {isConnected ? "Active" : "Disconnected"}
          </p>
        </div>

        {/* Interactive Wallet Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-md">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4 text-center">
            {profile?.username
              ? `@${profile.username} Linked`
              : "Account Identity"}
          </p>

          <div className="w-full flex justify-center">
            <Wallet>
              <ConnectWallet className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl py-6 transition-all border border-zinc-700">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown className="z-50 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                <Identity className="px-4 pt-4 pb-2" hasCopyAddressOnClick>
                  <Address className="text-white" />
                  <EthBalance className="text-zinc-400" />
                </Identity>
                <div className="p-2">
                  <WalletDropdownDisconnect className="w-full hover:bg-red-500/10 text-red-500 font-bold rounded-xl py-3 transition-colors" />
                </div>
              </WalletDropdown>
            </Wallet>
          </div>
        </div>

        {/* Action Links */}
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/trade"
            className="group bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl transition-all flex justify-between items-center shadow-lg shadow-blue-900/20"
          >
            <span className="font-black italic tracking-tight text-lg">
              OPEN TRADING TERMINAL
            </span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>

          <div className="border border-zinc-800 p-4 rounded-2xl flex justify-between items-center px-6 bg-zinc-900/30">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Referral Reward
            </span>
            <span className="text-green-500 font-bold text-xs uppercase tracking-tighter">
              1% Active
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
