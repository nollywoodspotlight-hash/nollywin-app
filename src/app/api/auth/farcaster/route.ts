import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Farcaster Handshake Received:", data);

    return NextResponse.json({
      success: true,
      message: "NollyWin API: Farcaster Handshake Success",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
