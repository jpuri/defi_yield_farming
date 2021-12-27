const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const mnemonic = process.env.MNEMONIC;
const url = process.env.RPC_URL;

module.exports = {
  networks: {
    kovan: {
      provider: () => {
        return new HDWalletProvider(mnemonic, url);
      },
      network_id: "42",
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.6.6",
    },
  },
};
