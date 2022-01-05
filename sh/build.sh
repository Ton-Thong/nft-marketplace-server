docker build -t nft-app ../ && 
docker tag nft-app registry.digitalocean.com/nft-container/nft-app &&
docker push registry.digitalocean.com/nft-container/nft-app