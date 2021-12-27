const { assert } = require("chai");

contract("DYFFarm", (accounts) => {
  const DYFToken = artifacts.require("DYFToken");
  const DYFFarm = artifacts.require("DYFFarm");

  describe("DYFFarm", () => {

    let dyfToken;
    let dyfFarm
    beforeEach(async () => {
      dyfToken = await DYFToken.new();
      dyfFarm = await DYFFarm.new(dyfToken.address);
    });

    it("is defined", () => {
      assert.isDefined(dyfFarm);
    });

    describe("addAllowedToken", () => {
      it("should add token address to allowedTokens", async () => {
        await dyfFarm.addAllowedToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.equal(await dyfFarm.isTokenAllowed("0xa36085f69e2889c224210f603d836748e7dc0088"), true);
      });
    });

    describe("setPriceFeedContract", () => {
      it("should add price feed contract for the token", async () => {
        await dyfFarm.setPriceFeedContract("0xa36085f69e2889c224210f603d836748e7dc0088", "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38");
        assert.equal((await dyfFarm.tokenPriceFeedContract("0xa36085f69e2889c224210f603d836748e7dc0088")), "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38");
      });
    });

    describe("stakeToken", () => {
      it("should create stake for message sender", async () => {
        await dyfFarm.addAllowedToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        await dyfFarm.stakeToken(1, "0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.equal(await dyfFarm.stakers(0), accounts[0]);
        assert.equal(await dyfFarm.uniqueTokensStaked(accounts[0]), 1);
        assert.equal(await dyfFarm.stakingBalance(accounts[0], "0xa36085f69e2889c224210f603d836748e7dc0088"), 1);
      });
    });

    describe("unstakeToken", () => {
      it("should remove stake for message sender", async () => {
        await dyfFarm.addAllowedToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        await dyfFarm.stakeToken(1, "0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.equal(await dyfFarm.stakingBalance(accounts[0], "0xa36085f69e2889c224210f603d836748e7dc0088"), 1);
        await dyfFarm.unstakeToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.equal(await dyfFarm.stakingBalance(accounts[0], "0xa36085f69e2889c224210f603d836748e7dc0088"), 0);
      });
    });

    describe("getUserTotalValue", () => {
      it("should return value > 0 after user has done staking", async () => {
        await dyfFarm.addAllowedToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        await dyfFarm.stakeToken(1, "0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.isTrue((await dyfFarm.getUserTotalValue(accounts[0])) > 0);
      });
    });
    
    describe("getUserStakingBalanceEthValue", () => {
      it("should return value > 0 after user has done staking", async () => {
        await dyfFarm.addAllowedToken("0xa36085f69e2889c224210f603d836748e7dc0088");
        await dyfFarm.stakeToken(1, "0xa36085f69e2889c224210f603d836748e7dc0088");
        assert.isTrue((await dyfFarm.getUserStakingBalanceEthValue(accounts[0], "0xa36085f69e2889c224210f603d836748e7dc0088")) > 0);
      });
    });
  });
});


// todo: add test cases for events