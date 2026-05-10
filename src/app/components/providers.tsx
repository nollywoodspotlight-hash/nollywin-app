"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { base } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export function Providers({ children }: { children: ReactNode }) {
  // UseState ensures the QueryClient is only created once in the Vercel browser environment
  const [queryClient] = useState(() => new QueryClient());

  const [wagmiConfig] = useState(() =>
    createConfig({
      chains: [base],
      connectors: [
        coinbaseWallet({
          appName: "NollyWin",
          preference: "all", // Enables the 2026 Smart Wallet onboarding
        }),
      ],
      ssr: true,
      transports: {
        [base.id]: http(),
      },
    }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base}>{children}</OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
