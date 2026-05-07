"use client";

import React, { useState, useEffect } from "react";
import LiveTicker from "./components/liveticker";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Providers } from "./components/providers";
import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * PRODUCTION FARCASTER CONFIG
 * Defined outside the component to ensure a stable reference.
 * This prevents the 'unlit' button or polling failures on Vercel.
 */
const getFarcasterConfig = () => {
  const isProd =
    typeof window !== "undefined" &&
    !window.location.host.includes("localhost");
  const domain = isProd ? "nollywin.app" : "localhost:3000";
  const origin = isProd ? "https://nollywin.app" : "http://localhost:3000";

  return {
    rpcUrl: "https://mainnet.optimism.io",
    domain: domain,
    siweUri: `${origin}/api/auth/farcaster`,
    relay: "https://relay.farcaster.xyz",
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch on Vercel
  if (!mounted) {
    return (
      <html lang="en">
        <body className="bg-black" />
      </html>
    );
  }

  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-black text-white relative`}
      >
        <AuthKitProvider config={getFarcasterConfig()}>
          <Providers>
            {/* Header / Navigation Layer */}
            <div className="relative z-50">
              <LiveTicker />
              <Navbar />
            </div>

            {/* Background Layer: Galaxy & Overlays */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
              <div
                className="w-full h-full bg-cover bg-center opacity-40"
                style={{
                  backgroundImage: "url('/galaxy.jpg')",
                  maskImage:
                    "radial-gradient(circle at center, black 20%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 20%, transparent 80%)",
                }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Main Content: Ensure it sits above the background but below Nav */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 z-10 relative">
              {children}
            </main>

            <footer className="p-8 text-center text-gray-500 text-xs border-t border-white/5 z-10 bg-black/40 backdrop-blur-md relative">
              © 2026 NollyWin App • Built on Base Network
            </footer>
          </Providers>
        </AuthKitProvider>
      </body>
    </html>
  );
}
