"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import { useMemo } from "react";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const config = useMemo(() => {
    // 1. Prioritize the Vercel Environment Variable we added
    // 2. Clean it to ensure no 'https://' is in the 'domain' field
    const rawUrl = process.env.NEXT_PUBLIC_URL || "nollywin-app.vercel.app";
    const cleanDomain = rawUrl.replace(/^https?:\/\//, "");

    // 3. Construct the full SIWE URI
    const protocol = cleanDomain.includes("localhost") ? "http" : "https";
    const siweUri = `${protocol}://${cleanDomain}/api/auth/farcaster`;

    return {
      rpcUrl: "https://mainnet.optimism.io",
      domain: cleanDomain,
      siweUri: siweUri,
      relay: "https://relay.farcaster.xyz",
    };
  }, []);

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
