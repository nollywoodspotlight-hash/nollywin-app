import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress =
    process.env.CONTRACT_ADDRESS ??
    "0x19094c1b7Bae2244DE384f4230299fDcB9d516aA";

  const code = await provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No contract found at ${contractAddress}.`);
  }
  if (!code.includes("7bcd792f")) {
    throw new Error(
      "The contract at this address does not appear to be NollyWin. Please update CONTRACT_ADDRESS in .env.",
    );
  }

  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/src/contracts/NollyWin.sol/NollyWin.json",
      "utf8",
    ),
  );
  const nollyWin = new ethers.Contract(contractAddress, artifact.abi, wallet);

  console.log("🛠️ Attempting to fix Treasury...");

  try {
    const tx = await nollyWin.updateTreasury(
      "0xeE4363363467F61705a576d22C8a94E95bcf6727",
    );
    console.log("Transaction Sent! Hash:", tx.hash);
    await tx.wait();
    console.log("✅ Treasury Updated Successfully!");
  } catch (error) {
    console.error(
      "❌ Failed to update treasury:",
      error.reason || error.message,
    );
  }
}

main().catch(console.error);
