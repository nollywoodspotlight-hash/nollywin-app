"use client";

import { useSignTypedData, useAccount } from "wagmi";

// This matches the EIP-712 standard for NollyWin
const domain = {
  name: "NollyWin",
  version: "1",
  chainId: 84532, // Base Sepolia
} as const;

const types = {
  ReferralClaim: [
    { name: "referrerFID", type: "uint256" },
    { name: "refereeAddress", type: "address" },
  ],
} as const;

export function useReferralSignature() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const createSignature = async (referrerFID: number) => {
    if (!address) throw new Error("Wallet not connected");

    try {
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "ReferralClaim",
        message: {
          referrerFID: BigInt(referrerFID),
          refereeAddress: address,
        },
      });

      return signature;
    } catch (error) {
      console.error("Signature failed:", error);
      return null;
    }
  };

  return { createSignature };
}
