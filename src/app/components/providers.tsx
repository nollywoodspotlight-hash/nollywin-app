"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [wagmiConfig] = useState(() =>
    createConfig({
      // MASTER FIX: Base is the primary and only chain
      chains: [base],
      connectors: [
        coinbaseWallet({
          appName: "NollyWin",
          preference: "all",
        }),
      ],
      ssr: true,
      transports: {
        // Use your Alchemy RPC if available, otherwise fallback to public
        [base.id]: http(
          process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "https://mainnet.base.org",
        ),
      },
    }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* MASTER FIX: Ensure OnchainKit and CDP API Key are linked. 
            This forces the Coinbase Smart Wallet to stay on Base.
        */}
        <OnchainKitProvider
          chain={base}
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          config={{ appearance: { mode: "dark" } }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
