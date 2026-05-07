"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";

const config = createConfig({
  chains: [base],
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
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base} apiKey={KEY}>
          {/* Farcaster AuthKitProvider has been removed from here.
              It is now managed globally in src/app/layout.tsx to avoid 
              domain conflicts and multiple provider instances.
          */}
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
