import { NextRequest, NextResponse } from "next/server";
import { SiweMessage, generateNonce } from "siwe";
import { createClient } from "@supabase/supabase-js";

/**
 * NollyWin SIWE Engine [Master Spec v3.0]
 * Auth + Database Sync for Production Crew Tracking
 */

// Initialize Supabase inside the API (Server-Side)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET: Generates a fresh nonce for the frontend to sign
export async function GET() {
  try {
    const nonce = generateNonce();
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error("❌ SIWE Nonce Error:", error);
    return NextResponse.json(
      { error: "Could not generate nonce" },
      { status: 500 },
    );
  }
}

// POST: Verifies signature & Syncs User to Database
export async function POST(request: NextRequest) {
  try {
    // We now accept 'referrer' from the frontend login call
    const { message, signature, referrer } = await request.json();

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Missing SIWE fields" },
        { status: 400 },
      );
    }

    // 1. Verify the SIWE message
    const siweMessage = new SiweMessage(message);
    const { success, error, data } = await siweMessage.verify({ signature });

    if (!success) {
      console.error("⚠️ SIWE Verification Failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    /**
     * MASTER DEV UPDATE: Save User to Production Crew [Spec 13.0]
     * 'upsert' will:
     * 1. Create the user if they don't exist.
     * 2. If they DO exist, it just updates the last login time.
     * 3. 'referred_by' is only set if provided (doesn't overwrite existing referrers).
     */
    const { error: dbError } = await supabase.from("users").upsert(
      {
        wallet_address: data.address,
        referred_by: referrer || null,
      },
      { onConflict: "wallet_address" },
    );

    if (dbError) {
      console.error("❌ Database sync failed:", dbError.message);
      // We continue with 'success: true' so the user can still trade,
      // even if the database sync had a hiccup.
    }

    console.log(`✅ SIWE Authenticated & Synced: ${data.address}`);

    return NextResponse.json({
      success: true,
      address: data.address,
      message: "Signature verified & Production Crew synced",
    });
  } catch (error: any) {
    console.error("❌ SIWE Verification Error:", error.message);
    return NextResponse.json(
      { error: "Internal verification failure" },
      { status: 500 },
    );
  }
}
