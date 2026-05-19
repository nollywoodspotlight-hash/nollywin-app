"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [wagmiConfig] = useState(() => {
    // TELEMETRY SANITIZATION LAYER: Ensure the incoming RPC URL is strictly valid for Base Mainnet
    const rawRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "";

    // Fallback instantly to clear public infrastructure if the variable contains Optimism configs or syntax errors
    const verifiedRpcEndpoint =
      rawRpcUrl.includes("opt-mainnet") || !rawRpcUrl.startsWith("https://")
        ? "https://mainnet.base.org"
        : rawRpcUrl;

    return createConfig({
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
        // Deploys the sanitized Base RPC protocol cleanly to prevent console errors
        [base.id]: http(verifiedRpcEndpoint),
      },
    });
  });

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
