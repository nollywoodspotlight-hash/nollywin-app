export default function ArchivePage() {
  return (
    <main className="p-10">
      <h2 className="text-3xl font-bold mb-8">Trade Archives</h2>
      {/* This is where you will map through your Supabase trade history */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="p-4">Token</th>
              <th className="p-4">Status</th>
              <th className="p-4">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>{/* Rows will go here */}</tbody>
        </table>
      </div>
    </main>
  );
}
