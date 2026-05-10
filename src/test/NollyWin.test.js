const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NollyWin Contract", function () {
  let NollyWin;
  let nollyWin;
  let owner;
  let addr1;

  // This "beforeEach" runs before every single test to give us a fresh start
  beforeEach(async function () {
    // Get the contract factory and signers (accounts)
    NollyWin = await ethers.getContractFactory("NollyWin");
    [owner, addr1] = await ethers.getSigners();

    // Deploy the contract
    nollyWin = await NollyWin.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await nollyWin.owner()).to.equal(owner.address);
    });

    it("Should have a valid contract address", async function () {
      expect(nollyWin.address).to.not.be.undefined;
      console.log("       Contract deployed to:", nollyWin.address);
    });
  });

  describe("Task 6.4 — Edge Case: Safety Checks", function () {
    it("Should fail (revert) if a user tries to deposit 0 ETH", async function () {
      // We use addr1 to simulate a regular user, not the owner
      await expect(
        nollyWin.connect(addr1).deposit({ value: 0 }),
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });
});
