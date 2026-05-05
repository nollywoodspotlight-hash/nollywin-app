import React from "react";

export default function ArchivePage() {
  const pastTrades = [
    {
      id: 1,
      name: "The Wedding Party",
      status: "Completed",
      profit: "+12.5%",
      date: "May 2026",
    },
    {
      id: 2,
      name: "Living in Bondage",
      status: "Liquidated",
      profit: "-5.2%",
      date: "April 2026",
    },
    {
      id: 3,
      name: "King of Boys",
      status: "Completed",
      profit: "+28.1%",
      date: "March 2026",
    },
  ];

  return (
    <div className="space-y-8 py-10">
      <header className="border-l-4 border-red-600 pl-6">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          The Vault
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Past performances and historical protocol data.
        </p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10 text-xs uppercase tracking-[0.2em] font-bold">
            <tr>
              <th className="p-4 text-red-500">Operation</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pastTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">{trade.name}</td>
                <td className="p-4 text-xs text-gray-400 uppercase">
                  {trade.status}
                </td>
                <td
                  className={`p-4 text-right font-mono ${trade.profit.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {trade.profit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
