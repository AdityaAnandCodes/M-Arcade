import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";

const MemoryMatch = ({ walletAddress }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStatus, setGameStatus] = useState("waiting");

  // Blockchain-related states
  const [contract, setContract] = useState(null);

  const MAX_MOVES = 50;
  const TOTAL_TIME = 120;

  // Initialize contract on component mount
  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== "undefined" && walletAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();

          // Switch to the correct network (Berachain Testnet)
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

  // Generate cards for the game
  const initializeGame = useCallback(() => {
    const symbols = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒"];
    const shuffledCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
      }));
    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setGameOver(false);
    setMoves(0);
    setTimeLeft(TOTAL_TIME);
    setGameStatus("waiting");
  }, []);

  // Start game with blockchain entry fee
  const startGame = async () => {
    try {
      if (!contract) return;

      const entryFee = ethers.parseEther("0.01");
      await contract.enterGame(entryFee, { value: entryFee });
      alert("Entry fee paid. Starting the game!");

      setGameStatus("playing");
    } catch (error) {
      console.error("Error paying entry fee:", error);
    }
  };

  // Time tracking
  useEffect(() => {
    let timer;
    if (gameStatus === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus("lost");
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  // Handle game completion
  const handleGameCompletion = async (won) => {
    if (!contract) return;

    try {
      if (won) {
        // Define prize amount
        const prizeAmount = ethers.parseEther("0.01");

        // Pay the winner
        const payTx = await contract.payWinner(walletAddress, prizeAmount);
        await payTx.wait();
        alert("Congratulations! Prize Transferred!");

        // Mint special NFT if won within 25 moves
        if (moves <= 25) {
          const mintTx = await contract.mintWinningNFT(0);
          await mintTx.wait();
          alert("You won within 25 moves! Special NFT minted!");
        }
      }
    } catch (error) {
      console.error("Error during NFT or payment processing:", error);
    }
  };

  // Handle card click
  const handleCardClick = (clickedCard) => {
    if (
      selectedCards.length >= 2 ||
      matchedPairs.includes(clickedCard.id) ||
      clickedCard.isFlipped ||
      gameStatus !== "playing"
    )
      return;

    setMoves((prev) => prev + 1);

    // Check for game over on moves
    if (moves + 1 >= MAX_MOVES) {
      setGameStatus("lost");
      setGameOver(true);
      return;
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setSelectedCards([...selectedCards, clickedCard]);

    // Check for match
    if (selectedCards.length === 1) {
      const firstCard = selectedCards[0];
      if (firstCard.symbol === clickedCard.symbol) {
        setMatchedPairs([...matchedPairs, firstCard.id, clickedCard.id]);
        setSelectedCards([]);

        // Check if game is won
        if (matchedPairs.length + 2 === cards.length) {
          setGameStatus("won");
          setGameOver(true);
          handleGameCompletion(true);
        }
      } else {
        // Flip cards back if no match
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              card.id === firstCard.id || card.id === clickedCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Memory Matching Game
          </h1>

          {!contract ? (
            <div className="text-red-500 font-bold text-center">
              Please connect wallet through Navbar
            </div>
          ) : gameStatus === "waiting" ? (
            <div className="text-center">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Pay Entry Fee & Start Game
              </button>
            </div>
          ) : (
            <>
              {/* Game Status Display */}
              <div className="flex justify-between mb-4">
                <div>
                  Moves: {moves}/{MAX_MOVES}
                </div>
                <div>Time: {timeLeft}s</div>
              </div>

              {gameOver ? (
                <div className="text-center">
                  {gameStatus === "won" ? (
                    <p className="text-xl font-semibold text-green-600">
                      🎉 Congratulations! You Won! 🎉
                    </p>
                  ) : (
                    <p className="text-xl font-semibold text-red-600">
                      Game Over! Try Again
                    </p>
                  )}
                  <button
                    onClick={initializeGame}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className={`
                        h-20 flex items-center justify-center text-4xl 
                        cursor-pointer rounded-lg border-2
                        transition-all duration-300
                        ${
                          matchedPairs.includes(card.id)
                            ? "bg-green-200 opacity-50"
                            : card.isFlipped
                            ? "bg-blue-100"
                            : "bg-gray-200 hover:bg-gray-300"
                        }
                      `}
                    >
                      {card.isFlipped || matchedPairs.includes(card.id)
                        ? card.symbol
                        : "?"}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryMatch;
