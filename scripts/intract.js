// ===== scripts/interact.js (For Testing) =====
const { ethers } = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
  
  const [deployer] = await ethers.getSigners();
  const BIDRegistry = await ethers.getContractFactory("BIDRegistry");
  const contract = BIDRegistry.attach(CONTRACT_ADDRESS);
  
  console.log("🔗 Connected to BIDRegistry at:", CONTRACT_ADDRESS);
  console.log("👤 Using account:", await deployer.getAddress());
  console.log("");
  
  // Test issuing a BID
  const testUser = "0x742d35Cc6634C0532925a3b8D8C1C1b2c0b7c4d5";
  const personalInfoHash = ethers.keccak256(ethers.toUtf8Bytes("Jane Smith|67890|1995-05-15"));
  const metadataHash = "QmExampleIPFSHash456";
  
  console.log("📝 Issuing BID for test user...");
  const tx = await contract.issueBID(testUser, personalInfoHash, metadataHash);
  await tx.wait();
  console.log("✅ BID issued! Transaction:", tx.hash);
  
  // Check verification
  const isValid = await contract.isBIDValid(testUser);
  console.log("🔍 BID validation result:", isValid);
  
  // Get details
  const details = await contract.getBID(testUser);
  console.log("📋 BID Details:");
  console.log("  Issuer:", details.issuer);
  console.log("  Issued at:", new Date(Number(details.timestamp) * 1000).toLocaleString());
  console.log("  Valid:", details.isValid);
  console.log("  Metadata:", details.metadataHash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

