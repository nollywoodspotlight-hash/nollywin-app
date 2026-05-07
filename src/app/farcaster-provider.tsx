"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import { useMemo, useEffect, useState } from "react";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    // This only runs on the client, so window is guaranteed to exist
    setHost(window.location.host);
  }, []);

  const config = useMemo(() => {
    // Fallback to nollywin-app.vercel.app if host isn't ready yet
    const currentDomain = host || "nollywin-app.vercel.app";

    return {
      rpcUrl: "https://mainnet.optimism.io",
      domain: currentDomain,
      siweUri: `https://${currentDomain}/api/auth/farcaster`,
      relay: "https://relay.farcaster.xyz",
    };
  }, [host]);

  // Prevent rendering the provider until we have the domain to avoid handshake mismatches
  if (!host) return <>{children}</>;

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
