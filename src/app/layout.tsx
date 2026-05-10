import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./components/providers";

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
        {/* The Providers wrapper allows the Vercel deployment 
            to share wallet state across all routes. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
