docker build -t nft-app ../ && 
docker tag nft-app registry.digitalocean.com/nft-registry/nft-app &&
docker push registry.digitalocean.com/nft-registry/nft-app