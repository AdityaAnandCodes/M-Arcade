// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MArcade is ERC721, Ownable {
    using Strings for uint256;

    string[] public nftMetadataURIs = [
        "https://aqua-rare-worm-454.mypinata.cloud/ipfs/bafybeiecowelxaity7cm5vo7uiy2q3xj2vv6wyhsa4w7yglyhvxakfylw4/brain.json",
        "https://aqua-rare-worm-454.mypinata.cloud/ipfs/bafybeiecowelxaity7cm5vo7uiy2q3xj2vv6wyhsa4w7yglyhvxakfylw4/speed.json"
    ];

    mapping(address => uint256[]) public playerNFTs;
    mapping(address => string) public playerNames;
    mapping(address => uint256) public playerWins;
    mapping(uint256 => uint256) private tokenMetadataIndex; // Mapping to store metadata index for each token
    address[] public players;

    uint256 public nextTokenId = 0;
    uint256 public constant MAX_NFTS = 100;

    event NFTMinted(address indexed player, uint256 tokenId, uint256 metadataIndex);
    event GameEntered(address player, uint256 amount);
    event WinnerPaid(address winner, uint256 amount);
    event ContractFunded(address funder, uint256 amount);

    constructor() ERC721("MArcade", "MARC") Ownable(msg.sender) {}

    function fundContract() external payable {
        require(msg.value > 0, "Funding amount must be greater than 0");
        emit ContractFunded(msg.sender, msg.value);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function registerPlayer(string calldata name) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        if (bytes(playerNames[msg.sender]).length == 0) {
            playerNames[msg.sender] = name;
            players.push(msg.sender);
        }
    }

    function enterGame(uint256 entryFee) external payable {
        require(msg.value == entryFee, "Incorrect game entry fee");
        emit GameEntered(msg.sender, msg.value);
    }

    function payWinner(address winner, uint256 prizeAmount) external {
        require(winner != address(0), "Invalid winner address");
        require(address(this).balance >= prizeAmount, "Insufficient contract balance");

        (bool success, ) = winner.call{value: prizeAmount}("");
        require(success, "Transfer to winner failed");

        playerWins[winner] += 1;
        emit WinnerPaid(winner, prizeAmount);
    }

    function getLeaderboard() external view returns (string[] memory, uint256[] memory) {
        uint256 count = players.length;
        string[] memory names = new string[](count);
        uint256[] memory wins = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            names[i] = playerNames[players[i]];
            wins[i] = playerWins[players[i]];
        }

        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = 0; j < count - 1; j++) {
                if (wins[j] < wins[j + 1]) {
                    (wins[j], wins[j + 1]) = (wins[j + 1], wins[j]);
                    (names[j], names[j + 1]) = (names[j + 1], names[j]);
                }
            }
        }

        return (names, wins);
    }

    function mintWinningNFT(uint256 metadataIndex) external {
        require(metadataIndex < nftMetadataURIs.length, "Invalid metadata index");
        require(nextTokenId < MAX_NFTS, "All NFTs have been minted");

        uint256 newTokenId = nextTokenId;
        nextTokenId++;

        tokenMetadataIndex[newTokenId] = metadataIndex; // Store the metadata index for the token
        _safeMint(msg.sender, newTokenId);
        playerNFTs[msg.sender].push(newTokenId);

        emit NFTMinted(msg.sender, newTokenId, metadataIndex);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        uint256 metadataIndex = tokenMetadataIndex[tokenId]; // Retrieve the metadata index
        return nftMetadataURIs[metadataIndex];
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function getPlayerNFTs(address player) external view returns (uint256[] memory) {
        return playerNFTs[player];
    }

    receive() external payable {
        emit ContractFunded(msg.sender, msg.value);
    }
}
