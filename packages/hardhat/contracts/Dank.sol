// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Dank is Ownable {

    constructor() { }

    struct UserData {
        string userName;
        address publicAddress;
        string ipfsURI;
    }

    mapping (string => UserData) _idToUser;

    event UserCreated(uint256 timestamp, string username, address userAddress, string ipfsURI);

    function registerUser(string memory userName, address publicAddress, string memory ipfsURI) external onlyOwner returns (bool) {
        require(keccak256(bytes(_idToUser[userName].userName)) != keccak256(bytes(userName)), "This user is already registered.");

        _idToUser[userName] = UserData({
            userName: userName,
            publicAddress: publicAddress,
            ipfsURI: ipfsURI
        });

        emit UserCreated(block.timestamp, userName, publicAddress, ipfsURI);

        return true;
    }

    function getUser(string memory userName) public view returns (UserData memory) {
        return _idToUser[userName];
    }

    function resolveAddress(string memory userName) public view returns (address) {
        return _idToUser[userName].publicAddress;
    }

    // struct to store a bucket details
    struct Bucket {
        string name;
        string description;
        address[] tokens;
        uint256[] weightages;
    }

    // struct to maintain User Investments
    struct UserInvestment {
        uint256 bucketId;
        uint256 totalAmount;
        uint256[] holdings;
    }

    // mapping to track user investments
    mapping (string => UserInvestment[]) private _userInvestments;

    // mapping to track every bucket
    mapping (uint256 => Bucket) public bucketDetails;

    // private counter to maintain the number of buckets
    uint256 private _counter = 0;

    // array of supported tokens
    address[] public supportedTokens;

    // event for bucket creation
    event BucketCreated(uint256 bucketId, string bucketName, string description, address[] tokens, uint256[] weightages);

    // function to create a bucket - onlyOwner
    function createBucket(string memory name, string memory description, address[] memory tokens, uint256[] memory weightage) external onlyOwner returns (bool) {
        require (tokens.length == weightage.length, "Number of tokens should equal to weightage");

        uint256 totalWeightage = 0;
 
        for (uint256 i = 0; i < weightage.length; i++) {
            totalWeightage += weightage[i]; 
        }

        require (totalWeightage == 10000, "Weightage should be 100%");

        bucketDetails[_counter] = Bucket({
            name: name,
            description: description,
            tokens: tokens,
            weightages: weightage
        });

        emit BucketCreated(_counter, name, description, tokens, weightage);

        _counter++;

        return true;
    }
    
    // fetch a bucket - return struct
    function fetchBucketDetails(uint256 id) external view returns (Bucket memory) {
        return bucketDetails[id];
    }

}