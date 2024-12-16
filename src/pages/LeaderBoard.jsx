import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";
import { Medal, Award, ChevronUp, ChevronDown, Trophy } from "lucide-react";

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

          const playerNames = leaderboardData[0];
          const playerWins = leaderboardData[1];

          const formattedData = playerNames.map((name, index) => ({
            name,
            wins: playerWins[index].toString(),
          }));

          setLeaderboard(formattedData);
        } catch (error) {
          console.error("Detailed Error fetching leaderboard:", error);
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
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl max-sm:mt-10 rounded-3xl overflow-hidden border-2 border-gray-100 transform transition-all hover:scale-[1.02]">
      {/* Header with gradient and subtle shadow */}
      <div className="bg-gradient-to-r from-black to-purple-900  text-white px-6 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-md" />
          <h2 className="text-3xl font-bold tracking-tight drop-shadow-sm">
            Leaderboard
          </h2>
        </div>
        {leaderboard.length > 8 && (
          <button 
            onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
            className="text-sm text-white/80 hover:text-white flex items-center transition-all duration-300 ease-in-out hover:scale-105"
          >
            {showFullLeaderboard ? (
              <>
                Collapse <ChevronUp className="ml-1 w-5 h-5" />
              </>
            ) : (
              <>
                View All <ChevronDown className="ml-1 w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Column Headers with more defined styling */}
      <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
        <div className="col-span-2 text-center">Rank</div>
        <div className="col-span-7">Player</div>
        <div className="col-span-3 text-right">Wins</div>
      </div>

      {/* Leaderboard Entries with hover and transition effects */}
      <div className="divide-y divide-gray-100">
        {displayLeaderboard.map((player, index) => (
          <div 
            key={index} 
            className={`
              grid grid-cols-12 items-center px-6 py-4 transition-all duration-300 ease-in-out
              ${index === 0 
                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200' 
                : 'bg-white hover:bg-gray-50'}
              hover:shadow-sm
            `}
          >
            <div className="col-span-2 text-center">
              <span className={`
                font-bold 
                ${index === 0 
                  ? 'text-yellow-600 text-2xl' 
                  : 'text-gray-600 text-lg'}
              `}>
                {index + 1}
                {index === 0 && (
                  <span className="ml-2 inline-block align-middle relative -top-0.5 text-yellow-500">👑</span>
                )}
              </span>
            </div>
            <div className="col-span-7 flex items-center space-x-3">
              <div className="font-medium text-gray-800">{player.name}</div>
            </div>
            <div className="col-span-3 text-right">
              <span className={`
                font-bold 
                ${index === 0 
                  ? 'text-yellow-700 text-xl' 
                  : 'text-black text-lg'}
              `}>
                {player.wins}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State with Illustration */}
      {leaderboard.length === 0 && (
        <div className="text-center py-10 bg-gray-50">
          <div className="mb-4 flex justify-center opacity-50">
            <Medal className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Connect Wallet to View Leaderboards.
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;