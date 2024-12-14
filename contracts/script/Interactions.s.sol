// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MArcade} from "../src/MArcade.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";

contract FundMArcade is Script {
    uint256 public constant FUND_AMOUNT = 0.1 ether;

    function fundMArcade(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        MArcade(payable(mostRecentlyDeployed)).fundContract{value: FUND_AMOUNT}();
        vm.stopBroadcast();
        console.log("Funded MArcade with %s ether", FUND_AMOUNT);
    }

    function run() external {
        address mostRecentlyDeployed =0xF7cFC10cdBa36937f0F80f028303f624d2b5D7b7; // Replace with your deployed contract address
        fundMArcade(mostRecentlyDeployed);
    }
}

contract WithdrawMArcade is Script {
    function withdrawMArcade(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        MArcade(payable(mostRecentlyDeployed)).withdrawFunds();
        vm.stopBroadcast();
        console.log("Withdrawn funds from MArcade!");
    }

    function run() external {
        address mostRecentlyDeployed =0xF7cFC10cdBa36937f0F80f028303f624d2b5D7b7; // Replace with your deployed contract address
        withdrawMArcade(mostRecentlyDeployed);
    }
}
