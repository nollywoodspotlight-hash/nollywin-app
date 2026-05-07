"use client";

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

const farcasterConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "nollywin.app",
  siweUri: "/api/auth/farcaster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-black text-white relative`}
      >
        <AuthKitProvider config={farcasterConfig}>
          <Providers>
            <div className="relative z-50">
              <LiveTicker />
              <Navbar />
            </div>

            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
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

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 z-10 relative">
              {children}
            </main>

            <footer className="p-8 text-center text-gray-500 text-xs border-t border-white/5 z-10 bg-black/40 backdrop-blur-md">
              © 2026 NollyWin App • Built on Base
            </footer>
          </Providers>
        </AuthKitProvider>
      </body>
    </html>
  );
}
