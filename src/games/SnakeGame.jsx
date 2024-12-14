import React, { useState, useEffect, useCallback, useRef } from "react";
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

const SnakeGame = ({ walletAddress }) => {
  const BOARD_WIDTH = 20; // Number of cells horizontally
  const BOARD_HEIGHT = 20; // Number of cells vertically
  const CELL_SIZE = 20; // Size of each cell in pixels

  const BOARD_PIXEL_WIDTH = BOARD_WIDTH * CELL_SIZE;
  const BOARD_PIXEL_HEIGHT = BOARD_HEIGHT * CELL_SIZE;
  const INITIAL_SPEED = 200; // Initial speed in milliseconds
  const GAME_DURATION = 60; // Game duration in seconds

  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [contract, setContract] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

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

  const startGame = async () => {
    try {
      if (!contract) {
        alert("Please connect your wallet first.");
        return;
      }

      const entryFee = ethers.parseEther("0.01");

      try {
        const tx = await contract.enterGame(entryFee, { value: entryFee });
        await tx.wait(); // Wait for transaction confirmation

        alert("Entry fee paid. Starting the game!");

        // Reset game state
        setSnake([
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ]);
        setFood(generateFood());
        setDirection("RIGHT");
        setSpeed(INITIAL_SPEED);
        setScore(0);
        setGameStatus("playing");
        setTimeLeft(GAME_DURATION);

        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleGameEnd(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
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

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (BOARD_WIDTH - 1)),
        y: Math.floor(Math.random() * (BOARD_HEIGHT - 1)),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, [snake]);

  const handleGameEnd = async (isWinner) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      if (!contract) return;

      if (isWinner) {
        triggerConfetti();
        setGameStatus("won");

        // Calculate prize amount (0.01% of score)
        const prizeFraction = score * 0.00001; // 0.001% = score * 0.00001
        const prizeAmount = ethers.parseEther(prizeFraction.toString());

        // Ensure minimum prize of 0.0001 ETH and maximum of 0.1 ETH
        // const clampedPrizeAmount =
        //   prizeAmount < ethers.parseEther("0.0001")
        //     ? ethers.parseEther("0.0001")
        //     : prizeAmount > ethers.parseEther("0.1")
        //     ? ethers.parseEther("0.1")
        //     : prizeAmount;

        // Pay the winner
        const payTx = await contract.payWinner(walletAddress, prizeAmount);
        await payTx.wait();

        // Alert with exact prize amount

        alert(`Congratulations! You won MNT!`);

        // If score is high (more than 50), mint a special NFT
        // if (score > 50) {
        //   const mintTx = await contract.mintWinningNFT(1);
        //   await mintTx.wait();
        //   alert("High score! Special NFT minted!");
        // }
      } else {
        setGameStatus("lost");
      }
    } catch (error) {
      console.error("Error during game end processing:", error);
      setGameStatus("lost");
    }
  };

  const moveSnake = useCallback(() => {
    if (gameStatus !== "playing") return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    // Move head based on direction
    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    // Check wall collisions
    if (
      head.x < 0 ||
      head.x >= BOARD_WIDTH ||
      head.y < 0 ||
      head.y >= BOARD_HEIGHT
    ) {
      handleGameEnd(false);
      return;
    }

    // Check self-collision
    if (
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      handleGameEnd(false);
      return;
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      setScore((prevScore) => prevScore + 10);
      setFood(generateFood());
      setSpeed((prevSpeed) => Math.max(50, prevSpeed - 10));
    } else {
      newSnake.pop();
    }

    newSnake.unshift(head);
    setSnake(newSnake);
  }, [snake, direction, food, gameStatus, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameStatus]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood(generateFood());
    setDirection("RIGHT");
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setGameStatus("waiting");
    setTimeLeft(GAME_DURATION);
  };

  const handleTouchStart = (e) => {
    if (gameStatus !== "playing") return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || gameStatus !== "playing") return;

    const touch = e.changedTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && direction !== "LEFT") setDirection("RIGHT");
      else if (deltaX < 0 && direction !== "RIGHT") setDirection("LEFT");
    } else {
      if (deltaY > 0 && direction !== "UP") setDirection("DOWN");
      else if (deltaY < 0 && direction !== "DOWN") setDirection("UP");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#90e0ef]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#03045e]">
          Blockchain Snake Game
        </h1>
        {gameStatus === "playing" && (
          <div className="text-xl mt-2 flex justify-between text-[#03045e]">
            <span>
              Score: <span className="font-bold">{score}</span>
            </span>
            <span>
              Time Left: <span className="font-bold">{timeLeft} s</span>
            </span>
          </div>
        )}
      </div>

      {!contract ? (
        <div className="text-red-500 font-bold">
          Please connect wallet through Navbar
        </div>
      ) : gameStatus === "waiting" ? (
        <button
          onClick={startGame}
          className="bg-[#0077b6] hover:bg-[#003049] text-[#90e0ef] font-bold py-2 px-4 rounded"
        >
          Pay Entry Fee & Start Game
        </button>
      ) : (
        <>
          {(gameStatus === "lost" || gameStatus === "won") && (
            <div className="absolute z-10 bg-[#0077b6] p-6 rounded-lg shadow-xl text-center">
              <h2 className="text-2xl font-bold text-[#90e0ef] mb-4">
                {gameStatus === "won" ? "Congratulations!" : "Game Over!"}
              </h2>
              <p className="mb-4 text-[#90e0ef]">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-[#003049] hover:bg-[#002439] text-[#90e0ef] font-bold py-2 px-4 rounded"
              >
                Play Again
              </button>
            </div>
          )}

          <div
            className="relative border-4 border-[#0077b6]"
            style={{
              width: `${BOARD_PIXEL_WIDTH + 4}px`,
              height: `${BOARD_PIXEL_HEIGHT + 4}px`,
              backgroundColor: "#90e0ef",
            }}
          >
            {/* Snake segments */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute ${
                  index === 0 ? "bg-[#0077b6]" : "bg-[#003049]"
                }`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                }}
              />
            ))}

            {/* Food */}
            <div
              className="absolute bg-[#d00000]"
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                left: `${food.x * CELL_SIZE}px`,
                top: `${food.y * CELL_SIZE}px`,
              }}
            />
          </div>
        </>
      )}

      <div className="mt-4 text-sm text-[#03045e]">
        <p>Use Arrow Keys or Swipe to Control the Snake</p>
        <p>Aim for high score within 60 seconds!</p>
      </div>
    </div>
  );
};

export default SnakeGame;
