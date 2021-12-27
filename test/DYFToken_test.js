const { assert } = require("chai");

contract("DYFToken", () => {
  const DYFToken = artifacts.require("DYFToken");

  describe("dyfToken", () => {

    let dyfToken;
    beforeEach(async () => {
      dyfToken = await DYFToken.deployed();
    });

    it("is defined", () => {
      assert.isDefined(dyfToken);
    });

    it("has name , symbol and totalSupply correctly set", async () => {
      assert.equal(await dyfToken.name(), "DYFToken");
      assert.equal(await dyfToken.symbol(), "DYF");
      assert.equal(await dyfToken.totalSupply(), 1000000000000000000000000);
    });

  });
});
