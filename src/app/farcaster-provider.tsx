"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import { useMemo } from "react";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const config = useMemo(
    () => ({
      rpcUrl: "https://mainnet.optimism.io",
      domain: "nollywin-app.vercel.app",
      siweUri: "https://nollywin-app.vercel.app/api/auth/farcaster",
      relay: "https://relay.farcaster.xyz",
    }),
    [],
  );

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
