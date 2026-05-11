// src/lib/swap.ts
import { parseUnits } from "viem";

/**
 * NollyWin Swap Engine [Master Spec v2.0]
 * Updates: Forced ETH Address correction & Precise Decimal Sanitization
 */
export async function executeSwap(
  tokenIn: string,
  tokenOut: string,
  amountEth: string,
  walletAddress: string,
) {
  try {
    // MASTER DEV FIX 1: Force Native ETH Identifier
    // 1inch requires exactly 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for Base ETH
    const NATIVE_ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    // If the input is "ETH" or an empty/null address, we correct it to the 1inch standard
    const sanitizedTokenIn =
      tokenIn.toLowerCase() === "eth" ||
      !tokenIn ||
      tokenIn.startsWith("0x0000000000000000000000000000000000000000")
        ? NATIVE_ETH
        : tokenIn;

    // MASTER DEV FIX 2: Bulletproof Decimal Formatting
    // We trim the string and ensure it's a valid number so parseUnits doesn't fail
    const cleanAmount = amountEth.toString().trim();

    // Logic 2.1: 18 Decimal Precision (Wei)
    // This turns "0.0001" into exactly "100000000000000"
    const amountInWei = parseUnits(cleanAmount, 18).toString();

    console.log(
      `🛠️ PROD DEBUG: Swapping ${cleanAmount} ETH (${amountInWei} Wei)`,
    );
    console.log(`🛠️ PROD DEBUG: From: ${sanitizedTokenIn} To: ${tokenOut}`);

    // 2. 1inch V6.0 API URL for Base Network (Chain ID: 8453)
    const queryParams = new URLSearchParams({
      src: sanitizedTokenIn,
      dst: tokenOut,
      amount: amountInWei,
      from: walletAddress,
      slippage: "2", // 2% Slippage protection [Spec 2.0]
      disableEstimate: "false",
    });

    const url = `https://api.1inch.dev/swap/v6.0/8453/swap?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // 3. Logic 14.0: Validation
    if (response.ok && data.tx) {
      console.log("🚀 SUCCESS: Swap Route Found");
      return {
        success: true,
        tx: data.tx,
        displayAmount: data.toAmount,
      };
    } else {
      // 4. Stall Protection (Spec 15.0)
      const errorMsg =
        data.description || data.message || "Insufficient Liquidity or Balance";
      console.error(`❌ SWAP FAILED: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error: any) {
    console.error("❌ CRITICAL: Swap Logic Error", error.message);
    return { success: false, error: "Network or Formatting Error" };
  }
}
