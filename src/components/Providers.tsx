"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, optimism } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";
const ALCHEMY_OPTIMISM_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

const config = createConfig({
  chains: [baseSepolia, optimism],
  connectors: [
    coinbaseWallet({
      appName: "NollyWin",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${KEY}`,
    ),
    [optimism.id]: http(ALCHEMY_OPTIMISM_RPC),
  },
});

const farcasterConfig = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: ALCHEMY_OPTIMISM_RPC,
  // FIXED: Pointing to the live production domain for NollyWin
  domain: "nollywin.xyz",
  siweUri: "https://nollywin.xyz/api/auth/farcaster",
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia} apiKey={KEY}>
          <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
