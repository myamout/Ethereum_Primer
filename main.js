import Web3 from 'web3';
import contract from 'truffle-contract';
import fs from 'fs';

const compiledJson = JSON.parse(fs.readFileSync('build/contracts/StoreInformation.json'));
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contractAddr = fs.readFileSync("contractAddr.txt").toString();

const web3 = new Web3();
web3.setProvider(provider);

const VaultContract = contract({
    abi: compiledJson.abi,
    unlinked_binary: compiledJson.unlinked_binary
});

VaultContract.setProvider(provider);

switch (process.argv[2]) {
  case 'migrate':
    migrateContract();
    break;
  case 'addinfo':
    addInfo(process.argv[3]);
    break;
  case 'getinfo':
    getInfo();
    break;
  default:
    console.log('No Option Found. Try using: migrate, addinfo or getinfo');
    break;
}

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

function addInfo(info) {
  VaultContract.at(contractAddr).then((instance) => {
    return instance.storeInVault(info, {from: web3.eth.accounts[0]});
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
}

function getInfo() {
  VaultContract.at(contractAddr).then((instance) => {
    return instance.unlockVault.call({from: web3.eth.accounts[0]});
  }).then((response) => {
    console.log(web3.toAscii(response).toLocaleString());
  }).catch((error) => {
    console.log(error);
  });
}

