// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RuNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct MarketItem {
        uint itemId;
        string tokenURI;
        address payable owner;
        uint256 price;
        bool sell;
        bool sold;
    }

    mapping (uint256 => MarketItem) public idToMarketItem;

    constructor() ERC721("RuNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        idToMarketItem[newItemId] = MarketItem(newItemId, tokenURI, payable(recipient), 0, false, false);
        return newItemId;
    }

    function sellNFT(address to, uint256 tokenId, uint256 price) public {
        require(msg.sender == ownerOf(tokenId), 'Not owner of this token');
        require(price > 0, 'Price zero');
        idToMarketItem[tokenId].sell = true;
        idToMarketItem[tokenId].price = price;

        _transfer(msg.sender, to, tokenId);
    }
}