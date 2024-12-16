import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import confetti from "canvas-confetti";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    startVelocity: 30,
    spread: 360,
    origin: { x: 0.5, y: 0.5 },
    ticks: 200,
  });
};

const PingPongGame = ({ walletAddress }) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [contract, setContract] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const gameAreaRef = useRef(null);

  const keysPressed = useRef({
    ArrowUp: false,
    ArrowDown: false,
    touchY: null,
  });

  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [paddlePosition, setPaddlePosition] = useState({
    player: 50,
    computer: 50,
  });

  // Responsive game dimensions
  const [gameDimensions, setGameDimensions] = useState({
    width: 600,
    height: 400,
  });

  // Responsive constants
  const PADDLE_HEIGHT = gameDimensions.height * 0.25; // 25% of game height
  const PADDLE_WIDTH = Math.max(gameDimensions.width * 0.02, 10); // 2% of width, min 10px
  const BALL_SIZE = Math.max(gameDimensions.width * 0.02, 10); // 2% of width, min 10px
  const BALL_SPEED = gameDimensions.width * 0.005; // 0.5% of width
  const PADDLE_SPEED = gameDimensions.height * 0.02; // 2% of height
  const PADDLE_ACCELERATION = 0.7;

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);

      if (gameAreaRef.current) {
        const maxWidth = Math.min(window.innerWidth * 0.9, 600);
        const maxHeight = Math.min(window.innerHeight * 0.6, 400);

        setGameDimensions({
          width: maxWidth,
          height: maxHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile touch controls
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      keysPressed.current.touchY = touch.clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      const relativeY = touch.clientY - gameRect.top;
      const paddlePos = Math.max(
        0,
        Math.min(gameDimensions.height - PADDLE_HEIGHT, relativeY)
      );
      setPaddlePosition((prev) => ({ ...prev, player: paddlePos }));
    };

    const handleTouchEnd = () => {
      keysPressed.current.touchY = null;
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener("touchstart", handleTouchStart);
      gameArea.addEventListener("touchmove", handleTouchMove);
      gameArea.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (gameArea) {
        gameArea.removeEventListener("touchstart", handleTouchStart);
        gameArea.removeEventListener("touchmove", handleTouchMove);
        gameArea.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile, gameDimensions.height]);

  // Initialize contract
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

  // Game start and completion handlers remain the same
  const startGame = async () => {
    try {
      if (!contract) return;

      const entryFee = ethers.parseEther("0.01");
      await contract.enterGame(entryFee, { value: entryFee });
      alert("Entry fee paid. Starting the game!");

      setPlayerScore(0);
      setComputerScore(0);
      setGameStatus("playing");
      resetBall();
    } catch (error) {
      console.error("Error paying entry fee:", error);
    }
  };

  const handleGameCompletion = async (won) => {
    if (!contract) return;

    try {
      if (won) {
        triggerConfetti();
        const prizeAmount = ethers.parseEther("0.02");
        const payTx = await contract.payWinner(walletAddress, prizeAmount);
        await payTx.wait();
        alert("Congratulations! Prize Transferred!");

        if (computerScore === 0) {
          const mintTx = await contract.mintWinningNFT(1);
          await mintTx.wait();
          alert("Perfect game! Special NFT minted!");
        }
      }
    } catch (error) {
      console.error("Error during NFT or payment processing:", error);
    }
  };

  const resetBall = () => {
    setBallPosition({
      x: gameDimensions.width / 2,
      y: gameDimensions.height / 2,
    });

    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    setBallVelocity({
      x: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
      y: BALL_SPEED * Math.sin(angle),
    });
  };

  // Game loop
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysPressed.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysPressed.current[e.key] = false;
      }
    };

    const gameLoop = () => {
      if (!isMobile) {
        setPaddlePosition((prev) => {
          let newPlayerPosition = prev.player;

          if (keysPressed.current.ArrowUp) {
            newPlayerPosition = Math.max(
              0,
              newPlayerPosition - PADDLE_SPEED * PADDLE_ACCELERATION
            );
          }
          if (keysPressed.current.ArrowDown) {
            newPlayerPosition = Math.min(
              gameDimensions.height - PADDLE_HEIGHT,
              newPlayerPosition + PADDLE_SPEED * PADDLE_ACCELERATION
            );
          }

          return { ...prev, player: newPlayerPosition };
        });
      }

      // Computer paddle AI
      setPaddlePosition((prev) => {
        const computerPaddleCenter = prev.computer + PADDLE_HEIGHT / 2;
        const speed = PADDLE_SPEED * 0.6; // Slightly slower than player

        if (computerPaddleCenter < ballPosition.y) {
          return {
            ...prev,
            computer: Math.min(
              prev.computer + speed,
              gameDimensions.height - PADDLE_HEIGHT
            ),
          };
        } else {
          return {
            ...prev,
            computer: Math.max(prev.computer - speed, 0),
          };
        }
      });

      // Ball movement and collision
      setBallPosition((prevBallPosition) => {
        let newX = prevBallPosition.x + ballVelocity.x;
        let newY = prevBallPosition.y + ballVelocity.y;

        if (newY <= 0) {
          newY = 0;
          setBallVelocity((prev) => ({ ...prev, y: Math.abs(prev.y) }));
        } else if (newY >= gameDimensions.height - BALL_SIZE) {
          newY = gameDimensions.height - BALL_SIZE;
          setBallVelocity((prev) => ({ ...prev, y: -Math.abs(prev.y) }));
        }

        const isPlayerPaddleCollision =
          newX <= PADDLE_WIDTH &&
          newY >= paddlePosition.player &&
          newY <= paddlePosition.player + PADDLE_HEIGHT;

        const isComputerPaddleCollision =
          newX >= gameDimensions.width - PADDLE_WIDTH - BALL_SIZE &&
          newY >= paddlePosition.computer &&
          newY <= paddlePosition.computer + PADDLE_HEIGHT;

        if (isPlayerPaddleCollision) {
          newX = PADDLE_WIDTH;
          setBallVelocity((prev) => ({
            x: Math.abs(prev.x),
            y:
              prev.y +
              (newY - (paddlePosition.player + PADDLE_HEIGHT / 2)) * 0.2,
          }));
        } else if (isComputerPaddleCollision) {
          newX = gameDimensions.width - PADDLE_WIDTH - BALL_SIZE;
          setBallVelocity((prev) => ({
            x: -Math.abs(prev.x),
            y:
              prev.y +
              (newY - (paddlePosition.computer + PADDLE_HEIGHT / 2)) * 0.2,
          }));
        }

        if (newX <= 0) {
          setComputerScore((prev) => {
            if (prev + 1 === 10) {
              setGameStatus("gameOver");
              return prev + 1;
            }
            resetBall();
            return prev + 1;
          });
        } else if (newX >= gameDimensions.width - BALL_SIZE) {
          setPlayerScore((prev) => {
            if (prev + 1 === 10) {
              setGameStatus("gameOver");
              handleGameCompletion(true);
              return prev + 1;
            }
            resetBall();
            return prev + 1;
          });
        }

        return { x: newX, y: newY };
      });
    };

    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }

    const interval = setInterval(gameLoop, 16);

    return () => {
      clearInterval(interval);
      if (!isMobile) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [
    gameStatus,
    ballPosition,
    ballVelocity,
    paddlePosition,
    isMobile,
    gameDimensions,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">Ping Pong Game</h1>

      {gameStatus !== "waiting" && (
        <div className="mb-4 text-2xl">
          <span className="mr-4">Player: {playerScore}</span>
          <span>Computer: {computerScore}</span>
        </div>
      )}

      {!contract ? (
        <div className="text-red-500 font-bold text-center">
          Please connect wallet through Navbar
        </div>
      ) : gameStatus === "waiting" ? (
        <>
          <div className="bg-gray-50 p-6 rounded-lg w-96 shadow-sm border border-gray-200 mb-4">
            <h2 className="text-xl font-semibold mb-4">Game Details</h2>
            <div className="space-y-3 text-gray-600">
              <p>🎮 Entry Fee: 0.01 MNT</p>
              <p>🏆 Potential Prize: 0.02 MNT</p>
              <p>⭐ Special NFT for quick wins!</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-96 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 hover:scale-105 duration-500 transition-all"
          >
            Pay Entry Fee & Start Game
          </button>
        </>
      ) : (
        <div
          ref={gameAreaRef}
          className="relative border-2 border-black overflow-hidden touch-none"
          style={{
            width: `${gameDimensions.width}px`,
            height: `${gameDimensions.height}px`,
            cursor: gameStatus !== "playing" ? "pointer" : "none",
          }}
        >
          {gameStatus !== "playing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <p className="text-3xl">
                {gameStatus === "gameOver" ? "Game Over" : "Click to Start"}
              </p>
            </div>
          )}

          <div
            className="absolute bg-black"
            style={{
              left: 0,
              top: `${paddlePosition.player}px`,
              width: `${PADDLE_WIDTH}px`,
              height: `${PADDLE_HEIGHT}px`,
            }}
          />

          <div
            className="absolute bg-black"
            style={{
              right: 0,
              top: `${paddlePosition.computer}px`,
              width: `${PADDLE_WIDTH}px`,
              height: `${PADDLE_HEIGHT}px`,
            }}
          />

          <div
            className="absolute bg-black rounded-full"
            style={{
              left: `${ballPosition.x}px`,
              top: `${ballPosition.y}px`,
              width: `${BALL_SIZE}px`,
              height: `${BALL_SIZE}px`,
            }}
          />
        </div>
      )}

      <div className="mt-4 text-center text-gray-700">
        <p>
          {isMobile
            ? "Touch and drag to move your paddle"
            : "Use Arrow Up and Arrow Down to move your paddle"}
        </p>
        <p>First to score 10 points wins!</p>
      </div>
    </div>
  );
};

export default PingPongGame;
