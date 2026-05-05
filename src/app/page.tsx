export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
        Lights, Camera, Profits.
      </h1>
      <p className="mt-4 text-xl text-gray-400">
        The Nollywood-Inspired Trading Engine for Base.
      </p>

      <div className="mt-8 flex gap-4">
        {/* Your Wallet Connect Component goes here */}
        <button className="bg-blue-600 px-6 py-3 rounded-lg font-bold">
          Connect Wallet
        </button>
      </div>

      <div className="mt-12 p-6 border border-gray-800 rounded-2xl bg-black/50">
        <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
          How to Guide (45 Seconds)
        </p>
        <div className="aspect-video w-full max-w-2xl bg-gray-900 rounded-lg flex items-center justify-center">
          {/* Replace this with your video tag or iframe */}
          <span className="text-gray-600 underline cursor-pointer">
            Watch Onboarding Video
          </span>
        </div>
      </div>
    </main>
  );
}
