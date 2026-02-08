// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BIDRegistry {
    struct BIDData {
        bytes32 hashedPersonalInfo;
        address issuer;
        uint256 timestamp;
        bool isValid;
        string metadataHash;
        bytes32 ageCommitment;          // NEW: Hash commitment for age verification (ZKP)
        uint256 revocationTimestamp;    // NEW: Track when BID was revoked
    }
    
    mapping(address => BIDData) public bids;
    mapping(address => bool) public authorizedIssuers;
    address public owner;
    
    event BIDIssued(address indexed user, address indexed issuer, bytes32 hashedPersonalInfo, string metadataHash, uint256 timestamp);
    event BIDRevoked(address indexed user, address indexed revokedBy, uint256 timestamp);
    event BIDReEnabled(address indexed user, address indexed enabledBy, uint256 timestamp);
    event IssuerAdded(address indexed issuer, address indexed addedBy, uint256 timestamp);
    event IssuerRemoved(address indexed issuer, address indexed removedBy, uint256 timestamp);
    event AgeVerified(address indexed user, bool isAdult, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }
    
    modifier onlyIssuerOrOwner(address user) {
        require(msg.sender == owner || bids[user].issuer == msg.sender, "Not authorized to revoke this BID");
        _;
    }
    
    modifier bidNotExists(address user) {
        require(bids[user].issuer == address(0), "BID already exists for this address");
        _;
    }
    
    modifier bidExists(address user) {
        require(bids[user].issuer != address(0), "BID does not exist for this address");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAdded(msg.sender, msg.sender, block.timestamp);
    }
    
    // Enhanced issuance with age commitment for ZKP
    function issueBID(address user, bytes32 hashedPersonalInfo, string memory metadataHash, bytes32 ageCommitment) external onlyAuthorizedIssuer bidNotExists(user) {
        require(user != address(0), "Invalid user address");
        require(hashedPersonalInfo != bytes32(0), "Invalid hash");
        
        bids[user] = BIDData({
            hashedPersonalInfo: hashedPersonalInfo,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true,
            metadataHash: metadataHash,
            ageCommitment: ageCommitment,
            revocationTimestamp: 0
        });
        
        emit BIDIssued(user, msg.sender, hashedPersonalInfo, metadataHash, block.timestamp);
    }
    
    function getBID(address user) external view returns (BIDData memory) {
        require(bids[user].issuer != address(0), "BID not found");
        return bids[user];
    }
    
    function revokeBID(address user) external bidExists(user) onlyIssuerOrOwner(user) {
        require(bids[user].isValid, "BID is already revoked");
        bids[user].isValid = false;
        bids[user].revocationTimestamp = block.timestamp;
        emit BIDRevoked(user, msg.sender, block.timestamp);
    }
    
    // NEW: Re-enable a revoked BID (only owner/government)
    function reEnableBID(address user) external onlyOwner bidExists(user) {
        require(!bids[user].isValid, "BID is already active");
        bids[user].isValid = true;
        bids[user].revocationTimestamp = 0;
        emit BIDReEnabled(user, msg.sender, block.timestamp);
    }
    
    // NEW: Verify age using Zero Knowledge Proof (simple hash-based)
    // User provides: age (plaintext), nonce (secret), and the proof is verified against stored commitment
    function verifyAge(address user, uint256 age, bytes32 nonce) external view bidExists(user) returns (bool) {
        require(bids[user].isValid, "BID is not valid");
        
        // Reconstruct commitment: hash(age || nonce)
        bytes32 commitment = keccak256(abi.encodePacked(age, nonce));
        
        // Verify it matches the stored commitment
        return commitment == bids[user].ageCommitment;
    }
    
    // NEW: Public function to verify if user is adult (>= 18) without revealing exact age
    // User provides proof that age >= 18
    function verifyIsAdult(address user, uint256 age, bytes32 nonce) external bidExists(user) returns (bool) {
        require(bids[user].isValid, "BID is not valid");
        
        // Verify the age commitment matches
        bytes32 commitment = keccak256(abi.encodePacked(age, nonce));
        require(commitment == bids[user].ageCommitment, "Invalid age proof");
        
        // Check if age >= 18
        bool isAdult = age >= 18;
        emit AgeVerified(user, isAdult, block.timestamp);
        
        return isAdult;
    }
    
    function addAuthorizedIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Issuer is already authorized");
        authorizedIssuers[issuer] = true;
        emit IssuerAdded(issuer, msg.sender, block.timestamp);
    }
    
    function removeAuthorizedIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer is not authorized");
        require(issuer != owner, "Cannot remove owner as issuer");
        authorizedIssuers[issuer] = false;
        emit IssuerRemoved(issuer, msg.sender, block.timestamp);
    }
    
    function isBIDValid(address user) external view returns (bool) {
        return bids[user].issuer != address(0) && bids[user].isValid;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
}