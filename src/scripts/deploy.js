async function main() {
  const NFT = await ethers.getContractFactory('RuNFT');
  const nFT = await NFT.deploy();
  console.log('Contract RuNFT deployed to address:', nFT.address);

  // const NFTMarket = await ethers.getContractFactory('NFTMarket');
  // const nFTMarket = await NFTMarket.deploy();
  // console.log('Contract NFTMarket deployed to address:', nFTMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
