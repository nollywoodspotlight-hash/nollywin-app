import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import Header from "./components/Header";
import Footer from "./components/FooterX";

const inter = Inter({ subsets: ["latin"] });

// Server-side Metadata (Fixed for Vercel)
export const metadata: Metadata = {
  title: "NollyWin | Cinematic DCA on Base",
  description: "Automated trading with a Nollywood soul. Powered by Base.",
};

// Mobile Design Framing
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${inter.className} bg-black antialiased text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Providers>
          {/* THE GALAXY BACKGROUND LAYER */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* 1. Your Single Image (from the public folder) */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
              style={{
                backgroundImage: `url('/galaxy-bg.jpg')`,
              }}
            />

            {/* 2. The Brand Gold Radial Glow (Kept for depth) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(184,114,9,0.15),transparent_60%)]" />

            {/* 3. Cinematic Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* Your Custom Header (z-300) */}
          <Header />

          {/* The main content area (z-10 ensures it stays above the background) */}
          <main className="relative z-10 flex-grow w-full pt-20">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
