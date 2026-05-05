"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http, useAccount } from "wagmi"; // Added useAccount
import { base, zora } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import "@farcaster/auth-kit/styles.css";

const KEY = "O0ipgInYOvzhfsKMFPErgxUtcM9ld3GS";

// This ID is required for WalletConnect to function.
// Get one at cloud.walletconnect.com
const WC_PROJECT_ID =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || "PASTE_YOUR_ID_HERE_IF_NOT_IN_ENV";

const config = createConfig({
  chains: [base, zora],
  connectors: [
    injected(), // Prioritizes MetaMask & Rainbow extensions
    walletConnect({
      projectId: WC_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "NollyWin",
        description: "Real Asset Execution on Base & Zora",
        url: "https://nollywin.xyz",
        icons: ["https://nollywin.xyz/logo.png"],
      },
    }),
    coinbaseWallet({
      appName: "NollyWin",
      preference: "all",
    }),
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

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitWrapper>{children}</OnchainKitWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function OnchainKitWrapper({ children }: { children: ReactNode }) {
  const { chain } = useAccount(); // Required to detect the wallet's current network

  return (
    <OnchainKitProvider
      key={chain?.id || "init"} // Forces UI refresh when switching between Base and Zora
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
