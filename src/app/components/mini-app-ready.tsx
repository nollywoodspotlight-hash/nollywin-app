"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk"; // Make sure you're using frame-sdk

export function MiniAppReady() {
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("📡 Initializing Farcaster Mini App...");
        await sdk.actions.ready();
        console.log("✅ sdk.actions.ready() called successfully");
      } catch (error) {
        console.error("❌ Failed to call sdk.actions.ready():", error);
      }
    };

    // Call it as soon as possible
    initialize();
  }, []);

  return null;
}
