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
to the testrpc. However the migration command works fine when migrating to the test network or Homestead. The test folder holds all of your tests. You'll be able to test your contracts using Solidity or JavaScript. I've left the sample test Truffle provides so you can take a look at how it's structured. Lastly we have main.js. This script is what we'll be using to deploy and interact with our smart contract. I have the script setup to take in command line arguments and our commands will be invoked by running yarn scripts. I'll go over that once we touch that part of the guide.

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

## Compiling Our Contracts And Migration To The Testrpc
Now that we have a smart contract lets compile it and move it onto the testrpc! To compile our contract run the command `truffle compile`. Note that you'll get a warning saying our variable x inside of the fallback function isn't used. This is fine as fallback functions are not allowed to return
anything. Now you'll notice a build folder was just created. If you look inside you should see a contracts folder and inside that a JSON file. This
JSON file contains our contract object essentially. I'm going to cover the two important values inside of the JSON file, the abi and unlinked binary.
The contract's abi is what tells the blockchain what methods our contract has and what they return. The unlinked binary is essentially the byte code of the contract and this is what gets run on the blockchain. Now that we have compiled our contract lets talk about migration.

### Running The Testrpc
  - Open a new terminal window and navigate to the directory our project is in.
  - Run the command `yarn testrpc`. This will start up the testrpc blockchain.
  You'll notice that the testrpc is officially running and you'll be able to see the ten account address you have access to. There are extra command line arguments you can add when you run the testrpc, like set the gas price, but for our primer the default is more than fine.

### Contract Migration
As I stated earlier our main.js file handles all of our migrations and interactions with the smart contract. Because I'll be referencing the main.js file for the next few steps I'm only going to show the code for each step and do a full paste at the end of the guide. I'll paste the necessary code
for this step below...
```
// These are the variable definitions needed for the migrations
// Note that most of these are needed for each step so reference back here if you need them again
import Web3 from 'web3';
import contract from 'truffle-contract';
import fs from 'fs';

const compiledJson = JSON.parse(fs.readFileSync('build/contracts/StoreInformation.json'));
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contractAddr = fs.readFileSync("contractAddr.txt").toString();

const web3 = new Web3();
web3.setProvider(provider);

// Migration function
function migrateContract() {
  console.log('migrating');
  try {
    const VaultContract = web3.eth.contract(compiledJson.abi);
    const deployedVaultContract = VaultContract.new({data: compiledJson.unlinked_binary, from: web3.eth.accounts[0], gas: 4700000});
    console.log('contract migrated...');
  } catch (error) {
    console.log(error);
    console.log('migration failed');
  }
}
```
Okay so first we're going to import all of our modules. For migrating our contract we don't actaully need the truffle-contract module, but for
completeness I left it in for future reference. First we need to grab the JSON file we got when we compiled our contract using the `fs` module.
Next we need to create our provider variable. The provider will point our web3 object and in the future our contract instance to the blockchain
we are working with. Next we'll create our web3 object and then pass the provider we just made so our web3 object is aware of the testrpc we just launched. Now we can take a look at our migration function. First we're going to create a contract object. web3 allows us to do that by really easily
by calling the contract function and passing the defined abi from our JSON file. Next we'll deploy a new contract to the testrpc. Lets break down the
line `const deployedVaultContract = VaultContract.new({data: compiledJson.unlinked_binary, from: web3.eth.accounts[0], gas: 4700000})`. New means
we want to make a new contract. Other options available to us are at and update. We'll be using the at constructor later in the primer. Next we need
to pass in an object that contains a few things. The data field will take the byte code we discussed earlier. The blockchain needs to keep track of
what address deploys which contract so we need to pass in an address. Because we pointed our web3 object to the testrpc we can access the ten
accounts that comes with it. We'll look into some more web3 functions later as well. Finally to deploy a smart contract we need give it some gas
as well. Now look at our testrpc running in the terminal, you should be able to see the contract transaction. You should see the address the contract is at, you'll need to copy and paste that into the `contractAddr.txt` file so we can access that contract in future steps.

  - Run the command `yarn migrate` to migrate our contract to the testrpc

## Interacting With Our Contract
Now that our smart contract is on the blockchain lets interact with it! Like before I'll show some code and we'll go over everything. Before I'd like to touch on two important things when interacting with the blockchain. When you call a function that alters a variable inside of the contract that will require gas. However, when you are simply accessing and returning a value that requires no gas since you aren't altering anything. You specify the operation with the `.call()` addition to the method call. You'll see this in action soon.

### Updating Our Mapping Variable
```
// The variable definitions are the same as before, but we need to add our truffle-contract definition
const VaultContract = contract({
    abi: compiledJson.abi,
    unlinked_binary: compiledJson.unlinked_binary
});
// Point our contract to our testrpc instance
VaultContract.setProvider(provider);

// Update function
function addInfo(info) {
  VaultContract.at(contractAddr).then((instance) => {
    return instance.storeInVault(info, {from: web3.eth.accounts[0]});
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
}
```
First we'll need to create a contract object using truffle-contract. As I mentioned earlier web3.js allows us to interact with our smart contracts, however by using truffle we'll be using promises which in turn makes the interactions better as each step will be completed before the other is started. Just like our web3 contract the truffle-contract needs the abi and byte code we generated. So lets dive in... Notice the `.at(contractAddr)`, I mentioned this earlier. Our smart contract already exists on the testrpc so we can access it by passing in the address it lives at. We'll do this by getting it from the contractAddr.txt file. Lets break down our promise now. The first promise returns an instance object. This object is essentially our smart contract, we'll use the instance object to call store method. Lets go over the method call `instance.storeInVault(info, {from: web3.eth.accounts[0]});`So first we pass in our function's parameter, a string (Solidity will convert it to a bytes32 hex string). If you're wondering where the info variable came from, it's a command line parameter we pass in. Next we need to specify which wallet address is accessing the method. This is for transaction purposes, remember since we are updating some variable we need to pay some gas. Each function has a predetermined gas cost that will get subtracted out of our wallet. An address is also required since our method calls for the `msg` object.

The next promise returns the response from the contract's function. The response will be an object that includes the transaction hash, reciept, and other values. You'll be able to explore these values, but I won't be covering that here. Lastly, we'll need to catch our promise with a simple error catch function. You've now interacted with your first smart contract!

  - Run the command `yarn addinfo` to update our mapping variable

### Getting Our Saved Variable
Now that we have something saved inside of our mapping object, lets get it back out! Again here's the needed code, and lets walk through it
```
function getInfo() {
  VaultContract.at(contractAddr).then((instance) => {
    return instance.unlockVault.call({from: web3.eth.accounts[0]});
  }).then((response) => {
    console.log(web3.toAscii(response).toLocaleString());
  }).catch((error) => {
    console.log(error);
  });
}
```
We've already defined the needed variables earlier so we can just peek at the function. Our first promise returns an instance of our smart contract again. Because our getter function has a return we need to invoke the `.call()` with our function call. This operation will grab us our return value. Just like the addInfo() function we need to pass an address, however this isn't because our function requires gas it's because we've associated an address as the key in our mapping. The second promise returns our response. If we were to just print out the response you'd see a hex string, this is
because our function returns a bytes32 string. So we'll use a web3 function called `toAscii()`. This takes in our hex string and converts to readable
characters. Lastly, we'll catch our promise again. Inside of the console you should be our string "helloworld" print out! There you have it, you've now successfully interacted with your smart contract! Now that we have some basics, we'll move onto creating a full-stack decentralized web-app.

## Creating Your First Dapp
Inside this project you'll find a folder called `dapp/`. This folder contains a full-fleged React application that can interact with our testrpc instance. For this section I'm going to assume some front-end knowledge as there would be a lot to cover. I will give a quick summary of what is going on, but if you have any in-depth questions I highly recommend taking a look at the documentation of the technologies I cover.

### The Stack
Simple enough the dapp's backend is written with Node.js leveraging the Express framework, while the front-end is powered by React. Our React components and dependencies are bundled together by Webpack. The front-end is utilizing EMCAScript 6 along with the stage two preset. This preset alongs us to use async rest calls, making our requests to the server really easy.

### Setup
  - cd into the dapp folder and run the command `yarn` to install all of the needed dependencies.
  - Use the command `yarn build` to bundle all of our source code
  - To launch the server run `yarn server`

### Using The Dapp
  - Go to `