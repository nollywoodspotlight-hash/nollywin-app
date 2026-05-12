"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleConnect = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleTerminate = () => {
    disconnect();
    setIsMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Archive", path: "/archive" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-0 w-full z-[200] bg-black/90 backdrop-blur-md border-b border-[#b87209]/20 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO */}
        <div
          className="flex flex-col cursor-pointer shrink-0 leading-none"
          onClick={() => router.push("/")}
        >
          <div className="flex items-baseline space-x-1">
            <span className="font-black italic text-2xl text-white uppercase tracking-tighter">
              NW
            </span>
            <span className="font-black italic text-2xl text-[#b87209] uppercase tracking-tighter">
              Nollywin
            </span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50 italic">
            by Nollywood spotlight
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="text-[11px] font-black italic uppercase tracking-widest text-white hover:text-[#b87209] transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* ACTION CONTAINER */}
        <div className="flex items-center space-x-3">
          {isConnected ? (
            /* DISCONNECT / TERMINATE BUTTON (When Connected) */
            <button
              onClick={handleTerminate}
              className="group relative px-4 py-2 md:px-6 md:py-3 border border-[#b87209]/40 hover:border-[#b87209] bg-black transition-all cursor-pointer pointer-events-auto"
            >
              <span className="relative z-10 text-[10px] md:text-[11px] font-black uppercase italic tracking-widest text-[#b87209]">
                [ Terminate Session / {address?.slice(0, 4)}... ]
              </span>
            </button>
          ) : (
            /* CONNECT BUTTONS (When Disconnected) */
            <>
              <div className="flex md:hidden items-center">
                <Wallet>
                  <ConnectWallet
                    onConnect={handleConnect}
                    className="!flex bg-[#b87209] text-black font-black italic text-[10px] uppercase py-2 px-4 rounded-none"
                  >
                    Connect
                  </ConnectWallet>
                </Wallet>
              </div>

              <div className="hidden md:flex items-center">
                <Wallet>
                  <ConnectWallet
                    onConnect={handleConnect}
                    className="bg-[#b87209] text-black font-black italic text-[11px] uppercase py-3 px-6 rounded-none hover:bg-white transition-all"
                  >
                    Connect Wallet
                  </ConnectWallet>
                </Wallet>
              </div>
            </>
          )}

          {/* HAMBURGER MENU */}
          <button
            className="md:hidden text-[#b87209] p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-[#b87209]/20 p-8 flex flex-col space-y-6 z-[201] animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                router.push(link.path);
                setIsMenuOpen(false);
              }}
              className="text-left text-2xl font-black italic uppercase text-white hover:text-[#b87209] border-l-2 border-[#b87209]/40 pl-4"
            >
              {link.name}
            </button>
          ))}
          {isConnected && (
            <button
              onClick={handleTerminate}
              className="text-left text-xl font-black italic uppercase text-red-600 border-l-2 border-red-600/40 pl-4"
            >
              Terminate Session
            </button>
          )}
        </div>
      )}
    </header>
  );
}
