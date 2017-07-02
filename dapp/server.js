import express from 'express';
import contract from 'truffle-contract';
import Web3 from 'web3';
import fs from 'fs';

const compiledJson = JSON.parse(fs.readFileSync('../build/contracts/StoreInformation.json'));
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contractAddr = fs.readFileSync("../contractAddr.txt").toString();

const web3 = new Web3();

const VaultContract = contract({
    abi: compiledJson.abi,
    unlinked_binary: compiledJson.unlinked_binary
});

VaultContract.setProvider(provider);

const app = express();

app.use(express.static(__dirname + '/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/wingcss/dist/'));

app.get('/add', (req, resp) => {
  VaultContract.at(contractAddr).then((instance) => {
    return instance.storeInVault(req['query']['value'], {from: req['query']['address']});
  }).then((response) => {
    return resp.send({resp: response});
  }).catch((error) => {
    return resp.send({resp: error});
  });
});

app.get('/get', (req, resp) => {
  if (req['query']['address'] === '') {
    resp.send({resp: 'error'});
  } else {
    VaultContract.at(contractAddr).then((instance) => {
      return instance.unlockVault.call({from: req['query']['address']});
    }).then((response) => {
      return resp.send({resp: web3.toAscii(response).toLocaleString()});
    }).catch((error) => {
      return resp.send({resp: error});
    });
  }
});

app.listen(1337);
console.log('[+] Server running on port 1337');
