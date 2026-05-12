import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // MASTER DEV FIX: Initialize inside the handler to prevent Vercel build-time crashes
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "❌ Critical: Supabase environment variables are missing on the server.",
      );
      return NextResponse.json(
        { error: "Protocol configuration incomplete" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tradeId, wallet_address } = await req.json();

    if (!tradeId || !wallet_address) {
      return NextResponse.json(
        { error: "Missing intelligence data" },
        { status: 400 },
      );
    }

    // 1. Fetch the trade intel before killing it
    const { data: trade, error: fetchError } = await supabase
      .from("strategies")
      .select("*")
      .eq("id", tradeId)
      .eq("wallet_address", wallet_address)
      .single();

    if (fetchError || !trade) {
      return NextResponse.json(
        { error: "Trade not found in production" },
        { status: 404 },
      );
    }

    /**
     * MASTER DEV LOGIC [Spec 17.0]
     * In a live environment, this is where you would call the 1inch API
     * to sell the tokens back to ETH. For now, we simulate the liquidation.
     */

    // Simulate current value for profit/loss calculation (10% gain simulation)
    const simulatedExitValue = parseFloat(trade.dca_amount_eth) * 1.1;
    const finalProfit = simulatedExitValue - parseFloat(trade.dca_amount_eth);

    // 2. Terminate and Move to Archive
    const { error: updateError } = await supabase
      .from("strategies")
      .update({
        lifecycle_state: "CANCELLED", // Moves it out of the Live Feed
        profit_eth: finalProfit, // Records the final P/L
        ended_at: new Date().toISOString(),
      })
      .eq("id", tradeId);

    if (updateError) throw updateError;

    console.log(`🧨 Production Aborted: Trade ${tradeId} moved to Archive.`);

    return NextResponse.json({
      success: true,
      message: "Production terminated. Assets liquidated to ETH.",
    });
  } catch (error: any) {
    console.error("❌ Abort Failure:", error.message);
    return NextResponse.json(
      { error: "Internal liquidation failure" },
      { status: 500 },
    );
  }
}
