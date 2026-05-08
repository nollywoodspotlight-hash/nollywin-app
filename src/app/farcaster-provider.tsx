"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import { useMemo, useEffect, useState } from "react";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  // Use state to track if we are in the browser
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo(() => {
    // We prioritize the Vercel domain, but fallback to window host if available
    const domain = "nollywin-app.vercel.app";

    return {
      rpcUrl: "https://mainnet.optimism.io",
      domain: domain,
      siweUri: `https://${domain}/api/auth/farcaster`,
      relay: "https://relay.farcaster.xyz",
    };
  }, []);

  // If we haven't mounted yet, render the children without the provider
  // to prevent the "unclickable" button state during page load.
  if (!mounted) {
    return <>{children}</>;
  }

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
