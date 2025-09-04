## BID System (Blockchain ID)

This project provides a simple owner-managed on-chain registry where authorized issuers can issue or revoke a user's Blockchain ID (BID). Two frontends are provided:

- `frontend/issuer.html`: Government/issuer portal to issue and revoke BIDs
- `frontend/verifier.html`: Read-only verification portal to check BID status

### Prerequisites

- Node.js 18+
- MetaMask

### Install

```bash
npm install
```

### Environment (for Amoy deployments)

Create a `.env` file in the project root with:

```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_KEY
```

Notes:
- Local tasks (compile, test, hardhat node, local deploy) do not require `.env`.
- Remote deploys to Amoy require all three variables.

### Common Tasks

- Compile contracts:
```bash
npm run compile
```

- Run local node:
```bash
npm run node
```

- Deploy locally (to localhost:8545):
```bash
npm run deploy:local
```

- Deploy to Polygon Amoy (requires `.env`):
```bash
npm run deploy
```

The deploy script writes `frontend/contract-info.json` with the deployed address and ABI snippet.

### Serve the frontend

```bash
npm run serve:frontend
```

Open one of:
- Issuer UI: `http://localhost:8080/issuer.html`
- Verifier UI: `http://localhost:8080/verifier.html`

In the issuer UI:
1) Connect wallet and switch to Polygon Amoy (or to local network for local testing)
2) Load contract address from `contract-info.json` with "Auto-Load from Deployment" or paste manually
3) Issue or revoke BIDs

In the verifier UI:
1) Connect wallet (read-only)
2) Paste the same contract address
3) Verify single or multiple addresses

### Testing

```bash
npm test
```

### Notes

- Only the contract owner can add authorized issuers. The owner is the deployer by default.
- After transferring ownership, the new owner must be explicitly authorized as an issuer if they need to issue BIDs.


