export function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center font-black text-white italic">
          N
        </div>
        <span className="text-white font-bold tracking-tighter text-xl italic">
          NollyWin
        </span>
      </div>

      {/* Remove the ConnectWallet button from here for now */}
      <div className="hidden md:flex gap-6 text-zinc-400 text-sm font-medium">
        <a href="#" className="hover:text-white transition-colors">
          Dashboard
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Trade
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Docs
        </a>
      </div>
    </nav>
  );
}
