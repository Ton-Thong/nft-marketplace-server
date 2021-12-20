// SPDX-License-Identifier: MIT
<<<<<<< Updated upstream
pragma solidity ^0.8.0;
=======
pragma solidity ^0.8.10;
>>>>>>> Stashed changes

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RuNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RuNFT", "NFT") {}

<<<<<<< Updated upstream
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256)
=======
    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
>>>>>>> Stashed changes
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
