// src/lib/swap.ts
import { parseUnits } from "viem";

/**
 * NollyWin Swap Engine [Master Spec v2.0]
 * Uses 1inch Aggregation V6 to find the best route on Base.
 */
export async function executeSwap(
  tokenIn: string, // Native ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  tokenOut: string, // The Memecoin Contract Address
  amountEth: string, // Example: "0.01"
  walletAddress: string, // Your wallet address (from useAccount)
) {
  // 1. Logic 2.1: Use 18 decimal precision (wei)
  // We use parseUnits to ensure "0.01" becomes "10000000000000000"
  const amountInWei = parseUnits(amountEth, 18).toString();

  // 2. 1inch V6.0 API URL for Base Network (Chain ID: 8453)
  // We use 'src' and 'dst' as required by the latest documentation
  const queryParams = new URLSearchParams({
    src: tokenIn,
    dst: tokenOut,
    amount: amountInWei,
    from: walletAddress,
    slippage: "2", // 2% Slippage protection [Spec 2.0]
    disableEstimate: "false", // Ensures the trade is actually possible before returning data
  });

  const url = `https://api.1inch.dev/swap/v6.0/8453/swap?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // 3. Logic 14.0: Definition of Done / Validation
    if (response.ok && data.tx) {
      console.log("🚀 SUCCESS: Swap Route Found via 1inch");
      console.log(
        `📡 Route: ${tokenIn.slice(0, 6)}... -> ${tokenOut.slice(0, 6)}...`,
      );

      // Return the transaction object for the wallet to sign
      return {
        success: true,
        tx: data.tx, // This contains { to, data, value, gasPrice }
        displayAmount: data.toAmount, // How many memecoins you'll get
      };
    } else {
      // 4. Stall Protection (Spec 15.0)
      const errorMsg =
        data.description || data.message || "Insufficient Liquidity";
      console.error(`❌ SWAP FAILED: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error("❌ CRITICAL: Network or API failure");
    return { success: false, error: "Network Error" };
  }
}
