import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center font-black text-white italic group-hover:rotate-0 transition-transform">
            N
          </div>
          <span className="text-white font-bold tracking-tighter text-xl italic">
            NollyWin
          </span>
        </Link>
      </div>

      <div className="hidden md:flex gap-6 text-zinc-400 text-sm font-medium">
        {/* Points to your new app/dashboard/page.tsx folder */}
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>

        {/* NOTE: This will 404 until you create an app/trade/page.tsx folder */}
        <Link href="/trade" className="hover:text-white transition-colors">
          Trade
        </Link>

        {/* Points to external documentation or an internal /docs route */}
        <Link href="/docs" className="hover:text-white transition-colors">
          Docs
        </Link>
      </div>
    </nav>
  );
}
