import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";
import { Medal,Award, ChevronUp, ChevronDown } from "lucide-react";

const Leaderboard = ({ walletAddress }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [contract, setContract] = useState(null);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

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

  // Determine display leaderboard based on state
  const displayLeaderboard = showFullLeaderboard 
    ? leaderboard 
    : leaderboard.slice(0, 8);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
        </div>
        {leaderboard.length > 8 && (
          <button 
            onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
            className="text-sm text-gray-300 hover:text-white flex items-center"
          >
            {showFullLeaderboard ? (
              <>
                Collapse <ChevronUp className="ml-1 w-4 h-4" />
              </>
            ) : (
              <>
                View All <ChevronDown className="ml-1 w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {displayLeaderboard.map((player, index) => (
          <div 
            key={index} 
            className={`
              px-6 py-4 flex items-center justify-between
              ${index === 0 ? 'bg-yellow-50' : 'bg-white'}
              hover:bg-gray-50 transition-colors duration-200
            `}
          >
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700 w-8">
                {index + 1}
                {index === 0 && (
  <span className="ml-2 inline-block align-middle relative -top-0.5 text-yellow-500">👑</span>
)}
              </span>
              <span className="font-medium text-gray-800">{player.name}</span>
            </div>
            <span className="font-bold text-black">{player.wins}</span>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No players in the leaderboard yet
        </div>
      )}
    </div>
  );
};

export default Leaderboard;