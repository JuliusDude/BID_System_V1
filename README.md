# BID System (Blockchain Identity Document System)

A decentralized identity verification system that enables users to verify their identity using blockchain wallets instead of traditional sensitive documents like Aadhaar cards. This system provides a secure, privacy-focused approach to identity management on the blockchain.

<img width="500" height="300" alt="image" src="https://github.com/user-attachments/assets/6341a95c-702b-4767-ada8-a3c9ba8ccd99" /> <img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/82d11160-3fa7-4870-95d6-67b62e5f299b" />

## 🎯 Overview

The BID System allows authorized issuers to issue and manage digital identities on the blockchain. Instead of sharing sensitive personal documents, users can verify their identity through their blockchain wallets, providing enhanced privacy and security.

### Our Team
#### ->[Julius](https://github.com/JuliusDude) ->[Abhishan](https://github.com/falconishere) ->[Nevan](https://github.com/NCRTHUNDER) ->[Shamith](https://github.com/shamithgowda7) ->[Tenzin]()
### Key Features

- **Decentralized Identity Management**: Issue and revoke digital identities on-chain
- **Privacy-Focused**: Stores only hashed personal information, not raw sensitive data
- **Role-Based Access Control**: Separate roles for owners, issuers, and users
- **Dual Interface**: Dedicated portals for issuers and verifiers
- **Multi-Network Support**: Deployable on Polygon Amoy testnet or local Hardhat network

### System Components

- **Issuer Portal** (`frontend/issuer.html`): For authorized entities to manage BIDs (issue and revoke)
- **Verifier Portal** (`frontend/verifier.html`): Read-only interface to check BID status
- **BIDRegistry Smart Contract**: Core blockchain component managing identity data

## 🏗 Architecture

The system consists of three main layers:

1. **Smart Contract Layer**: BIDRegistry.sol manages identity data and access control
2. **Backend Layer**: Node.js scripts for deployment and interaction
3. **Frontend Layer**: Web interfaces for issuers and verifiers

### Smart Contract Structure

The `BIDRegistry` contract stores BID data with the following structure:

```solidity
struct BIDData {
    bytes32 hashedPersonalInfo;  // Hashed personal information (privacy)
    address issuer;              // Address of the issuing entity
    uint256 timestamp;           // Issue timestamp
    bool isValid;               // Current validity status
    string metadataHash;        // Hash of additional off-chain metadata
}
```

### Role Management

- **Owner**: Contract deployer with full administrative privileges
  - Add/remove authorized issuers
  - Revoke any BID
  - Transfer ownership

- **Authorized Issuers**: Government entities or authorized organizations
  - Issue new BIDs
  - Revoke BIDs they issued

- **Users**: Identity holders who can be verified through their BIDs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Test ETH for gas fees (when using testnets)

### Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/JuliusDude/BID_System_V1.git
cd BID_System_V1
npm install
```

2. For testnet deployment, create a `.env` file:
```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_KEY
```

**Note**: Local development (compile, test, local node) doesn't require `.env` configuration.

### Development Workflow

1. **Compile contracts**:
```bash
npm run compile
```

2. **Run tests**:
```bash
npm test
```

3. **Start local blockchain**:
```bash
npm run node
```

4. **Deploy locally**:
```bash
npm run deploy:local
```

5. **Deploy to Polygon Amoy testnet**:
```bash
npm run deploy
```

6. **Serve frontend**:
```bash
npm run serve:frontend
```

### Accessing the Application

After serving the frontend, access:

- **Issuer Portal**: `http://localhost:8080/issuer.html`
- **Verifier Portal**: `http://localhost:8080/verifier.html`

## 📱 User Guide

### For Issuers (Government/Authorized Entities)

1. **Setup**:
   - Connect MetaMask wallet
   - Switch to the appropriate network (Polygon Amoy or local)
   - Load contract address using "Auto-Load from Deployment" or paste manually

2. **Issue BID**:
   - Enter user's wallet address
   - Provide personal information hash
   - Add optional metadata hash
   - Submit transaction

3. **Revoke BID**:
   - Enter user's wallet address
   - Confirm revocation transaction

### For Verifiers

1. **Setup**:
   - Connect MetaMask wallet (read-only access)
   - Load contract address

2. **Verify Identity**:
   - Enter single wallet address for individual verification
   - Or use batch verification for multiple addresses
   - View BID status, issuer information, and timestamps

## 🔧 Configuration

### Network Configuration

The project supports multiple networks configured in `hardhat.config.js`:

- **Local Hardhat Network**: For development and testing
- **Polygon Amoy Testnet**: For testnet deployment

### Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `PRIVATE_KEY` | Deployer wallet private key | Testnet deployment |
| `ALCHEMY_AMOY_URL` | Alchemy RPC endpoint | Testnet deployment |
| `POLYGONSCAN_API_KEY` | Polygonscan API key | Contract verification |

## 🧪 Testing

The project includes comprehensive tests in `test/BIDRegistry.test.js`:

```bash
npm test
```

Tests cover:
- BID issuance and revocation
- Access control mechanisms
- Event emission
- Edge cases and error conditions

## 📁 Project Structure

```
BID_SYSTEM_V1/
├── contracts/
│   └── BIDRegistry.sol          # Core smart contract
├── frontend/
│   ├── issuer.html             # Issuer interface
│   ├── verifier.html           # Verifier interface
│   └── contract-info.json      # Auto-generated contract info
├── scripts/
│   ├── deploy.js               # Deployment script
│   ├── interact.js             # Contract interaction utilities
│   └── serve-frontend.js       # Frontend server
├── test/
│   └── BIDRegistry.test.js     # Test suite
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies and scripts
└── .env                        # Environment variables (create manually)
```

## 🔐 Security Features

- **Hashed Personal Information**: Sensitive data is hashed before storage
- **Role-Based Access Control**: Multiple permission levels
- **Event Logging**: All actions are logged via blockchain events
- **Ownership Transfer**: Secure ownership management
- **Input Validation**: Comprehensive validation of all inputs

## 🌐 Deployment Networks

### Polygon Amoy Testnet
- **Network ID**: 80002
- **RPC URL**: Configure in `.env`
- **Explorer**: [PolygonScan Amoy](https://amoy.polygonscan.com/)

### Local Hardhat Network
- **Network ID**: 31337
- **RPC URL**: http://localhost:8545
- **Use Case**: Development and testing

## 🛠 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Compile | `npm run compile` | Compile smart contracts |
| Test | `npm test` | Run test suite |
| Local Node | `npm run node` | Start local blockchain |
| Deploy Local | `npm run deploy:local` | Deploy to local network |
| Deploy Testnet | `npm run deploy` | Deploy to Polygon Amoy |
| Serve Frontend | `npm run serve:frontend` | Start frontend server |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Important Notes

- **Owner Privileges**: Only the contract owner can add authorized issuers
- **Issuer Authorization**: After ownership transfer, the new owner must be explicitly authorized as an issuer if needed
- **Privacy**: The system stores only hashed personal information, never raw sensitive data
- **Gas Costs**: Consider gas optimization for large-scale deployments
