import fs from "fs";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
const artifact = JSON.parse(
  fs.readFileSync(
    "./artifacts/src/contracts/NollyWin.sol/NollyWin.json",
    "utf8",
  ),
);
const contract = new ethers.Contract(
  "0x19094c1b7Bae2244DE384f4230299fDcB9d516aA",
  artifact.abi,
  provider,
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  console.log(
    "code:",
    await provider.getCode(contract.address).then((c) => c.slice(0, 66)),
  );
  console.log(
    "balance:",
    await provider
      .getBalance(wallet.address)
      .then((b) => ethers.formatEther(b)),
  );
  try {
    console.log("owner", await contract.owner());
  } catch (e) {
    console.error("owner err", e.message);
  }
  try {
    console.log("treasury", await contract.treasuryWallet());
  } catch (e) {
    console.error("treasury err", e.message);
  }
  try {
    console.log("next", (await contract.nextStrategyId()).toString());
  } catch (e) {
    console.error("next err", e.message);
  }
}

main().catch(console.error);
