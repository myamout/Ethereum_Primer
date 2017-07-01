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
  - Run the command `yarn` This will install all the project dependencies. Truffle has already been initialzed here. When you start a fresh
    project and want to use truffle you'll need to run `truffle init`. For npm users run `npm install`.

## Lets Talk About Dependencies
This project has four major dependencies: ethereumjs-testrpc, truffle, truffle-contract, and web3. All of these should be familiar as we just talked about them in a previous section. If you've done any modern web development you probably recognize the other three dependencies, however if you haven't I'll explain. Adding the babel-cli and different presets allows us to use ES6 (the latest version of JavaScript) inside of our node.js scripts. For example instead of importing modules like: `var Web3 = require('web3');` we would use `import Web3 from 'web3';`. I would like to add that using ES6 is completely optional, however it's always good to be up to date with the latest technologies.

## How About That Directory Structure
You'll notice that everything is generally at the root level. After running `yarn` you'll get your node_modules folder, which will have all of
our dependencies. After running `truffle init` you probably notice some folders were added and a truffle.js file was created. Lets walk through all of
those. The truffle.js file just exports the network settings of the blockchain you want to connect to. The default is the testrpc so we don't need to
change anything, however if you want to start working on the test network or even Homestead you'd need to change the configs inside of the networks object. The contracts folder is where all of your smart contracts will go. When you run `truffle compile` it will look into that folder and compile
any smart contracts that have been altered. The migrations folder is used to migrate your contracts to the blockchain with the `truffle migrate` command. In this guide we will be using web3.js to migrate our contracts as there still is an open issue when using truffle to migrate contracts
to the testrpc. However the migration command works fine when migrating to the test network or Homestead. The test folder holds all of your tests. You'll be able to test your contracts using Solidity or JavaScript and I've provided example tests for both. Lastly we have main.js. This script is
what we'll be using to deploy and interact with our smart contract. I have the script setup to take in command line arguments and our commands will
be invoked by running yarn scripts. I'll go over that once we touch that part of the guide.

## Let's Look At A Simple Solidity Contract
Like we discussed earlier the blockchain is excellent for storing information so lets make a simple contract that allows users to store
something! I'll show the code first and then walk through everything that's happening...
```
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


```
The first line of our contract `pragma solidity ^0.4.11` simply specifies the compiler and version we want to use. 0.4.11 is currently
the latest stable compiler version with 0.4.12 for nightly builds. Now we want to wrap all of our logic inside of a contract. You can think of
a contract like a Java or C++ class. Next we define our global variables. Our contract only has one, `mapping(address => bytes32) public vault`.
A mapping is a Solidity data structure that uses key value pairing. Our map is using an address, someone's wallet address, to access a 32 byte long
hex string. Next we have a nameless function, this is our contract's fallback function. A contract's fallback function is called when some tries to
access a method not defined or if no data was passed in the function call, it's essentially our contracts exception handler. Next we have our store
function. We pass in an item to save into our mapping. You'll notice the object `msg`. When we want to access a contract's methods we need to also
pass a wallet address. `msg.sender` is equal to the wallet address we pass. I'll go over this in more detail when we go over interacting with our smart
contract. Lasty we have our getter function. We simply return the 32 byte hex string associated with the address. There you have it, that is your first
Ethereum smart contract! When we go our Dapps, decentralized applications, we'll build upon this example by adding some more complexity to the contract.