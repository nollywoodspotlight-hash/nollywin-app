import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const appClient = createAppClient({
      ethereum: viemConnector(),
    });

    const verifyResult = await appClient.verifySignInMessage({
      message: body.message,
      signature: body.signature,
      domain: "nollywin.app",
      nonce: body.nonce,
    });

    if (verifyResult.success) {
      return NextResponse.json({
        success: true,
        user: verifyResult.data,
      });
    }

    // TYPE-SAFE ERROR HANDLING
    // We cast to 'any' here specifically to stop the TypeScript 'never' error
    // while we extract the message for our logs.
    const failureReason =
      (verifyResult as any).error?.message || "Verification failed";

    console.error("Farcaster Verification Failed:", failureReason);

    return NextResponse.json(
      { success: false, error: failureReason },
      { status: 400 },
    );
  } catch (error) {
    console.error("Server Error during Farcaster Handshake:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
