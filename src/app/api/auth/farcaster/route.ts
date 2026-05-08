import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature, nonce } = body;

    // 1. Detect the host accurately.
    // Vercel uses x-forwarded-host to pass the actual domain (nollywin-app.vercel.app)
    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "nollywin-app.vercel.app";

    // 2. Clean the host.
    // SIWE/Farcaster verification is strict. We strip the protocol (http/https)
    // and any port numbers (like :3000) to ensure the domain matches the frontend.
    const cleanHost = host.split(":")[0];

    const appClient = createAppClient({
      ethereum: viemConnector(),
    });

    const verifyResult: any = await appClient.verifySignInMessage({
      message,
      signature,
      domain: cleanHost,
      nonce,
    });

    if (verifyResult.success) {
      console.log(
        `Verification Success for ${verifyResult.data?.username} on ${cleanHost}`,
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
