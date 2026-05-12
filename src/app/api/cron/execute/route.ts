import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { executeSwap } from "@/lib/swap";

// We removed the global 'const supabase' from here to prevent build errors

export async function GET(req: Request) {
  // MASTER DEV FIX: Initialize Supabase inside the function
  // This prevents the "supabaseUrl is required" error during Vercel builds
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 1. Security Check: Only allow authorized triggers
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. SCAN: Find ACTIVE strategies
  const { data: activeStrategies, error: fetchError } = await supabase
    .from("strategies")
    .select("*")
    .eq("lifecycle_state", "ACTIVE");

  if (fetchError || !activeStrategies || activeStrategies.length === 0) {
    return NextResponse.json({ message: "No active trades found." });
  }

  // 3. EXECUTE: The Loop (Logic 7.1)
  for (const strategy of activeStrategies) {
    try {
      console.log(`🤖 Bot checking trade for: ${strategy.wallet_address}`);

      // CALL THE SWAP ENGINE
      const swapResult = await executeSwap(
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native ETH
        strategy.target_contract_address,
        strategy.dca_amount_eth.toString(),
        strategy.wallet_address,
      );

      if (swapResult && swapResult.success) {
        // SUCCESS: Update database with the transaction data
        await supabase
          .from("strategies")
          .update({
            tx_hash: swapResult.tx.hash,
          })
          .eq("id", strategy.id);

        console.log(`✅ Swap data prepared for strategy: ${strategy.id}`);
      } else {
        // TRIGGER STALL: 1inch couldn't find a route
        throw new Error(swapResult?.error || "Unknown swap error");
      }
    } catch (error: any) {
      // 4. STALL PROTECTION [Spec 15.0]
      console.error(`⚠️ Stall detected: ${error.message}`);

      const newStallCount = (strategy.stall_count || 0) + 1;
      const newState = newStallCount >= 3 ? "CANCELLED" : "STALLED";

      await supabase
        .from("strategies")
        .update({
          stall_count: newStallCount,
          lifecycle_state: newState,
        })
        .eq("id", strategy.id);
    }
  }

  return NextResponse.json({
    success: true,
    processed: activeStrategies.length,
  });
}
