// ===== test/BIDRegistry.test.js =====
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BIDRegistry", function () {
  let bidRegistry;
  let owner;
  let issuer;
  let user;
  let addr1;

  beforeEach(async function () {
    [owner, issuer, user, addr1] = await ethers.getSigners();

    const BIDRegistry = await ethers.getContractFactory("BIDRegistry");
    bidRegistry = await BIDRegistry.deploy();
    await bidRegistry.waitForDeployment();
  });

  it("Should deploy with correct initial state", async function () {
    expect(await bidRegistry.owner()).to.equal(owner.address);
    expect(await bidRegistry.authorizedIssuers(owner.address)).to.be.true;
  });

  describe("BID Issuance with Age Commitment", function () {
    it("Should issue BID with age commitment successfully", async function () {
      const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Test User|123|1990-01-01"));
      const metadataHash = "QmTestHash";

      // Create age commitment: hash(age || nonce)
      const age = 25;
      const nonce = ethers.randomBytes(32);
      const ageCommitment = ethers.keccak256(ethers.solidityPacked(["uint256", "bytes32"], [age, nonce]));

      await expect(
        bidRegistry.issueBID(user.address, hashedInfo, metadataHash, ageCommitment)
      ).to.emit(bidRegistry, "BIDIssued");

      const isValid = await bidRegistry.isBIDValid(user.address);
      expect(isValid).to.be.true;

      const bidData = await bidRegistry.getBID(user.address);
      expect(bidData.ageCommitment).to.equal(ageCommitment);
    });
  });

  describe("Age Verification (ZKP)", function () {
    let age, nonce, ageCommitment;

    beforeEach(async function () {
      // Setup: Issue BID with age commitment
      const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Adult User|456|1995-05-15"));
      age = 28;
      nonce = ethers.randomBytes(32);
      ageCommitment = ethers.keccak256(ethers.solidityPacked(["uint256", "bytes32"], [age, nonce]));

      await bidRegistry.issueBID(user.address, hashedInfo, "QmHash", ageCommitment);
    });

    it("Should verify correct age with valid proof", async function () {
      const isValid = await bidRegistry.verifyAge(user.address, age, nonce);
      expect(isValid).to.be.true;
    });

    it("Should reject incorrect age proof", async function () {
      const wrongAge = 30;
      const isValid = await bidRegistry.verifyAge(user.address, wrongAge, nonce);
      expect(isValid).to.be.false;
    });

    it("Should verify user is adult (>= 18)", async function () {
      const tx = await bidRegistry.verifyIsAdult(user.address, age, nonce);
      const receipt = await tx.wait();

      // Check event was emitted with correct values
      const event = receipt.logs.find(log => {
        try {
          return bidRegistry.interface.parseLog(log).name === 'AgeVerified';
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      const parsedEvent = bidRegistry.interface.parseLog(event);
      expect(parsedEvent.args.user).to.equal(user.address);
      expect(parsedEvent.args.isAdult).to.be.true;
    });

    it("Should reject adult verification with wrong proof", async function () {
      const wrongNonce = ethers.randomBytes(32);
      await expect(
        bidRegistry.verifyIsAdult(user.address, age, wrongNonce)
      ).to.be.revertedWith("Invalid age proof");
    });

    it("Should correctly identify minor (< 18)", async function () {
      // Issue new BID for minor
      const minorAge = 16;
      const minorNonce = ethers.randomBytes(32);
      const minorCommitment = ethers.keccak256(ethers.solidityPacked(["uint256", "bytes32"], [minorAge, minorNonce]));

      await bidRegistry.issueBID(addr1.address, ethers.keccak256(ethers.toUtf8Bytes("Minor")), "QmMinor", minorCommitment);

      const result = await bidRegistry.verifyIsAdult.staticCall(addr1.address, minorAge, minorNonce);
      expect(result).to.be.false;
    });
  });

  describe("Revocation and Re-enable", function () {
    beforeEach(async function () {
      const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Test User|789|1992-08-10"));
      const ageCommitment = ethers.keccak256(ethers.solidityPacked(["uint256", "bytes32"], [30, ethers.randomBytes(32)]));
      await bidRegistry.issueBID(user.address, hashedInfo, "QmHash3", ageCommitment);
    });

    it("Should revoke BID successfully", async function () {
      await expect(
        bidRegistry.revokeBID(user.address)
      ).to.emit(bidRegistry, "BIDRevoked");

      const isValid = await bidRegistry.isBIDValid(user.address);
      expect(isValid).to.be.false;

      const bidData = await bidRegistry.getBID(user.address);
      expect(bidData.revocationTimestamp).to.be.greaterThan(0);
    });

    it("Should re-enable revoked BID (owner only)", async function () {
      // Revoke first
      await bidRegistry.revokeBID(user.address);
      expect(await bidRegistry.isBIDValid(user.address)).to.be.false;

      // Re-enable
      await expect(
        bidRegistry.reEnableBID(user.address)
      ).to.emit(bidRegistry, "BIDReEnabled");

      const isValid = await bidRegistry.isBIDValid(user.address);
      expect(isValid).to.be.true;

      const bidData = await bidRegistry.getBID(user.address);
      expect(bidData.revocationTimestamp).to.equal(0);
    });

    it("Should prevent non-owner from re-enabling BID", async function () {
      await bidRegistry.revokeBID(user.address);

      await expect(
        bidRegistry.connect(issuer).reEnableBID(user.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should prevent re-enabling already active BID", async function () {
      await expect(
        bidRegistry.reEnableBID(user.address)
      ).to.be.revertedWith("BID is already active");
    });
  });

  describe("Authorized Issuers", function () {
    it("Should allow adding authorized issuers", async function () {
      await expect(
        bidRegistry.addAuthorizedIssuer(issuer.address)
      ).to.emit(bidRegistry, "IssuerAdded");

      expect(await bidRegistry.authorizedIssuers(issuer.address)).to.be.true;
    });

    it("Should allow authorized issuer to issue BID", async function () {
      await bidRegistry.addAuthorizedIssuer(issuer.address);

      const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Another User|456|1985-12-25"));
      const ageCommitment = ethers.keccak256(ethers.solidityPacked(["uint256", "bytes32"], [38, ethers.randomBytes(32)]));

      await expect(
        bidRegistry.connect(issuer).issueBID(user.address, hashedInfo, "QmHash2", ageCommitment)
      ).to.emit(bidRegistry, "BIDIssued");
    });
  });
});