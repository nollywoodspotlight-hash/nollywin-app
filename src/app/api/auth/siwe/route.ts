import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate a simple nonce for now
    const nonce = Math.random().toString(36).substring(2, 15);
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error("SIWE nonce generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();

    // Basic validation
    if (!message || !signature) {
      return NextResponse.json(
        { error: "Missing message or signature" },
        { status: 400 },
      );
    }

    // For now, just log and accept - in production you'd verify the SIWE message
    console.log("SIWE verification request:", { message, signature });

    // TODO: Implement proper SIWE verification using viem/siwe
    // const siweMessage = parseSiweMessage(message);
    // const valid = await verifySiweMessage(siweMessage, signature);

    return NextResponse.json({
      success: true,
      message: "SIWE verification successful",
    });
  } catch (error) {
    console.error("SIWE verification error:", error);
    return NextResponse.json(
      { error: "SIWE verification failed" },
      { status: 500 },
    );
  }
}
