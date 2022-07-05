const AndreToken = artifacts.require("AndreToken");

module.exports = function (deployer) {
  deployer.deploy(AndreToken, 10000);
};
