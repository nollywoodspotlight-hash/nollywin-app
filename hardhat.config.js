import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
import { resolve } from "path";

// Correctly load the .env.local file
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

export default {
  solidity: "0.8.28",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
  },
  networks: {
    "base-sepolia": {
      type: "http", // This is the 'discriminator' it was looking for
      url: "https://sepolia.base.org",
      accounts: [
        process.env.PRIVATE_KEY
          ? process.env.PRIVATE_KEY.startsWith("0x")
            ? process.env.PRIVATE_KEY
            : `0x${process.env.PRIVATE_KEY}`
          : "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  },
};
