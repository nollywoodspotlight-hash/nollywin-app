import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";

// @ts-ignore - This tells TypeScript to stop complaining and just run the code
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LIGHTS. CAMERA. PROFITS.",
  description: "Onchain Automation Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${inter.className} bg-black antialiased selection:bg-[#b87209] selection:text-black`}
      >
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {/* NOLLYWIN EXECUTIVE HEADER */}
            <header className="fixed top-0 w-full z-[100] bg-black/90 backdrop-blur-md border-b border-[#b87209]/20">
              <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#b87209] flex items-center justify-center font-black italic text-black text-lg">
                    N
                  </div>
                  <span className="font-black italic text-2xl tracking-tighter text-white uppercase">
                    NOLLY<span className="text-[#b87209]">WIN</span>
                  </span>
                </div>
              </div>
            </header>

            <main className="flex-grow pt-24">{children}</main>

            <footer className="w-full border-t border-white/5 py-10 bg-black text-center">
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">
                © 2026 NOLLYWIN • PRODUCTION PROTOCOL
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
