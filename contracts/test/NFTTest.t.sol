// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/MArcade.sol";

contract MArcadeNFTMetadataTest is Test {
    MArcade public arcade;

    address public player1 = address(0x123);
    address public player2 = address(0x456);
    address public player3 = address(0x789);

    function setUp() public {
        // Deploy the MArcade contract
        arcade = new MArcade();

        // Register players
        vm.prank(player1);
        arcade.registerPlayer("Alice");

        vm.prank(player2);
        arcade.registerPlayer("Bob");

        vm.prank(player3);
        arcade.registerPlayer("Charlie");
    }

    function testMintSpecificMetadataURIs() public {
        // Player 1 mints with brain metadata (index 0)
        vm.prank(player1);
        arcade.mintWinningNFT(0);

        // Player 2 mints with speed metadata (index 1)
        vm.prank(player2);
        arcade.mintWinningNFT(1);

        // Verify token URIs
        string memory expectedBrainURI = arcade.nftMetadataURIs(0);
        string memory expectedSpeedURI = arcade.nftMetadataURIs(1);

        assertEq(
            arcade.tokenURI(0), 
            expectedBrainURI, 
            "Token 0 should have brain metadata URI"
        );

        assertEq(
            arcade.tokenURI(1), 
            expectedSpeedURI, 
            "Token 1 should have speed metadata URI"
        );
    }

    function testMultiplePlayersCanMintSameMetadata() public {
        // Multiple players mint the same metadata
        vm.prank(player1);
        arcade.mintWinningNFT(0);

        vm.prank(player2);
        arcade.mintWinningNFT(0);

        vm.prank(player3);
        arcade.mintWinningNFT(0);

        // Verify each token has the same metadata URI
        string memory expectedURI = arcade.nftMetadataURIs(0);

        assertEq(arcade.tokenURI(0), expectedURI, "First token should have brain metadata");
        assertEq(arcade.tokenURI(1), expectedURI, "Second token should have brain metadata");
        assertEq(arcade.tokenURI(2), expectedURI, "Third token should have brain metadata");
    }

    function testCannotMintWithInvalidMetadataIndex() public {
        // Attempt to mint with an invalid metadata index
        vm.prank(player1);
        vm.expectRevert("Invalid metadata index");
        arcade.mintWinningNFT(2); // Assuming only 0 and 1 are valid indices
    }

    function testMaxNFTMintLimit() public {
        // Mint to the max NFT limit
        uint256 maxNFTs = arcade.MAX_NFTS();
        
        for (uint256 i = 0; i < maxNFTs; i++) {
            // Alternate between metadata indices
            uint256 metadataIndex = i % 2;
            
            vm.prank(address(uint160(0x1000 + i)));
            arcade.mintWinningNFT(metadataIndex);
        }

        // Attempt to mint one more should revert
        vm.prank(address(0xDEAD));
        vm.expectRevert("All NFTs have been minted");
        arcade.mintWinningNFT(0);
    }

    function testPlayerNFTTracking() public {
        // Player 1 mints multiple NFTs with different metadata
        vm.prank(player1);
        arcade.mintWinningNFT(0);

        vm.prank(player1);
        arcade.mintWinningNFT(1);

        // Retrieve player's NFTs
        uint256[] memory player1NFTs = arcade.getPlayerNFTs(player1);

        // Verify player has two NFTs
        assertEq(player1NFTs.length, 2, "Player should have two NFTs");

        // Verify token URIs for player's NFTs
        assertEq(
            arcade.tokenURI(player1NFTs[0]), 
            arcade.nftMetadataURIs(0), 
            "First NFT should have brain metadata"
        );
        assertEq(
            arcade.tokenURI(player1NFTs[1]), 
            arcade.nftMetadataURIs(1), 
            "Second NFT should have speed metadata"
        );
    }
}