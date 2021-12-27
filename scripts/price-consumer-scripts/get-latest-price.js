const PriceConsumer = artifacts.require("PriceConsumer");

/*
  This script makes it easy to read the data on
  the price feed deployed contract
*/

module.exports = async (callback) => {
  const priceConsumer = await PriceConsumer.deployed();
  const latestPrice = await priceConsumer.getLatestPrice();
  callback(latestPrice);
};
