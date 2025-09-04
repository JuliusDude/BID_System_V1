// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BIDRegistry {
    struct BIDData {
        bytes32 hashedPersonalInfo;
        address issuer;
        uint256 timestamp;
        bool isValid;
        string metadataHash;
    }
    
    mapping(address => BIDData) public bids;
    mapping(address => bool) public authorizedIssuers;
    address public owner;
    
    event BIDIssued(address indexed user, address indexed issuer, bytes32 hashedPersonalInfo, string metadataHash, uint256 timestamp);
    event BIDRevoked(address indexed user, address indexed issuer, uint256 timestamp);
    event IssuerAdded(address indexed issuer, address indexed addedBy, uint256 timestamp);
    event IssuerRemoved(address indexed issuer, address indexed removedBy, uint256 timestamp);
    
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
    
    function issueBID(address user, bytes32 hashedPersonalInfo, string memory metadataHash) external onlyAuthorizedIssuer bidNotExists(user) {
        require(user != address(0), "Invalid user address");
        require(hashedPersonalInfo != bytes32(0), "Invalid hash");
        
        bids[user] = BIDData({
            hashedPersonalInfo: hashedPersonalInfo,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true,
            metadataHash: metadataHash
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
        emit BIDRevoked(user, msg.sender, block.timestamp);
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