const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting BID Registry deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  const network = await ethers.provider.getNetwork();

  console.log("📋 Deployment Details:");
  console.log("Deployer address:", deployerAddress);
  console.log("Deployer balance:", ethers.formatEther(balance), "MATIC");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("");

  // Check minimum balance
  const minBalance = ethers.parseEther("0.01"); // 0.01 MATIC minimum
  if (balance < minBalance) {
    console.error("❌ Insufficient balance! Need at least 0.01 MATIC for deployment");
    console.log("💰 Get test MATIC from: https://faucet.polygon.technology/");
    process.exit(1);
  }

  // Get contract factory
  console.log("📄 Preparing BIDRegistry contract...");
  const BIDRegistry = await ethers.getContractFactory("BIDRegistry");
  console.log("");

  // Deploy the contract
  console.log("📤 Deploying BIDRegistry contract...");
  const bidRegistry = await BIDRegistry.deploy();
  
  // Wait for deployment
  console.log("⏳ Waiting for deployment confirmation...");
  await bidRegistry.waitForDeployment();
  const contractAddress = await bidRegistry.getAddress();
  
  console.log("✅ BIDRegistry deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 View on PolygonScan:", `https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log("");

  // Verify deployer is owner and authorized issuer
  const owner = await bidRegistry.owner();
  const isAuthorizedIssuer = await bidRegistry.authorizedIssuers(deployerAddress);
  
  console.log("🔐 Contract Configuration:");
  console.log("Owner:", owner);
  console.log("Deployer is authorized issuer:", isAuthorizedIssuer);
  console.log("");

  // Test basic functionality
  console.log("🧪 Testing basic functionality...");
  
  // Generate test data
  const testUserAddress = "0x742d35Cc6634C0532925a3b8D8C1C1b2c0b7c4d5";
  const testHash = ethers.keccak256(ethers.toUtf8Bytes("John Doe|12345|1990-01-01"));
  const testMetadata = "QmTestHash123ABCDemoIPFSHash"; // IPFS hash simulation
  
  try {
    // Issue a test BID
    console.log("📝 Issuing test BID...");
    const issueTx = await bidRegistry.issueBID(testUserAddress, testHash, testMetadata);
    const receipt = await issueTx.wait();
    console.log("✅ Test BID issued successfully!");
    console.log("📄 Transaction hash:", receipt.hash);
    
    // Check if BID is valid
    const isValid = await bidRegistry.isBIDValid(testUserAddress);
    console.log("🔍 BID validity check:", isValid);
    
    // Get BID details
    const bidDetails = await bidRegistry.getBID(testUserAddress);
    console.log("📋 BID Details:");
    console.log("  Issuer:", bidDetails.issuer);
    console.log("  Timestamp:", new Date(Number(bidDetails.timestamp) * 1000).toLocaleString());
    console.log("  Valid:", bidDetails.isValid);
    console.log("  Metadata Hash:", bidDetails.metadataHash);
    
  } catch (error) {
    console.log("⚠️  Test failed:", error.message);
  }

  console.log("");

  // Save deployment information for frontend
  console.log("💾 Saving deployment info for frontend...");
  
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name || "amoy",
    chainId: Number(network.chainId),
    deployer: deployerAddress,
    deploymentTime: new Date().toISOString(),
    deploymentBlock: await ethers.provider.getBlockNumber(),
    polygonScanUrl: `https://amoy.polygonscan.com/address/${contractAddress}`,
    contractABI: [
      "function issueBID(address user, bytes32 hashedPersonalInfo, string memory metadataHash) external",
      "function getBID(address user) external view returns (tuple(bytes32,address,uint256,bool,string))",
      "function isBIDValid(address user) external view returns (bool)",
      "function revokeBID(address user) external",
      "function owner() external view returns (address)",
      "function authorizedIssuers(address) external view returns (bool)",
      "event BIDIssued(address indexed user, address indexed issuer, bytes32 hashedPersonalInfo, string metadataHash, uint256 timestamp)",
      "event BIDRevoked(address indexed user, address indexed issuer, uint256 timestamp)"
    ]
  };

  // Ensure frontend directory exists
  const frontendDir = path.join(__dirname, "../frontend");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Write deployment info
  const deploymentPath = path.join(frontendDir, "contract-info.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("✅ Contract info saved to:", deploymentPath);
  console.log("");

  // Final summary
  console.log("🎉 =================================");
  console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("🎉 =================================");
  console.log("");
  console.log("📝 Important Information:");
  console.log("🏛️  Government Issuer Address:", deployerAddress);
  console.log("📄 Contract Address:", contractAddress);
  console.log("🌐 Network: Polygon Amoy Testnet");
  console.log("🔗 PolygonScan:", `https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log("");
  console.log("🔧 Next Steps:");
  console.log("1. Update frontend/contract-info.json with your contract address");
  console.log("2. Test issuer.html and verifier.html");
  console.log("3. Deploy to production when ready");
  console.log("");
  console.log("💡 Pro Tip: Keep your deployer private key safe - it's your government issuer key!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });