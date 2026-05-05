import React from "react";

export default function AboutPage() {
  return (
    <div className="space-y-8 py-10">
      <header className="border-l-4 border-red-600 pl-6">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          The Script
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Where Nollywood Drama meets DeFi Logic.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-300 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">
            Our Vision
          </h2>
          <p>
            NollyWin is the world's first cinematic trading protocol. We believe
            that decentralized finance shouldn't just be about numbers—it should
            have soul, style, and the high-stakes energy of a Lagos blockbuster.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">
            The Protocol
          </h2>
          <p>
            Built on the Base network, NollyWin automates complex trading
            strategies for the Farcaster ecosystem, allowing users to execute
            "Box Office" trades without staring at charts 24/7.
          </p>
        </section>
      </div>
    </div>
  );
}
