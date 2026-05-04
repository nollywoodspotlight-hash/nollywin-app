"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, optimism, zora, zoraSepolia } from "wagmi/chains"; // Added Zora Sepolia
import { coinbaseWallet } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";
const ALCHEMY_OPTIMISM_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

// New Alchemy RPCs for Zora
const ALCHEMY_ZORA_RPC =
  "https://zora-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";
const ALCHEMY_ZORA_SEPOLIA_RPC =
  "https://zora-sepolia.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

const config = createConfig({
  chains: [baseSepolia, optimism, zora, zoraSepolia], // Added Zora Sepolia
  connectors: [
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all", // Allows selection of various wallets
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${KEY}`,
    ),
    [optimism.id]: http(ALCHEMY_OPTIMISM_RPC),
    [zora.id]: http(ALCHEMY_ZORA_RPC), // Using your Alchemy Zora Mainnet RPC
    [zoraSepolia.id]: http(ALCHEMY_ZORA_SEPOLIA_RPC), // Using your Alchemy Zora Sepolia RPC
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
        {/* You can keep baseSepolia as the default for OnchainKit */}
        <OnchainKitProvider chain={baseSepolia} apiKey={KEY}>
          <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
