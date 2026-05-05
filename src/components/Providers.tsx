"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains"; // Use only Base Mainnet
import { coinbaseWallet, injected } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";

const config = createConfig({
  chains: [base], // Locked to Base Mainnet
  connectors: [
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all",
    }),
    injected(),
  ],
  ssr: true,
  transports: {
    [base.id]: http(), // Standard HTTP transport for Base
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  // Ensures client-side hydration before rendering wallet components
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base} apiKey={KEY}>
          <AuthKitProvider
            config={{
              relay: "https://relay.farcaster.xyz",
              domain: "nollywin.xyz",
            }}
          >
            {children}
          </AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
