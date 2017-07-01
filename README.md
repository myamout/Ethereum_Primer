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

Along with Truffle we'll be using Web3.js, the official Ethereum JavaScript API. Web3 has a lot of handle functions built in
along with giving us the ability to compile and deploy our smart contracts.

I mentioned the Testrpc before so you might be wondering what that might be. Ethereum has three different blockchains: the real blockchain known
as Homestead, the test network, and the testrpc. We'll be using the testrpc. The testrpc gives us a private blockchain right in our terminal window
for testing applications. It also provides us with ten accounts with a large amount of fake ether in each for testing purposes.

## First Steps
  - Make sure you have npm and node installed
  - This guide uses yarn over npm. You can install yarn by typing `npm install -g yarn`
  - Install truffle by using the command: `yarn global add truffle`
  - Clone the repo by using the command: `git clone https://github.com/myamout/Ethereum_Primer.git`
  - Run the command `yarn && truffle init` This will install all the projects dependencies and initialize a truffle project inside the directory