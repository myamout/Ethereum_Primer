# Ethereum Primer
Ethereum is one of the hottest blockchains out right now and is the first real mainstream coin
to include smart contracts. Smart contracts allow developers to host contracts, think of a class in an OOP language, with logic on the 
Ethereum blockchain. Smart contracts can be used to host auctions on the blockchain, store information, or use logic to determine when
ether is sent out to another address. This primer will serve as a guide on how to quickly get started developing smart contracts in 
Solidity (the language contracts are written in) and interacting with the Ethereum blockchain.

## Clearing Up Some Jargon Before We Start
This primer will take advantage of Truffle, a command line interface for working with the Ethereum blockchain.
Truffle will help us out with compling our smart contracts and testing them. You are able to use Truffle to migrate your
contracts to the blockchain, however in this guide we'll be doing those by hand as the Truffle migrations has issues
when migrating to the Testrpc.

Along with Truffle we'll be using Web3.js, the official Ethereum JavaScript API. Web3 has a lot of utility functions built in
along with the ability to compile and deploy our smart contracts.

I mentioned the Testrpc before so you might be wondering what that might be. Ethereum has three different blockchains: the real blockchain known
as Homestead, the test network, and the testrpc. We'll be using the testrpc. The testrpc gives us a private blockchain right in our terminal window
for testing applications. It also provides us with ten accounts with a large amount of fake ether in each for testing purposes. The testrpc is a good
place to start developing your smart contracts as you don't need to manage different accounts or worry about running out of ether.

## First Steps
  - Make sure you have npm, node, and git installed
  - This guide uses yarn over npm. You can install yarn using the command `npm install -g yarn`. Though if you prefer npm that will work fine.
  - Install truffle by using the command: `yarn global add truffle`. For npm use `npm install -g truffle`
  - Clone the repo by using the command: `git clone https://github.com/myamout/Ethereum_Primer.git`
  - Run the command `yarn && truffle init` This will install all the project dependencies and initialize a truffle project inside the directory.
    For npm users run `npm install && truffle init`.

## Lets Talk About Dependencies
This project has four major dependencies: ethereumjs-testrpc, truffle, truffle-contract, and web3. All of these should be familiar as we just talked about them in a previous section. If you've done any modern web development you probably recognize the other three dependencies, however if you haven't I'll explain. Adding the babel-cli and different presets allows us to use ES6 (the latest version of JavaScript) inside of our node.js scripts. For example instead of importing modules like: `var Web3 = require('web3');` we would use `import Web3 from 'web3';`. I would like to add that using ES6 is completely optional, however it's always good to be up to date with the latest technologies.

## Let's Look At A Simple Solidity Contract
Like we discussed earlier the blockchain is excellent for storing information so lets make a simple contract that allows users to store
something! I'll show the code first and then walk through everything that's happening...
```
pragma solidity ^0.4.11;

contract StoreInformation {

  mapping(address => bytes32) public vault;

  function storeInVault(bytes32 item) {
    vault[msg.sender] = item;
  }

  function unlockVault() returns (bytes32) {
    return vault[msg.sender];
  }

}
```