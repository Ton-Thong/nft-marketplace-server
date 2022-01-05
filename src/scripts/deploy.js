async function main() {
<<<<<<< Updated upstream
   const RuNFT = await ethers.getContractFactory("RuNFT")
   const ruNFT = await RuNFT.deploy()
   console.log("Contract deployed to address:", ruNFT.address)

   const RuNFTMarket = await ethers.getContractFactory("RuNFTMarket")
   const ruNFTMarket = await RuNFTMarket.deploy()
   console.log("Contract deployed to address:", ruNFTMarket.address)
 }
 
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 
=======
    const RuNFT = await ethers.getContractFactory("RuNFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const ruNFT = await RuNFT.deploy()
    console.log("Contract deployed to address:", ruNFT.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  
>>>>>>> Stashed changes
