"use client";

import LiveTicker from "./components/liveticker";
import { Navbar } from "./components/navbar";
import { Providers } from "./components/providers";
import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import "./globals.css";

const farcasterConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "nollywin.app",
  siweUri: "/api/auth/farcaster", // Corrected to your existing route
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white relative">
        <AuthKitProvider config={farcasterConfig}>
          <Providers>
            <div className="relative z-50">
              <LiveTicker />
              <Navbar />
            </div>

            {/* Background: Added pointer-events-none so it doesn't block clicks */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div
                className="w-full h-full opacity-40"
                style={{ backgroundImage: "url('/galaxy.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <main className="relative z-10">{children}</main>
          </Providers>
        </AuthKitProvider>
      </body>
    </html>
  );
}
