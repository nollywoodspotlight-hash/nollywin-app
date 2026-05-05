import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NollyWin | Cinematic Trading",
  description: "Automated trading strategies for the Farcaster ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-nolly-black text-white relative`}
      >
        {/* 1. EVERYTHING blockchain-related must be inside Providers */}
        <Providers>
          {/* Background Layer */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center opacity-50"
              style={{
                backgroundImage: "url('/galaxy.jpg')",
                maskImage:
                  "radial-gradient(circle at center, black 30%, transparent 90%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 30%, transparent 90%)",
              }}
            />
          </div>

          {/* 2. Moved Navbar inside Providers so the Connect Button works */}
          <Navbar />

          {/* 3. Content Layer */}
          <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 z-10 relative">
            {children}
          </main>

          {/* 4. Footer */}
          <footer className="p-8 text-center text-nolly-gray text-xs border-t border-white/5 z-10 bg-black/40 backdrop-blur-md">
            © 2026 NollyWin App • Built on Base
          </footer>
        </Providers>
      </body>
    </html>
  );
}
