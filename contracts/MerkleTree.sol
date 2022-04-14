// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleTree {
    bytes32 public merkleRoot;

    constructor() {}

    function setMerkleRoot(bytes32 _root) external {
        merkleRoot = _root;
    }

    function verifyWallet(bytes32[] calldata _proof)
        external
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }
}
