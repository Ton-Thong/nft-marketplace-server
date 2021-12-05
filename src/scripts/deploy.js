async function main() {
   const RuNFT = await ethers.getContractFactory("RuNFT")
   const ruNFT = await RuNFT.deploy()
   
   console.log("Contract deployed to address:", ruNFT.address)
 }
 
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })
 