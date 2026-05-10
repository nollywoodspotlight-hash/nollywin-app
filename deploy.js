import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("----------------------------------------------------");
  console.log("🎬  NollyWin Production: Starting Deployment...");
  console.log(`🎬  Director (Deployer): ${wallet.address}`);

  // Checking gas money
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰  Production Budget: ${ethers.formatEther(balance)} ETH`);
  console.log("----------------------------------------------------");

  // Load artifact
  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/src/contracts/NollyWin.sol/NollyWin.json",
      "utf8",
    ),
  );
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet,
  );

  console.log("🎥  Action! Deploying to Base Sepolia...");

  // Using your deployer address as the initial treasury wallet
  const treasuryAddress = wallet.address;
  const contract = await factory.deploy(treasuryAddress);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("----------------------------------------------------");
  console.log("✅  THAT'S A WRAP!");
  console.log(`🚀  NollyWin is LIVE at: ${address}`);
  console.log(`🏦  Treasury set to: ${treasuryAddress}`);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌  Script Crashed:");
    console.error(error);
    process.exit(1);
  });
