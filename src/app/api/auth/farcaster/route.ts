import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextRequest, NextResponse } from "next/server";

// FORCE THE ROUTE TO BE DYNAMIC (Fixes the "localhost" caching leak)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature, nonce } = body;

    const appClient = createAppClient({
      ethereum: viemConnector(),
    });

    const verifyResult: any = await appClient.verifySignInMessage({
      message,
      signature,
      domain: "nollywin.app",
      nonce,
    });

    if (verifyResult.success) {
      console.log("Verification Success for:", verifyResult.data?.username);
      return NextResponse.json({
        success: true,
        user: verifyResult.data,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: verifyResult.error?.message || "Verification failed",
      },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Farcaster API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
