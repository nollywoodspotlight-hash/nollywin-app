import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature, nonce } = body;

    // Dynamically get the domain from the request headers
    // This handles localhost, nollywin-app.vercel.app, and nollywin.app automatically
    const host = req.headers.get("host") || "nollywin-app.vercel.app";

    const appClient = createAppClient({
      ethereum: viemConnector(),
    });

    const verifyResult: any = await appClient.verifySignInMessage({
      message,
      signature,
      domain: host, // Matches the domain detected by the frontend
      nonce,
    });

    if (verifyResult.success) {
      console.log(
        `Verification Success for ${verifyResult.data?.username} on ${host}`,
      );
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
