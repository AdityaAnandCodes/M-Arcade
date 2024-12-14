// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MArcade} from "../src/MArcade.sol";

contract DeployMArcade is Script {
    function run() external returns (MArcade) {
        vm.startBroadcast();
        vm.txGasPrice(10000000);
        
        // Deploy the MArcade contract
        MArcade mArcade = new MArcade();
        
        vm.stopBroadcast();
        return mArcade;
    }
}
