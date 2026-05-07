"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import { useMemo } from "react";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  // useMemo ensures this object is only created once on the client
  // but it prevents the build worker from "pre-baking" the localhost value
  const config = useMemo(
    () => ({
      rpcUrl: "https://mainnet.optimism.io",
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || "nollywin.app",
      siweUri: `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "nollywin.app"}/api/auth/farcaster`,
      relay: "https://relay.farcaster.xyz",
    }),
    [],
  );

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
