// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test ,console} from "forge-std/Test.sol";
import "../src/MArcade.sol";

contract MArcadeTest is Test {
    MArcade public arcade;

    address public player1 = address(0x123);
    address public player2 = address(0x456);
    address public player3 = address(0x789);

    function setUp() public {
        // Deploy the MArcade contract
        arcade = new MArcade();

        // Fund the contract for testing prize payments
        vm.deal(address(this), 10 ether);
        payable(address(arcade)).transfer(5 ether);

        // Register players
        vm.prank(player1);
        arcade.registerPlayer("Alice");

        vm.prank(player2);
        arcade.registerPlayer("Bob");

        vm.prank(player3);
        arcade.registerPlayer("Charlie");
    }

    function testLeaderboard() public {
        // Ensure contract balance is sufficient
        uint256 initialBalance = address(arcade).balance;
        assertEq(initialBalance, 5 ether);

        // Pay winners
        uint256 prizeAmount = 1 ether;

        // Player 1 wins
        vm.prank(address(this)); // Ensure the function is called by the owner
        arcade.payWinner(player1, prizeAmount);

        // Player 2 wins twice
        vm.prank(address(this));
        arcade.payWinner(player2, prizeAmount);

        vm.prank(address(this));
        arcade.payWinner(player2, prizeAmount);

        // Fetch leaderboard
        (string[] memory names, uint256[] memory wins) = arcade.getLeaderboard();

        // Assert leaderboard is sorted correctly
        assertEq(names[0], "Bob");
        assertEq(wins[0], 2);

        assertEq(names[1], "Alice");
        assertEq(wins[1], 1);

        assertEq(names[2], "Charlie");
        assertEq(wins[2], 0);

        // Ensure contract balance is updated correctly
        uint256 finalBalance = address(arcade).balance;
        assertEq(finalBalance, initialBalance - (prizeAmount * 3));
    }
}
