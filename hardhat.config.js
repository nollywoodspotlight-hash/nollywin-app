import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";

export default {
  solidity: "0.8.28",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
  },
  networks: {
    "base-sepolia": {
      type: "http",
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
