"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http, useAccount } from "wagmi";
import { base, zora, optimism, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";
const ALCHEMY_OPTIMISM_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";
const ALCHEMY_ZORA_RPC =
  "https://zora-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L";

const config = createConfig({
  chains: [base, zora, optimism, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all",
    }),
    injected(),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [zora.id]: http(ALCHEMY_ZORA_RPC),
    [optimism.id]: http(ALCHEMY_OPTIMISM_RPC),
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${KEY}`,
    ),
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
        <OnchainKitWrapper children={children} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function OnchainKitWrapper({ children }: { children: ReactNode }) {
  const { chain } = useAccount();

  return (
    <OnchainKitProvider
      // The 'key' prop is the secret weapon here.
      // It forces OnchainKit to reset entirely when the chain changes.
      key={chain?.id || base.id}
      chain={chain || base}
      apiKey={KEY}
    >
      <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>
    </OnchainKitProvider>
  );
}
