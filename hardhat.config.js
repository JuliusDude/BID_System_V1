// ===== hardhat.config.js =====
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, ALCHEMY_AMOY_URL, POLYGONSCAN_API_KEY } = process.env;
const isValidPrivateKey = typeof PRIVATE_KEY === 'string' && /^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY);

// Validate .env only when targeting Amoy network to avoid blocking local tasks
const argvJoined = process.argv.join(" ");
const isAmoyTarget = process.env.HARDHAT_NETWORK === "amoy" || argvJoined.includes("--network amoy");
if (isAmoyTarget && (!PRIVATE_KEY || !ALCHEMY_AMOY_URL)) {
  console.error("❌ Error: Please set PRIVATE_KEY and ALCHEMY_AMOY_URL in .env file for Amoy deployments");
  console.log("📝 Create a .env file with:");
  console.log("PRIVATE_KEY=your_wallet_private_key");
  console.log("ALCHEMY_AMOY_URL=your_alchemy_amoy_endpoint");
  console.log("POLYGONSCAN_API_KEY=your_polygonscan_api_key");
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
    },
    // Local node for testing
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // Polygon Amoy Testnet
    amoy: {
      url: ALCHEMY_AMOY_URL,
      // Only supply accounts if PRIVATE_KEY is a valid 32-byte hex
      accounts: isValidPrivateKey ? [PRIVATE_KEY] : [],
      chainId: 80002,
      gasPrice: 30000000000, // 30 gwei
      timeout: 120000, // 2 minutes timeout for rate limit issues
      // Add retry configuration for rate limits
      retry: {
        retries: 3,
        delay: 2000, // 2 seconds between retries
      },
      // Add request configuration
      http: {
        timeout: 120000,
        retries: 3,
        retryDelay: 2000,
      }
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};