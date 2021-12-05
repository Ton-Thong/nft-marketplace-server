require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
   solidity: "0.8.0",
   defaultNetwork: 'ropsten',
   networks: {
      hardhat: {},
      ropsten: {
         url: 'https://eth-ropsten.alchemyapi.io/v2/wPUuhtN9MjdtPZvmR8YDXCi7U9nTGmRo',
         accounts: [`0x${'7c3e4f86f6263b85e48e0d50da93cd2ea9db93392abecc7d071613226d48df77'}`]
      }
   },
}