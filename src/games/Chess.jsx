import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { ethers } from "ethers";
import confetti from "canvas-confetti";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    startVelocity: 30,
    spread: 360,
    origin: { x: 0.5, y: 0.5 }, // Center of the screen
    ticks: 200,
  });
};
const ChessGame = ({ walletAddress }) => {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [difficulty, setDifficulty] = useState("easy");
  const [gameStatus, setGameStatus] = useState("waiting");
  const [contract, setContract] = useState(null);

  // Contract initialization
  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== "undefined" && walletAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();

          if (network.chainId !== 5003) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x138B" }],
            });
          }

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

  // Computer move logic
  const makeComputerMove = () => {
    const possibleMoves = game.moves();

    if (possibleMoves.length === 0) return;

    // Simple move selection strategy based on difficulty
    let selectedMove;
    switch (difficulty) {
      case "easy":
        selectedMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        break;
      case "medium":
        const captureMoves = possibleMoves.filter((move) => move.includes("x"));
        selectedMove =
          captureMoves.length > 0
            ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
            : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        break;
      case "hard":
        const knightBishopMoves = possibleMoves.filter(
          (move) => move.includes("N") || move.includes("B")
        );
        selectedMove =
          knightBishopMoves.length > 0
            ? knightBishopMoves[
                Math.floor(Math.random() * knightBishopMoves.length)
              ]
            : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        break;
      default:
        selectedMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    // Execute the selected move
    game.move(selectedMove);
    setGame(new Chess(game.fen()));

    // Check for game-ending conditions
    if (game.isCheckmate()) {
      handleGameEnd(false); // Computer wins
    } else if (game.isDraw()) {
      handleGameEnd(false); // Game draw
    }
  };

  // Start game with entry fee
  const startGame = async () => {
    try {
      if (!contract) {
        alert("Please connect your wallet first.");
        return;
      }

      const entryFee = ethers.parseEther("0.01");

      try {
        const tx = await contract.enterGame(entryFee, { value: entryFee });
        await tx.wait();

        // Reset game state
        setGame(new Chess());
        setGameStatus("playing");
      } catch (error) {
        console.error("Transaction error:", error);
        if (error.code === "ACTION_REJECTED") {
          alert("Transaction was cancelled. Please try again.");
        } else if (error.message.includes("insufficient funds")) {
          alert("Insufficient funds to pay entry fee.");
        } else {
          alert(
            "Failed to enter game. Please check your wallet and try again."
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  // Handle game end
  const handleGameEnd = async (isWinner) => {
    try {
      if (!contract) return;

      if (isWinner) {
        triggerConfetti();
        const prizeAmount = ethers.parseEther("0.02");

        // Pay the winner
        const payTx = await contract.payWinner(walletAddress, prizeAmount);
        await payTx.wait();

        alert(`Congratulations! You won!`);
        setGameStatus("won");
      } else {
        setGameStatus("lost");
      }
    } catch (error) {
      console.error("Error during game end processing:", error);
      setGameStatus("lost");
    }
  };

  // Game logic effects
  useEffect(() => {
    if (gameStatus === "playing" && game.turn() === "b") {
      const timer = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [game, gameStatus]);

  // Player move handler
  const onDrop = (sourceSquare, targetSquare) => {
    if (gameStatus !== "playing") return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to queen for simplicity
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));

      // Check for game-ending conditions
      if (game.isCheckmate()) {
        handleGameEnd(true); // Player wins
      } else if (game.isDraw()) {
        handleGameEnd(false); // Game draw
      }

      return true;
    } catch (error) {
      return false;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Blockchain Chess</h1>

          {gameStatus === "waiting" && (
            <div className="flex space-x-4">
              <select
                value={boardOrientation}
                onChange={(e) => setBoardOrientation(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="white">Play as White</option>
                <option value="black">Play as Black</option>
              </select>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
        </div>

        {!contract ? (
          <div className="text-red-500 font-bold text-center">
            Please connect wallet through Navbar
          </div>
        ) : gameStatus === "waiting" ? (
          <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h2 className="text-xl font-semibold mb-4">Game Details</h2>
              <div className="space-y-3 text-gray-600">
                <p>🎮 Entry Fee: 0.01 MNT</p>
                <p>🏆 Potential Prize: 0.02 MNT</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 hover:scale-105 duration-500 transition-all"
            >
              Pay Entry Fee & Start Game
            </button>
          </>
        ) : (
          <>
            <div className="w-full max-w-[600px] mx-auto">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardOrientation={boardOrientation}
                draggable={true}
                touchControls={true}
              />
            </div>

            {(gameStatus === "won" || gameStatus === "lost") && (
              <div className="mt-4 text-center">
                {gameStatus === "won" ? (
                  <p className="text-green-600 font-bold">
                    Congratulations! You Won!
                  </p>
                ) : (
                  <p className="text-red-600 font-bold">Game Over! You Lost!</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChessGame;
