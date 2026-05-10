import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NollyWin | Cinematic DCA on Base",
  description: "Automated trading with a Nollywood soul. Powered by Base.",
};

// Prevents the browser from zooming in on mobile,
// keeping the heavy italic typography perfectly framed.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          {/* The internal <Navbar /> is fixed, so we don't need a wrapper 
              header here. Removing the relative wrapper helps fixed positioning.
          */}
          <Navbar />

          {/* 'pt-20' ensures that on mobile, the content starts AFTER the 80px header.
              On desktop ('md:pt-0'), we let the Hero section handle its own spacing.
          */}
          <main className="relative flex-grow w-full pt-20 md:pt-0">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
