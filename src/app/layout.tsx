"use client";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import Header from "./components/Header"; // UPDATED: Pointing to the new Header logic
import Footer from "./components/FooterX";

const inter = Inter({ subsets: ["latin"] });

// Note: Metadata must be in a separate server component if using "use client"
// or handled via the viewport object below.

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
          {/* Replacing <Navbar /> with <Header />. 
              This ensures the Terminate Session logic and Logo 
              we built are active globally.
          */}
          <Header />

          {/* pt-20 provides the necessary clearance for our fixed 80px header
              on all views so content isn't hidden behind the nav bar.
          */}
          <main className="relative flex-grow w-full pt-20">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
