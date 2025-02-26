const Web3 = require("web3");
const EEAClient = require("../../src");
const { pantheon } = require("../keys.js");

const web3 = new EEAClient(new Web3(pantheon.node1.url), 2018);

const deletePrivacyGroup = givenPrivacyGroupId => {
  const contractOptions = {
    privacyGroupId: givenPrivacyGroupId
  };
  return web3.priv.deletePrivacyGroup(contractOptions).then(result => {
    console.log(`The privacy group deleted is:`, result);
    return result;
  });
};

module.exports = {
  deletePrivacyGroup
};

if (require.main === module) {
  if (!process.env.PRIVACY_GROUP_TO_DELETE) {
    throw Error(
      "You need to export the following variable in your shell environment: PRIVACY_GROUP_TO_DELETE="
    );
  }

  const privacyGroupId = process.env.PRIVACY_GROUP_TO_DELETE;
  deletePrivacyGroup(privacyGroupId);
}
