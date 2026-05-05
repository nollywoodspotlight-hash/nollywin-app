"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http, useAccount } from "wagmi";
import { base, zora } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";

const config = createConfig({
  chains: [base, zora],
  connectors: [
    injected(), // MOVE THIS TO THE TOP to prioritize MetaMask/Rainbow
    coinbaseWallet({ appName: "NollyWin", preference: "all" }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [zora.id]: http(
      "https://zora-mainnet.g.alchemy.com/v2/GgSZ3Gsj0Uy7Lvivfu56L",
    ),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents the app from "guessing" the chain before the wallet is ready

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
      key={chain?.id || "init"} // Forces total reset on chain change
      chain={chain || base}
      apiKey={KEY}
    >
      <AuthKitProvider
        config={{
          relay: "https://relay.farcaster.xyz",
          domain: "nollywin.xyz",
        }}
      >
        {children}
      </AuthKitProvider>
    </OnchainKitProvider>
  );
}
