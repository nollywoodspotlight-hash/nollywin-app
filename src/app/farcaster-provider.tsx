"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";

const farcasterConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "nollywin.app",
  siweUri: "https://nollywin.app/api/auth/farcaster",
};

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  return <AuthKitProvider config={farcasterConfig}>{children}</AuthKitProvider>;
}
