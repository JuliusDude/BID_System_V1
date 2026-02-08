# BID System (Blockchain Identity Document System)

A decentralized identity verification system that enables users to verify their identity using blockchain wallets instead of traditional sensitive documents like Aadhaar cards. This system provides a secure, privacy-focused approach to identity management on the blockchain with **Zero-Knowledge Proof** capabilities for privacy-preserving verification.

<img width="1894" height="912" alt="image" src="https://github.com/user-attachments/assets/f386c71b-94e9-43fd-a454-00b935ab3970" />
<img width="1893" height="874" alt="image" src="https://github.com/user-attachments/assets/b4ee6cdc-f4fb-423f-9aa4-53a19daf3690" />

## 🎯 Overview

The BID System allows authorized issuers (government entities) to issue and manage digital identities on the blockchain. Instead of sharing sensitive personal documents, users can verify their identity through their blockchain wallets, providing enhanced privacy and security. The system includes **Zero-Knowledge Proof (ZKP)** technology to prove attributes like age without revealing exact personal information.

### Our Team

#### ->[Julius](https://github.com/JuliusDude) ->[Abhishan](https://github.com/falconishere) ->[Nevan](https://github.com/NCRTHUNDER) ->[Shamith](https://github.com/shamithgowda7) ->[Tenzin]()

### Key Features

- **Decentralized Identity Management**: Issue, revoke, and re-enable digital identities on-chain
- **Privacy-Focused**: Stores only hashed personal information, never raw sensitive data
- **Zero-Knowledge Proofs (ZKP)**: Prove you're 18+ without revealing your exact age
- **QR Code Integration**: Users can generate QR codes for quick identity verification
- **Role-Based Access Control**: Separate roles for owners, issuers, and users
- **Triple Interface**: Dedicated portals for Issuers, Verifiers, and Users
- **BID Re-enablement**: Revoked identities can be restored by the contract owner
- **Multi-Network Support**: Deployable on Polygon Amoy testnet or local Hardhat network

### System Components

| Portal              | File                        | Description                                                                                  |
| ------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| **Issuer Portal**   | `frontend/issuer.html`      | Government dashboard for issuing BIDs, managing issuers, and revoking/re-enabling identities |
| **Verifier Portal** | `frontend/verifier.html`    | Read-only scanner interface to verify BID status by wallet address                           |
| **User Portal**     | `frontend/user.html`        | Personal identity dashboard with QR code generation and ZKP age proof capabilities           |
| **Smart Contract**  | `contracts/BIDRegistry.sol` | Core blockchain component managing identity data, access control, and ZKP verification       |

## 🏗 Architecture

The system consists of three main layers:

1. **Smart Contract Layer**: BIDRegistry.sol manages identity data, access control, and ZKP verification
2. **Backend Layer**: Node.js scripts for deployment and interaction
3. **Frontend Layer**: Modern web interfaces for issuers, verifiers, and users

### Smart Contract Structure

The `BIDRegistry` contract stores BID data with the following structure:

```solidity
struct BIDData {
    bytes32 hashedPersonalInfo;  // Hashed personal information (privacy)
    address issuer;              // Address of the issuing entity
    uint256 timestamp;           // Issue timestamp
    bool isValid;               // Current validity status
    string metadataHash;        // Hash of additional off-chain metadata
    bytes32 ageCommitment;      // Hash commitment for ZKP age verification
    uint256 revocationTimestamp; // When the BID was revoked (0 if active)
}
```

### Role Management

- **Owner**: Contract deployer with full administrative privileges

  - Add/remove authorized issuers
  - Revoke any BID
  - Re-enable revoked BIDs
  - Transfer ownership

- **Authorized Issuers**: Government entities or authorized organizations

  - Issue new BIDs with age commitments
  - Revoke BIDs they issued

- **Users**: Identity holders who can:
  - View their BID status
  - Generate QR codes for verification
  - Create ZKP proofs to verify age (18+)

## 🔐 Zero-Knowledge Proof (ZKP) System

The BID System implements a hash-based Zero-Knowledge Proof mechanism for privacy-preserving age verification:

### How It Works

1. **During BID Issuance**:

   - Issuer enters user's age and generates a secret nonce
   - System creates commitment: `hash(age || nonce)`
   - Only the commitment is stored on-chain

2. **During Age Verification**:
   - User provides age and nonce to the smart contract
   - Contract reconstructs the commitment and verifies it matches
   - Result (adult/minor) is returned WITHOUT revealing exact age

### Privacy Benefits

- ✅ Prove you're 18+ without revealing exact age
- ✅ Nonce acts as a secret key only the user knows
- ✅ Verifiers only see the boolean result
- ✅ Age data never stored on blockchain

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Test MATIC for gas fees (when using testnets)

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

4. **Deploy locally** (in a new terminal):

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

After serving the frontend, access these portals:

| Portal               | URL                                   | Purpose                                  |
| -------------------- | ------------------------------------- | ---------------------------------------- |
| **Issuer (Default)** | `http://localhost:8080/issuer.html`   | Issue and manage BIDs                    |
| **Verifier**         | `http://localhost:8080/verifier.html` | Verify identity status                   |
| **User**             | `http://localhost:8080/user.html`     | View BID, generate QR, create age proofs |

## 📱 User Guide

### For Issuers (Government/Authorized Entities)

1. **Setup**:

   - Connect MetaMask wallet
   - Switch to the appropriate network (Polygon Amoy or local)
   - Load contract address using "Auto-Load from Deployment" or paste manually

2. **Issue BID**:

   - Enter user's wallet address
   - Provide personal information (will be hashed)
   - Add optional IPFS metadata hash
   - Enter user's age for ZKP commitment
   - Click "Generate Nonce" - **IMPORTANT: Give this nonce to the user!**
   - Submit transaction

3. **Revoke BID**:

   - Enter user's wallet address in Identity Checker
   - Click "Revoke Identity"

4. **Re-enable BID** (Owner only):
   - Enter revoked user's wallet address
   - Click "Re-enable Identity"

### For Verifiers

1. **Setup**:

   - Connect MetaMask wallet (read-only access)
   - Load contract address

2. **Verify Identity**:
   - Enter or scan wallet address
   - Click "Verify Identity"
   - View BID status, issuer information, and timestamps

### For Users

1. **View Status**:

   - Connect MetaMask wallet
   - Your BID status loads automatically

2. **Generate QR Code**:

   - Click "Generate QR Code"
   - Download or share for quick verification

3. **Prove Age (18+)**:
   - Enter your age (must match registration)
   - Enter the secret nonce (given during BID issuance)
   - Click "Generate Age >= 18 Proof"
   - Transaction verifies your proof on-chain

## 🔧 Configuration

### Network Configuration

The project supports multiple networks configured in `hardhat.config.js`:

- **Local Hardhat Network**: For development and testing
- **Polygon Amoy Testnet**: For testnet deployment

### Environment Variables

| Variable              | Description                 | Required For          |
| --------------------- | --------------------------- | --------------------- |
| `PRIVATE_KEY`         | Deployer wallet private key | Testnet deployment    |
| `ALCHEMY_AMOY_URL`    | Alchemy RPC endpoint        | Testnet deployment    |
| `POLYGONSCAN_API_KEY` | Polygonscan API key         | Contract verification |

## 🧪 Testing

The project includes comprehensive tests in `test/BIDRegistry.test.js`:

```bash
npm test
```

Tests cover:

- BID issuance with age commitment
- Age verification (ZKP) - correct and incorrect proofs
- Adult verification (>= 18)
- Minor identification (< 18)
- BID revocation
- BID re-enablement (owner only)
- Access control mechanisms
- Authorized issuer management
- Event emission
- Edge cases and error conditions

### Test Results

```
BIDRegistry
  ✓ Should deploy with correct initial state
  BID Issuance with Age Commitment
    ✓ Should issue BID with age commitment successfully
  Age Verification (ZKP)
    ✓ Should verify correct age with valid proof
    ✓ Should reject incorrect age proof
    ✓ Should verify user is adult (>= 18)
    ✓ Should reject adult verification with wrong proof
    ✓ Should correctly identify minor (< 18)
  Revocation and Re-enable
    ✓ Should revoke BID successfully
    ✓ Should re-enable revoked BID (owner only)
    ✓ Should prevent non-owner from re-enabling BID
    ✓ Should prevent re-enabling already active BID
  Authorized Issuers
    ✓ Should allow adding authorized issuers
    ✓ Should allow authorized issuer to issue BID
```

## 📁 Project Structure

```
BID_SYSTEM_V1/
├── contracts/
│   └── BIDRegistry.sol          # Core smart contract with ZKP support
├── frontend/
│   ├── issuer.html             # Government issuer dashboard
│   ├── verifier.html           # Identity verification scanner
│   ├── user.html               # User portal with QR & ZKP features
│   └── contract-info.json      # Auto-generated contract info
├── scripts/
│   ├── deploy.js               # Deployment script
│   ├── interact.js             # Contract interaction utilities
│   └── serve-frontend.js       # Frontend server
├── test/
│   └── BIDRegistry.test.js     # Comprehensive test suite
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies and scripts
└── .env                        # Environment variables (create manually)
```

## 🔐 Security Features

- **Hashed Personal Information**: Sensitive data is hashed (SHA-256) before storage
- **Zero-Knowledge Proofs**: Age verification without revealing actual age
- **Role-Based Access Control**: Multiple permission levels (Owner, Issuer, User)
- **Event Logging**: All actions are logged via blockchain events
- **Ownership Transfer**: Secure ownership management
- **Input Validation**: Comprehensive validation of all inputs
- **Revocation Tracking**: Timestamps recorded for when BIDs are revoked

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

| Script          | Command                  | Description             |
| --------------- | ------------------------ | ----------------------- |
| Compile         | `npm run compile`        | Compile smart contracts |
| Test            | `npm test`               | Run test suite          |
| Local Node      | `npm run node`           | Start local blockchain  |
| Deploy Local    | `npm run deploy:local`   | Deploy to local network |
| Deploy Testnet  | `npm run deploy`         | Deploy to Polygon Amoy  |
| Verify Contract | `npm run verify`         | Verify on Polygonscan   |
| Serve Frontend  | `npm run serve:frontend` | Start frontend server   |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Important Notes

- **Owner Privileges**: Only the contract owner can add authorized issuers and re-enable revoked BIDs
- **Issuer Authorization**: After ownership transfer, the new owner must be explicitly authorized as an issuer if needed
- **Privacy**: The system stores only hashed personal information, never raw sensitive data
- **Nonce Security**: Users must securely store their nonce - it cannot be recovered if lost
- **Gas Costs**: Consider gas optimization for large-scale deployments
- **Age Commitment**: Once a BID is issued, the age commitment cannot be changed

## 🔮 Future Enhancements

- [ ] Mobile app integration
- [ ] Advanced ZKP circuits (Circom/snarkjs)
- [ ] Multi-signature issuer approval
- [ ] Expirable BIDs with auto-renewal
- [ ] Integration with DID standards (W3C)
- [ ] Cross-chain identity bridging
