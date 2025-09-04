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

  it("Should issue BID successfully", async function () {
    const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Test User|123|1990-01-01"));
    const metadataHash = "QmTestHash";
    
    await expect(
      bidRegistry.issueBID(user.address, hashedInfo, metadataHash)
    ).to.emit(bidRegistry, "BIDIssued");
    
    const isValid = await bidRegistry.isBIDValid(user.address);
    expect(isValid).to.be.true;
  });

  it("Should allow adding authorized issuers", async function () {
    await expect(
      bidRegistry.addAuthorizedIssuer(issuer.address)
    ).to.emit(bidRegistry, "IssuerAdded");
    
    expect(await bidRegistry.authorizedIssuers(issuer.address)).to.be.true;
  });

  it("Should allow authorized issuer to issue BID", async function () {
    // Add issuer
    await bidRegistry.addAuthorizedIssuer(issuer.address);
    
    // Issue BID from new issuer
    const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Another User|456|1985-12-25"));
    
    await expect(
      bidRegistry.connect(issuer).issueBID(user.address, hashedInfo, "QmHash2")
    ).to.emit(bidRegistry, "BIDIssued");
  });

  it("Should revoke BID successfully", async function () {
    // Issue BID first
    const hashedInfo = ethers.keccak256(ethers.toUtf8Bytes("Test User|789|1992-08-10"));
    await bidRegistry.issueBID(user.address, hashedInfo, "QmHash3");
    
    // Revoke BID
    await expect(
      bidRegistry.revokeBID(user.address)
    ).to.emit(bidRegistry, "BIDRevoked");
    
    const isValid = await bidRegistry.isBIDValid(user.address);
    expect(isValid).to.be.false;
  });
});