"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk"; // or @farcaster/miniapp-sdk

export function MiniAppReady() {
  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        await sdk.actions.ready();
        console.log("✅ Farcaster Mini App ready() called");
      } catch (error) {
        console.error("Failed to call sdk.actions.ready():", error);
      }
    };

    initializeMiniApp();
  }, []);

  return null; // This component does nothing visible
}
