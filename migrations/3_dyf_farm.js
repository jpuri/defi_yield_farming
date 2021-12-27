const DYFToken = artifacts.require("DYFToken");
const DYFFarm = artifacts.require("DYFFarm");

module.exports = async (deployer, network) => {
  try {
    const dyfToken = await DYFToken.deployed();
    await deployer.deploy(DYFFarm, dyfToken.address);
    const dyfFarm = await DYFFarm.deployed();
    await dyfToken.transfer(dyfFarm.address, "1000000000000000000000000");

    if (network.startsWith("kovan")) {
      await dyfFarm.addAllowedToken(
        "0xa36085f69e2889c224210f603d836748e7dc0088"
      );
      await dyfFarm.setPriceFeedContract(
        "0xa36085F69e2889c224210F603D836748e7dC0088",
        "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38"
      );
    }
  } catch (err) {
    console.error(err);
  }
};
