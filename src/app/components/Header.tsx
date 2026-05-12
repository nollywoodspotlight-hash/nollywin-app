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
    <header className="fixed top-0 w-full z-[300] bg-black/95 backdrop-blur-md border-b border-[#b87209]/20 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO SECTION */}
        <div
          className="flex flex-col cursor-pointer shrink-0 leading-none group"
          onClick={() => {
            router.push("/");
            setIsMenuOpen(false);
          }}
        >
          <div className="flex items-baseline space-x-1">
            <span className="font-black italic text-1xl text-white uppercase tracking-tighter transition-colors group-hover:text-[#b87209]">
              NW
            </span>
            <span className="font-black italic text-1xl text-[#b87209] uppercase tracking-tighter group-hover:text-white">
              Nollywin
            </span>
          </div>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/50 italic">
            by Nollywood spotlight
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="text-[11px] font-black italic uppercase tracking-[0.2em] text-white/70 hover:text-[#b87209] transition-all hover:tracking-[0.3em]"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* ACTION CONTAINER */}
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <button
              onClick={handleTerminate}
              className="group relative px-4 py-2 md:px-6 md:py-2 border border-[#b87209]/40 hover:border-[#b87209] bg-black transition-all cursor-pointer pointer-events-auto overflow-hidden"
            >
              <span className="relative z-10 text-[9px] md:text-[10px] font-black uppercase italic tracking-widest text-[#b87209] group-hover:text-white transition-colors">
                [ Terminate Session / {address?.slice(0, 4)}... ]
              </span>
              <div className="absolute inset-0 bg-[#b87209] translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
            </button>
          ) : (
            <div className="flex items-center">
              <Wallet>
                <ConnectWallet
                  onConnect={handleConnect}
                  className="bg-[#b87209] text-black font-black italic text-[10px] md:text-[11px] uppercase py-2 px-5 md:py-3 md:px-8 rounded-none hover:bg-white transition-all"
                >
                  Connect Wallet
                </ConnectWallet>
              </Wallet>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden text-[#b87209] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} strokeWidth={3} />
            ) : (
              <Menu size={24} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY - SENTENCE REMOVED */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-black/98 border-b border-[#b87209]/20 p-8 flex flex-col space-y-8 z-[301] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                router.push(link.path);
                setIsMenuOpen(false);
              }}
              className="text-left text-3xl font-black italic uppercase text-white hover:text-[#b87209] border-l-4 border-[#b87209]/20 hover:border-[#b87209] pl-6 transition-all"
            >
              {link.name}
            </button>
          ))}

          {isConnected && (
            <div className="pt-8 border-t border-white/5">
              <button
                onClick={handleTerminate}
                className="w-full py-4 border-2 border-red-900/50 text-red-500 font-black italic uppercase text-sm tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                Terminate Session
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
