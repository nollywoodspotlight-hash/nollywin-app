import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const contractAddress =
    process.env.CONTRACT_ADDRESS ??
    "0x19094c1b7Bae2244DE384f4230299fDcB9d516aA";

  const code = await provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No contract found at ${contractAddress}.`);
  }
  if (!code.includes("7bcd792f")) {
    console.warn(
      "WARNING: The contract at this address may not be NollyWin. Please verify CONTRACT_ADDRESS in .env.",
    );
  }

  // Load the contract ABI
  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/src/contracts/NollyWin.sol/NollyWin.json",
      "utf8",
    ),
  );

  const nollyWin = new ethers.Contract(contractAddress, artifact.abi, provider);

  console.log("--- NOLLYWIN DIAGNOSTIC START ---");

  try {
    // Attempt to fetch all critical state variables
    const owner = await nollyWin.owner();
    const treasury = await nollyWin.treasuryWallet();
    const nextId = await nollyWin.nextStrategyId();

    console.log("CONTRACT OWNER:   ", owner);
    console.log("TREASURY WALLET:  ", treasury);
    console.log("NEXT STRATEGY ID: ", nextId.toString());

    if (treasury === "0x0000000000000000000000000000000000000000") {
      console.log(
        "\n⚠️  CRITICAL WARNING: Treasury is set to the Zero Address!",
      );
      console.log(
        "This will cause all contract functions involving fees to REVERT.",
      );
    }
  } catch (error) {
    console.log("Primary fetch failed. Checking individual properties...");

    // Fallback: Check Owner
    try {
      const owner = await nollyWin.owner();
      console.log("CONTRACT OWNER: ", owner);
    } catch (e) {
      console.log("Error fetching owner: ", e.message);
    }

    // Fallback: Check Treasury
    try {
      const treasury = await nollyWin.treasuryWallet();
      console.log("TREASURY WALLET:", treasury);
    } catch (e) {
      console.log("Error fetching treasury: ", e.message);
    }
  }
  console.log("--- NOLLYWIN DIAGNOSTIC END ---");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
