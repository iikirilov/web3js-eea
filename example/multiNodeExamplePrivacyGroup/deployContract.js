const fs = require("fs");
const path = require("path");

const Web3 = require("web3");
const EEAClient = require("../../src");

const createGroup = require("../privacyGroupManagement/createPrivacyGroup");

const { orion, pantheon } = require("../keys.js");

const binary = fs.readFileSync(
  path.join(__dirname, "../solidity/EventEmitter/EventEmitter.bin")
);

const web3 = new EEAClient(new Web3(pantheon.node1.url), 2018);

const createGroupId = () => {
  return createGroup.createPrivacyGroup();
};

const createPrivateEmitterContract = privacyGroupId => {
  const contractOptions = {
    data: `0x${binary}`,
    privateFrom: orion.node1.publicKey,
    privacyGroupId,
    privateKey: pantheon.node1.privateKey
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

const getPrivateContractAddress = transactionHash => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv
    .getTransactionReceipt(transactionHash, orion.node1.publicKey)
    .then(privateTransactionReceipt => {
      console.log("Private Transaction Receipt\n", privateTransactionReceipt);
      return privateTransactionReceipt.contractAddress;
    });
};

module.exports = async () => {
  const privacyGroupId = await createGroupId();
  const contractAddress = await createPrivateEmitterContract(privacyGroupId)
    .then(getPrivateContractAddress)
    .catch(console.error);
  return { contractAddress, privacyGroupId };
};

if (require.main === module) {
  module.exports();
}
