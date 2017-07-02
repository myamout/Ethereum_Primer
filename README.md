# Ethereum Primer
Ethereum is one of the hottest blockchains right now due to its ability to scale and its introduction of smart contracts. Ethereum's blockchain allows developers to host contracts, think of an object in Java or C++, that include some logic. Contracts can be used to store information, run auctions, or determine when to ether to a wallet. In a nutshell Ethereum allows transactions to be complex and offer more than just peer to peer transactions. This primer will serve as a beginner's guide to developing contracts using Solidity, Ethereum's smart contract language, and interacting with a smart contract after deploying it to the blockchain.

## Clearing Up Some Jargon Before We Start
### Truffle and Truffle-Contract
This primer will take advantage of the Truffle CLI, a command line interface allowing us the easily compile, deploy, and test our smart contracts. Truffle-Contract is a node module that allows us to interact with our deployed contracts using JavaScript promises.
### Web3.js
Web3.js is the official Ethereum JavaScript API. Web3 offers a multitude of utility functions as well as giving us the ability to compile, deploy, and interact with our smart contracts.
### Ethereumjs-testrpc
Ethereum has three main blockchains: Homestead, Modern, and the Testrpc. Homestead is the real, for lack of a better word, blockchain and is what your production ready contracts will go on. Modern is a live testnet that will allow you test your contracts in a Homestead like environment, but the ether you use here is not real. Finally we have the testrpc, what we'll be using in this primer. The testrpc is a private, local blockchain that will allow you to test your contracts except here fake ether wallets, with a generous amount of ether in each, are generated for you.

## First Steps
  - Make sure you have npm, node, and git installed
  - This guide uses yarn over npm. You can install yarn using the command `npm install -g yarn`. Though if you prefer npm that will work fine.
  - Install truffle by using the command: `yarn global add truffle`. For npm use `npm install -g truffle`
  - Clone the repo by using the command: `git clone https://github.com/myamout/Ethereum_Primer.git`
  - Run the command `yarn` This will install all the project dependencies. Truffle has already been initialzed here. When you start a fresh
    project and want to use truffle you'll need to run `truffle init`. For npm users run `npm install`.

## Lets Talk About Dependencies
This primer has four major dependencies: ethereumjs-testrpc, truffle, truffle-contract, and web3. We've already touched on these dependencies and we'll go into further detail as well soon. If you have explored the project you might have noticed some Babel dependencies inside of our root package.json file. Babel allows us to write our JavaScript in ES6, the latest version of JavaScript. So for example instead of `var Web3 = require('web3')`, we write `import Web3 from 'web3'`. I'll leave documentation regarding Babel and EMCAScript 6 if you are interested in learning more. 

## How About That Directory Structure
In this section we'll quickly gloss over the primer's directory structure. Everything you'll need is in the root directory of the project and most of the operations we'll be running are controled by yarn scripts.
### Folders
  - `contracts/`: This folder will house all of the contracts we write
  - `migrations/`: This folder holds truffle's migration files, however we'll be using web3 to deploy our contracts as there still is an open issue when using truffle to migrate contracts to the testrpc. You'll still need the folder and files if you plan on testing your contracts though.
  - `test/`: This folder will hold all of your tests. Note that you can write tests in JavaScript or Solidity.
  - `dapp/`: Later in the primer I will discuss Decentralized Applications. Inside of the folder is a full flegded Dapp running on Express using React.

### Files
  - `main.js`: Our main Node script that will deploy and allow us to interact with our smart contract. We'll using yarn scripts to run this file, so I recommend taking a look at the package.json file so you can follow the command line parameters we're passing into our script.
  - `truffle.js`: Truffle's network config file. This tells truffle where our blockchain instance is. By default it points to the testrpc, however you'd need to change up the environment variables if you want to start using Modern or Homestead.
  - `contractAddr.txt`: Text file to hold our contract's address on the blockchain. I'll go into detail later, but it'll be easier to access our smart contract's address if we save it into a text file.

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
Ethereum smart contract!

## Compiling Our Contracts
Now that we have written a smart contract we'll need to compile it and then deploy it to the blockchain. In the next few steps I'll be discussing how we'll go about doing that.

### Compiling A Smart Contract
To compile a smart contract run the command `truffle compile` and if everything goes well you'll see a new folder `build/`. Inside this folder is a JSON file that'll have all of the necessary information we'll need to migrate our contract to the blockchain. I'll touch on the two main fields we'll need.
  - The ABI: The abi is a json object that contains all of the methods our contract has and what they return. This will let the blockchain know what our smart contract can do when we attempt to interact with it.
  - Unlinked binary: This is essentially our smart contract compiled into byte code. This is what will actually get run on the blockchain.

## Migrating Our Contract To The Testrpc
In these nexts steps I'll be explaining how we're going to get our smart contract onto our testrpc instance. 

### Create A Testrpc Instance
Open up a new terminal window, navigate to the primer folder and then run the command `yarn testrpc`. This will create a testrpc instance inside of your terminal window. When the testrpc boots up you should see ten wallet address, these are the wallets we can use for free and some other information. Whenever we interact with the testrpc it'll give us a printout of the action.

### Contract Migration
As I stated earlier our main.js file handles all of our migrations and interactions with the smart contract. Because I'll be referencing the main.js file for the next few steps I'm only going to show the code for each step.
```
// You'll need to import all of the necessary dependencies up here before you can use
// Any of the node modules we've installed

const compiledJson = JSON.parse(fs.readFileSync('build/contracts/StoreInformation.json'));
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contractAddr = fs.readFileSync("contractAddr.txt").toString();

const web3 = new Web3();
// Point our web3 object to the testrpc instance
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
First we need to grab the JSON file `truffle compile` generated for us. We'll need to be able to access the contract's abi and byte code when we deploy it to the testrpc. Next we need to create our provider constant. This constant is essentially the path to our testrpc instance. We'll be passing it to our Web3 object so it knows where the testrpc is come deployment time. When our Web3 object is connected to the testrpc we can use the `.eth` extension to view the accounts inside the testrpc, their balances, and other information pretaining to our blockchain instance. Now lets go over the migration function.
  - `const VaultContract = web3.eth.contract(compliedJson.abi);`: This creates a new contract object. We pass in the abi to let the object know what it's able to do
  - `const deployedContract = VaultContract.new({data: compiledJson.unlinked_binary, from: web3.eth.accounts[0], gas: 4700000});`
     This command creates a new VaultContract object on our testrpc. When creating a new contract we are required to pass in an object with some fields. The data field contains our byte code, simple enough. The blockchain needs to keep track of what address deployed the contract so we need to pass an address in. Finally we need to pay some ether in the form of gas to get our contract onto the blockchain. The concept of gas is a little tough to wrap your head around so I'll leave this link that explains it extremely well, `https://ethereum.stackexchange.com/questions/3/what-is-meant-by-the-term-gas`. 

To migrate our contract use the command `yarn migrate`. After you deploy the contract you should see the contract's address print out in the testrpc instance running in your other terminal window. Copy and paste that into the `contractAddr.txt` file so we can access our contract later.

## Interacting With Our Contract
Now that our smart contract is on the blockchain lets interact with it! Like before I'll show some code and we'll go over everything.

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
The first set here is to use `truffle-contract` to create a contract object so we can interact with our deployed smart contract using promises. After that we'll need to use our provider constant to point our contract object to the testrpc instance. Now lets go over the function.
  - `VaultContract.at(contractAddr)...` will access a VaultContract object that lives on the testrpc at that address.
  - When the contract is accessed it returns an instance object. This object is what we'll use to call all of the functions inside of our smart contract
`instance.storeInVault(info, {from: web3.eth.accounts[0]});` calls our storeInVault function. We pass in a string we've defined as a command line argument ("helloworld") and we need to pass in a wallet address. Remember our mapping variable uses an address as the key to each value. Since we pointed our Web3 object to the testrpc we can use one of the ten accounts we get for free. Our final step in our promise chain prints out the response our transaction generates. You should see an object that contains the transaction hash, block number, amount of gas used, etc.

Run the command `yarn addinfo` to add a value to our mapping variable. Inside the testrpc window you should see the transaction hash upon completion.

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
Let before we are going to use `VaultContract.at(contractAddr)...` to get an instance object of the contract that lives at that specified address. Now our method call looks a little different than before, lets go over that. Because we just want to access and return whatever value is stored inside of our mapping variable there is no need to create a transaction on the network. Whenever we create a transaction on the network, for example updating our mapping variable, that will cost us gas. So by rule of thumb when you are just interested in getting a value from your contract us the `.call()` function as this won't cost any gas because no transaction is created. We'll need to pass an address to the call function so we can get our value out. Remeber that our value is of type bytes32 so we'll use a web3 function `.toAscii()` to convert the hex string back to readable characters.

Run the command `yarn getinfo` to grab our value. Inside of the testrpc window you'll see the transaction hash again and inside your other terminal window you should see "helloworld" printed out to the console.

## Creating Your First Dapp
Inside this project you'll find a folder called `dapp/`. This folder contains a full-fleged React application that can interact with our testrpc instance. For this section I'm going to assume some front-end knowledge as there would be a lot to cover. I will give a quick summary of what is going on, but if you have any in-depth questions I highly recommend taking a look at the documentation of the technologies I cover.

### What's In The Stack
On the backend side I have a simple Express server running with two rest endpoints, a getter and a setter function. On the frontend side I am using React to render the site and handle any functionality. To bundle the source code and all the necessary dependencies I have leveraged Webpack 2. You can look over the `webpack.config.js` file to look over how that's being accomplished. I've added the babel preset called stage two so we can use fetch inside of an async function for all of the rest calls. I'll leave sample code here so you can take a look in case you're interested in how that looks..

```
async handleAdd(event) {
    event.preventDefault();
    try {
      // Await is essentially a promise and the response variable won't be set until the fetch call is completed
      let response = await fetch(`/add?address=${this.state.address}&value=${this.state.value}`);
      //  We'll use await here as well to complete the promise
      let responseData = await response.json();
      console.log(responseData.resp);
      let tempArray = this.state.transactions;
      tempArray.push(responseData.resp.tx);
      this.setState({
        value: '',
        address: '',
        transactions: tempArray
      });
    } catch(e) {
      console.log(e);
    }
  }
```

### Setup
  - cd into the dapp folder and run the command `yarn` to install all of the needed dependencies.
  - Use the command `yarn build` to bundle all of our source code
  - To launch the server run `yarn server`

### Using The Dapp
  - Go to `http://localhost:1337/` to view the webapp. You'll notice the app is very minimal and is just setup for basic CRUD
  - To save a value in our mapping structure copy one of the address from the testrpc running in the terminal window and write whatever you want to save
  - You'll see after the request is made the transaction hash will be displayed below. This is essentially the reciept of the transaction.
  - To get back whatever value you saved copy the address back into the next field and once the request finishes you should see the string below

## Other Documentation
  - Solidity Docs: `https://solidity.readthedocs.io/en/latest/`
  - Truffle Framework Docs:  `http://truffleframework.com/docs/`
  - Truffle-Contract Docs:  `https://github.com/trufflesuite/truffle-contract`
  - Web3.js Docs: `https://github.com/ethereum/web3.js/`
  - More Web3.js Docs: `https://github.com/ethereum/wiki/wiki/JavaScript-API`
  - React Docs: `https://facebook.github.io/react/docs/hello-world.html`
  - Express Docs: `https://expressjs.com/en/starter/hello-world.html`
  - Yarn Docs: `https://yarnpkg.com/lang/en/docs/`
  - Webpack Docs: `https://webpack.js.org/guides/getting-started/`
  - Babel Docs: `https://babeljs.io/docs/setup/#installation`
  - EMCAScript 6: `http://es6-features.org/#Constants`