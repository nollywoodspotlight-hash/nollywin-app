import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 'min-h-screen' + 'flex flex-col' is the secret for mobile.
        It forces the body to be at least the height of the phone screen,
        pushing the footer to the bottom and keeping the navbar at the top.
      */}
      <body
        className={`${inter.className} bg-black antialiased text-white min-h-screen flex flex-col`}
      >
        <Providers>
          {/* Z-index 100 ensures the Navbar stays above the Hero text 
            on small mobile screens. 
          */}
          <header className="z-[100] relative">
            <Navbar />
          </header>

          {/* 'flex-grow' ensures this section fills the gap between 
            Navbar and Footer. 
          */}
          <main className="relative flex-grow w-full">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
