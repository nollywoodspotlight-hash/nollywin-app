"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export function MiniAppReady() {
  useEffect(() => {
    const makeReady = async () => {
      try {
        console.log("📡 Attempting sdk.actions.ready()...");
        await sdk.actions.ready();
        console.log("✅ sdk.actions.ready() called SUCCESSFULLY");
      } catch (err) {
        console.error("❌ ready() failed:", err);
      }
    };

    makeReady();
  }, []);

  return null;
}
