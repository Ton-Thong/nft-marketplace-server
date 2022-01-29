// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RuNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct MarketItem {
        uint itemId;
        string tokenURI;
        address payable owner;
        uint256 price;
        bool sell;
    }

    mapping (uint256 => MarketItem) public idToMarketItem;

    constructor() ERC721("RuNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        idToMarketItem[newItemId] = MarketItem(newItemId, tokenURI, payable(recipient), 0, false);
        return newItemId;
    }

    function totalSupply() public view returns (uint) {
        return _tokenIds.current();
    }

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function sellNFT(uint256 tokenId, uint256 price) public {
        require(msg.sender == ownerOf(tokenId), 'Not owner of this token');
        require(price > 0, 'Price zero');

        idToMarketItem[tokenId].sell = true;
        idToMarketItem[tokenId].price = price;

        _transfer(msg.sender, address(this), tokenId);
    }

    function buyNFT(address buyer, uint256 tokenId) public payable onlyOwner {
        string memory errMsg = 'Not allowed to buy this token.';

        require(buyer != ownerOf(tokenId), errMsg); //Change to get owner from struct
        require(idToMarketItem[tokenId].sell == true, errMsg);

        uint256 price = idToMarketItem[tokenId].price;
        address payable seller = idToMarketItem[tokenId].owner;

        (bool success,) = seller.call{ value: price }("");
        require(success, errMsg);
        _transfer(address(this), buyer, tokenId);
        
        address ownerOfToken = ownerOf(tokenId);
        require(ownerOfToken == buyer, errMsg);

        idToMarketItem[tokenId].sell = false;
        idToMarketItem[tokenId].price = 0;
        idToMarketItem[tokenId].owner = payable(buyer);
    }
}