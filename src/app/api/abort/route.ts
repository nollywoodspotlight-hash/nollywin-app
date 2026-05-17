import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Initialize inside the handler to prevent Vercel build-time initialization crashes
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

    console.log(
      `🚨 API OVERRIDE PROTOCOL: Requesting emergency shutdown for Sniper Order #${tradeId}`,
    );

    // 📡 UPDATE CORE TABLE: Update status string directly to state-machine standard 'ABORTED'
    const { data: updatedData, error: updateError } = await supabase
      .from("dca_orders")
      .update({ status: "ABORTED" })
      .eq("id", tradeId)
      .eq("user_address", wallet_address)
      .select();

    if (updateError) {
      console.error("Supabase update execution error:", updateError.message);
      throw updateError;
    }

    // Verify a row was actually matched and updated in the query bounds
    if (!updatedData || updatedData.length === 0) {
      console.warn(
        `❌ Abort targets skipped: No match found for sniper order #${tradeId} linked to wallet ${wallet_address}`,
      );
      return NextResponse.json(
        { error: "Trade target matching profile unviable" },
        { status: 404 },
      );
    }

    console.log(
      `🧨 Kill Switch Activated: Sniper Order #${tradeId} hard status updated to ABORTED.`,
    );

    return NextResponse.json({
      success: true,
      message:
        "Emergency abort state broadcasted to real-time database architecture.",
    });
  } catch (error: any) {
    console.error("❌ Abort API Route Failure:", error.message);
    return NextResponse.json(
      { error: "Internal liquidation routing failure" },
      { status: 500 },
    );
  }
}
