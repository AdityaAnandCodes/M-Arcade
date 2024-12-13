import React, { useState, useEffect, useRef } from "react";

const PingPongGame = ({walletAddress}) => {
  // Game state
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("start");

  // Keyboard state
  const keysPressed = useRef({
    ArrowUp: false,
    ArrowDown: false,
  });

  // Ball and game physics
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [paddlePosition, setPaddlePosition] = useState({
    player: 50,
    computer: 50,
  });

  // Game constants
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;

  // Physics tuning
  const BALL_SPEED = 3;
  const PADDLE_SPEED = 8;
  const PADDLE_ACCELERATION = 0.7;

  // Initialize game
  const startGame = () => {
    setGameStatus("playing");
    setPlayerScore(0);
    setComputerScore(0);
    resetBall();
  };

  // Reset ball to center with random direction
  const resetBall = () => {
    setBallPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });

    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    setBallVelocity({
      x: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
      y: BALL_SPEED * Math.sin(angle),
    });
  };

  // Consolidated game loop and physics
  useEffect(() => {
    if (gameStatus !== "playing") return;

    // Keyboard event handlers
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
      // Smooth player paddle movement
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
            GAME_HEIGHT - PADDLE_HEIGHT,
            newPlayerPosition + PADDLE_SPEED * PADDLE_ACCELERATION
          );
        }

        return { ...prev, player: newPlayerPosition };
      });

      // Computer paddle AI
      setPaddlePosition((prev) => {
        const computerPaddleCenter = prev.computer + PADDLE_HEIGHT / 2;
        if (computerPaddleCenter < ballPosition.y) {
          return {
            ...prev,
            computer: Math.min(prev.computer + 2, GAME_HEIGHT - PADDLE_HEIGHT),
          };
        } else {
          return {
            ...prev,
            computer: Math.max(prev.computer - 2, 0),
          };
        }
      });

      // Ball movement and collision detection
      setBallPosition((prevBallPosition) => {
        let newX = prevBallPosition.x + ballVelocity.x;
        let newY = prevBallPosition.y + ballVelocity.y;

        // Strict boundary checks
        // Ensure ball stays within game height
        if (newY <= 0) {
          newY = 0;
          setBallVelocity((prevVelocity) => ({
            ...prevVelocity,
            y: Math.abs(prevVelocity.y),
          }));
        } else if (newY >= GAME_HEIGHT - BALL_SIZE) {
          newY = GAME_HEIGHT - BALL_SIZE;
          setBallVelocity((prevVelocity) => ({
            ...prevVelocity,
            y: -Math.abs(prevVelocity.y),
          }));
        }

        // Paddle collisions
        const isPlayerPaddleCollision =
          newX <= PADDLE_WIDTH &&
          newY >= paddlePosition.player &&
          newY <= paddlePosition.player + PADDLE_HEIGHT;

        const isComputerPaddleCollision =
          newX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newY >= paddlePosition.computer &&
          newY <= paddlePosition.computer + PADDLE_HEIGHT;

        if (isPlayerPaddleCollision) {
          newX = PADDLE_WIDTH;
          setBallVelocity((prevVelocity) => ({
            x: Math.abs(prevVelocity.x),
            y:
              prevVelocity.y +
              (newY - (paddlePosition.player + PADDLE_HEIGHT / 2)) * 0.2,
          }));
        } else if (isComputerPaddleCollision) {
          newX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE;
          setBallVelocity((prevVelocity) => ({
            x: -Math.abs(prevVelocity.x),
            y:
              prevVelocity.y +
              (newY - (paddlePosition.computer + PADDLE_HEIGHT / 2)) * 0.2,
          }));
        }

        // Scoring
        if (newX <= 0) {
          setComputerScore((prevScore) => {
            if (prevScore + 1 === 10) {
              setGameStatus("gameOver");
              return prevScore + 1;
            }
            resetBall();
            return prevScore + 1;
          });
        } else if (newX >= GAME_WIDTH - BALL_SIZE) {
          setPlayerScore((prevScore) => {
            if (prevScore + 1 === 10) {
              setGameStatus("gameOver");
              return prevScore + 1;
            }
            resetBall();
            return prevScore + 1;
          });
        }

        return { x: newX, y: newY };
      });
    };

    // Set up event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Run game loop at 60 FPS
    const interval = setInterval(gameLoop, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStatus, ballPosition, ballVelocity, paddlePosition]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Ping Pong Game</h1>

      {/* Scoreboard */}
      <div className="mb-4 text-2xl">
        <span className="mr-4">Player: {playerScore}</span>
        <span>Computer: {computerScore}</span>
      </div>

      {/* Game Area */}
      <div
        className="relative border-2 border-white overflow-hidden"
        style={{
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          cursor: gameStatus !== "playing" ? "pointer" : "none",
        }}
        onClick={gameStatus !== "playing" ? startGame : undefined}
      >
        {gameStatus !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-3xl">
              {gameStatus === "start" ? "Click to Start" : "Game Over"}
            </p>
          </div>
        )}

        {/* Player Paddle */}
        <div
          className="absolute bg-white"
          style={{
            left: 0,
            top: `${paddlePosition.player}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`,
          }}
        />

        {/* Computer Paddle */}
        <div
          className="absolute bg-white"
          style={{
            right: 0,
            top: `${paddlePosition.computer}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`,
          }}
        />

        {/* Ball */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            left: `${ballPosition.x}px`,
            top: `${ballPosition.y}px`,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
          }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-300">
        <p>Use Arrow Up and Arrow Down to move your paddle</p>
        <p>First to score 10 points wins!</p>
      </div>
    </div>
  );
};

export default PingPongGame;
