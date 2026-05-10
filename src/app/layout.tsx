import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";
import navbar from "./components/navbar"; // Importing the restored navigation/ticker

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
      <body className={`${inter.className} bg-black antialiased text-white`}>
        <Providers>
          {/* The Navbar is placed inside Providers so it can 
              potentially access wallet state later if needed.
          */}
          <navbar />

          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
