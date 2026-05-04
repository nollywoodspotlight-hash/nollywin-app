"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, optimism, zora } from "wagmi/chains"; // Added zora
import { coinbaseWallet } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";
const ALCHEMY_OPTIMISM_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

const config = createConfig({
  chains: [baseSepolia, optimism, zora], // Added zora
  connectors: [
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all", // Changed to "all" to support standard Zora wallets
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${KEY}`,
    ),
    [optimism.id]: http(ALCHEMY_OPTIMISM_RPC),
    [zora.id]: http(), // Standard transport for Zora
  },
});

const farcasterConfig = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: ALCHEMY_OPTIMISM_RPC,
  domain: "nollywin.xyz",
  siweUri: "https://nollywin.xyz/api/auth/farcaster",
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* OnchainKit defaults to baseSepolia, but the config allows switching */}
        <OnchainKitProvider chain={baseSepolia} apiKey={KEY}>
          <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
