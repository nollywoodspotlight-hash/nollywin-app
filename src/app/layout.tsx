import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the new Footer component

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
      {/* Added 'min-h-screen' and 'flex flex-col' to the body 
          so that the footer can be pushed to the bottom. 
      */}
      <body
        className={`${inter.className} bg-black antialiased text-white min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />

          {/* 'flex-grow' ensures this main area takes up all available space, 
              forcing the footer to the bottom of the screen. 
          */}
          <main className="relative flex-grow">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
