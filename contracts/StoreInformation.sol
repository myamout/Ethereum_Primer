pragma solidity ^0.4.11;

contract StoreInformation {

  mapping(address => bytes32) public vault;

  function () {
    uint x = 1;
  }

  function storeInVault(bytes32 item) {
    vault[msg.sender] = item;
  }

  function unlockVault() returns (bytes32) {
    return vault[msg.sender];
  }

}
