const DYFToken = artifacts.require("DYFToken");

module.exports = async (deployer) => {
  try {
    await deployer.deploy(DYFToken);
    await DYFToken.deployed();
  } catch (err) {
    console.error(err);
  }
};
