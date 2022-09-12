// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract User is Ownable {

    constructor() { }

    struct UserData {
        string userName;
        address publicAddress;
        string ipfsURI;
    }

    mapping (string => UserData) userData;

    function registerUser(string memory userName, address publicAddress, string memory ipfsURI) external onlyOwner returns (bool) {
        require(keccak256(bytes(userData[userName].userName)) != keccak256(bytes(userName)), "This user is already registered.");

        userData[userName] = UserData({
            userName: userName,
            publicAddress: publicAddress,
            ipfsURI: ipfsURI
        });

        return true;
    }

    function getUser(string memory userName) public view returns (UserData memory) {
        return userData[userName];
    }

    function resolveAddress(string memory userName) public view returns (address) {
        return userData[userName].publicAddress;
    }

}