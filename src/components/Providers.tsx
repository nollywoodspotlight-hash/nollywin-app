"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, optimism, zora, zoraSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors"; // Added injected

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";
const ALCHEMY_OPTIMISM_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";
const ALCHEMY_ZORA_RPC =
  "https://zora-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";
const ALCHEMY_ZORA_SEPOLIA_RPC =
  "https://zora-sepolia.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

const config = createConfig({
  chains: [baseSepolia, optimism, zora, zoraSepolia],
  connectors: [
    // coinbaseWallet with preference "all" allows the user to choose
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all",
    }),
    // injected() is essential for Zora support via Browser extensions
    injected(),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${KEY}`,
    ),
    [optimism.id]: http(ALCHEMY_OPTIMISM_RPC),
    [zora.id]: http(ALCHEMY_ZORA_RPC),
    [zoraSepolia.id]: http(ALCHEMY_ZORA_SEPOLIA_RPC),
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
        <OnchainKitProvider
          chain={baseSepolia}
          apiKey={KEY}
          config={{
            appearance: {
              mode: "auto",
            },
          }}
        >
          <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
