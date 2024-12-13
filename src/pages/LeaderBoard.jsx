import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";

const Leaderboard = ({ walletAddress }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== "undefined" && walletAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();

          // Ensure correct chain
          if (network.chainId !== 5003) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x138B" }],
            });
          }

          // Initialize contract
          const gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setContract(gameContract);
        } catch (error) {
          console.error("Failed to initialize contract", error);
        }
      }
    };

    initializeContract();
  }, [walletAddress]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (contract) {
        try {
          console.log("Attempting to fetch leaderboard...");
          const leaderboardData = await contract.getLeaderboard();

          console.log("Raw Leaderboard Data:", leaderboardData);
          console.log("Players Array Length:", leaderboardData[0].length);
          console.log("Wins Array Length:", leaderboardData[1].length);

          const playerNames = leaderboardData[0];
          const playerWins = leaderboardData[1];

          console.log("Player Names:", playerNames);
          console.log("Player Wins:", playerWins);

          const formattedData = playerNames.map((name, index) => ({
            name,
            wins: playerWins[index].toString(), // Convert BigInt to string
          }));

          console.log("Formatted Data:", formattedData);
          setLeaderboard(formattedData);
        } catch (error) {
          console.error("Detailed Error fetching leaderboard:", error);
          console.error("Error Name:", error.name);
          console.error("Error Message:", error.message);
        }
      } else {
        console.log("Contract is not initialized");
      }
    };
    fetchLeaderboard();
  }, [contract]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
      <table className="table-auto border-collapse border border-gray-200 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Rank</th>
            <th className="border px-4 py-2 text-left">Player</th>
            <th className="border px-4 py-2 text-left">Wins</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{player.name}</td>
              <td className="border px-4 py-2">{player.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
