import React from "react";
import LiveTicker from "./components/liveticker";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Providers } from "./components/providers";
import { FarcasterProvider } from "./farcaster-provider";
import { MiniAppReady } from "./components/mini-app-ready";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NollyWin | Cinematic Onchain Trading",
  description: "Automated trading strategies on Base.",
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
        <Providers>
          <FarcasterProvider>
            <div className="relative z-50">
              <LiveTicker />
              <Navbar />
            </div>

            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
              <div
                className="w-full h-full bg-cover bg-center opacity-40"
                style={{
                  backgroundImage: "url('/galaxy.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 z-10 relative">
              {children}
            </main>

            <footer className="p-8 text-center text-gray-500 text-xs border-t border-white/5 z-10 bg-black/40 backdrop-blur-md relative">
              © 2026 NollyWin App • Built on Base Network
            </footer>

            <MiniAppReady />
          </FarcasterProvider>
        </Providers>
      </body>
    </html>
  );
}
