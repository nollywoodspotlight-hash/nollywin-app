import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// 1. Connect to your "Memory"
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  // 2. SCAN: Find only the ACTIVE strategies (using the Index you just built!)
  const { data: activeStrategies } = await supabase
    .from("strategies")
    .select("*")
    .eq("lifecycle_state", "ACTIVE");

  if (!activeStrategies || activeStrategies.length === 0) {
    return NextResponse.json({ message: "No active trades to process." });
  }

  // 3. EXECUTE: Loop through them (Logic 7.1)
  for (const strategy of activeStrategies) {
    try {
      console.log(`Processing trade for ${strategy.wallet_address}...`);

      // HERE IS WHERE THE REAL MAGIC HAPPENS:
      // In a full setup, you would call 1inch/0x API to swap ETH for
      // the 'target_contract_address' stored in your table.

      // For now, we update the database to show the trade is in progress
      await supabase
        .from("strategies")
        .update({ tx_hash: "PENDING_ON_CHAIN" })
        .eq("id", strategy.id);
    } catch (error) {
      // 4. STALL PROTECTION: If it fails, increment stall count (Spec 15.0)
      const newStallCount = (strategy.stall_count || 0) + 1;
      const newState = newStallCount >= 3 ? "CANCELLED" : "STALLED";

      await supabase
        .from("strategies")
        .update({ stall_count: newStallCount, lifecycle_state: newState })
        .eq("id", strategy.id);
    }
  }

  return NextResponse.json({
    success: true,
    processed: activeStrategies.length,
  });
}
