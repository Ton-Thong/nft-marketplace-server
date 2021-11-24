docker build -t nft-app ../ && 
docker tag nft-app registry.digitalocean.com/nft-market/nft-app &&
docker push registry.digitalocean.com/nft-market/nft-app