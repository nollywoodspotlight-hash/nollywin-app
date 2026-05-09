"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export function MiniAppReady() {
  useEffect(() => {
    const init = async () => {
      try {
        console.log("📡 Calling sdk.actions.ready()...");
        await sdk.actions.ready();
        console.log(
          "✅ sdk.actions.ready() SUCCESS — Splash screen should be gone",
        );
      } catch (error) {
        console.error("❌ sdk.actions.ready() failed:", error);
      }
    };

    init();
  }, []);

  return null;
}
