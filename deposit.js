import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const contractAddress =
    process.env.CONTRACT_ADDRESS ??
    "0xE7D6A6Fd809CFd428C321e88611aCEe6480121d0";
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const code = await provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No contract found at ${contractAddress}.`);
  }

  // Verification check for NollyWin bytecode
  if (!code.includes("7bcd792f")) {
    throw new Error(
      "The contract at this address does not appear to be NollyWin. Please update CONTRACT_ADDRESS in .env.",
    );
  }

  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  const depositValue = ethers.parseEther("0.001");
  const gasBuffer = ethers.parseEther("0.005"); // Standard buffer for gas

  // Fixed Ethers v6 comparison: use < and + instead of .lt() and .add()
  if (balance < depositValue + gasBuffer) {
    throw new Error(
      "Insufficient wallet balance for the deposit and estimated gas. Add more ETH to the wallet.",
    );
  }

  // Load the contract ABI
  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/src/contracts/NollyWin.sol/NollyWin.json",
      "utf8",
    ),
  );

  const nollyWin = new ethers.Contract(contractAddress, artifact.abi, wallet);

  console.log("🚀 Starting a Test Strategy...");

  // Sending 0.001 ETH to the contract
  // Note: Using the zero address as referrer for this test
  const tx = await nollyWin.startStrategy(
    "0x0000000000000000000000000000000000000000",
    {
      value: depositValue,
    },
  );

  console.log("Transaction Sent! Waiting for confirmation...");
  await tx.wait();
  console.log("✅ Strategy Started! Your first Strategy is now ACTIVE.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
