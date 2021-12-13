// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "../openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../openzeppelin-contracts/contracts/utils/Counters.sol";
import "../openzeppelin-contracts/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage {
    
    // increment for each minted token
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // standard ERC721 constructor
    constructor() ERC721("MyNFT", "MNFT") {}

    // mint a singular NFT.
    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();  // add 1 to _tokenIds
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;  // return the new token ID
    }
}
