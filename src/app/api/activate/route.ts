import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "❌ Critical: Supabase server environment variables are completely unconfigured.",
      );
      return NextResponse.json(
        { error: "Protocol configuration incomplete" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const {
      wallet_address,
      contract_address,
      amount,
      frequency,
      multiplier,
      pool_fee,
      txHash,
    } = body;

    // Validate absolute baseline attributes required for database tracking
    if (!wallet_address || !contract_address || !txHash) {
      return NextResponse.json(
        { error: "Insufficient deployment intelligence markers provided." },
        { status: 400 },
      );
    }

    console.log(
      `📡 PARALLEL SNIPER ENGINE: Processing sync discovery for User ${wallet_address.slice(
        0,
        8,
      )}...`,
    );

    // Secure server-side insertion mapping natively into the new table layout
    const { data, error: dbError } = await supabase
      .from("dca_orders")
      .insert([
        {
          user_address: wallet_address,
          token_to_buy: contract_address.trim(),
          amount_per_trade: parseFloat(amount || "0.01"),
          status: "ACTIVE_HUNTING",
          tx_hash: txHash.trim(),
          pool_fee: parseInt(pool_fee || "3000"),
          sell_multiplier: parseFloat(multiplier || "2"),
          frequency_hours: parseInt(frequency || "4"),
        },
      ])
      .select();

    if (dbError) {
      console.error(
        "Database registration rejected execution:",
        dbError.message,
      );
      // Fallback response for dashboard client redundancy layer
      return NextResponse.json(
        { error: "Database rejected transaction duplicate block hash record." },
        { status: 409 },
      );
    }

    console.log(
      `🎯 TARGET SECURED: Manual recovery verified transaction hash ${txHash.slice(
        0,
        10,
      )}...`,
    );

    return NextResponse.json({
      success: true,
      message:
        "Target asset signature localized, recovered, and tracked successfully.",
      data,
    });
  } catch (error: any) {
    console.error("❌ Activate API Route Critical Defect:", error.message);
    return NextResponse.json(
      { error: "Internal structural ingestion pipeline fault" },
      { status: 500 },
    );
  }
}
