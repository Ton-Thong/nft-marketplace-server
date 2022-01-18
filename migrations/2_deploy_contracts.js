const RuNFT = artifacts.require('RuNFT');
const NFTMarket = artifacts.require('NFTMarket');

module.exports = function (deployer) {
  deployer.deploy(RuNFT);
  deployer.deploy(NFTMarket);
};
