import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import Header from "./components/Header";
import Footer from "./components/FooterX";

const inter = Inter({ subsets: ["latin"] });

// Server-side Metadata (Vital for SEO and Vercel Build)
export const metadata: Metadata = {
  title: "NollyWin | Cinematic DCA on Base",
  description: "Automated trading with a Nollywood soul. Powered by Base.",
};

// Vital for Mobile Design Framing
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
          {/* Your Custom Header with the Terminate Session logic */}
          <Header />

          {/* The main content area with proper mobile spacing */}
          <main className="relative flex-grow w-full pt-20">{children}</main>

          {/* Your Branding Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
