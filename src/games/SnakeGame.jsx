import React, { useState, useEffect, useCallback } from "react";

const SnakeGame = ({walletAddress}) => {
  const BOARD_WIDTH = 20; // Number of cells horizontally
  const BOARD_HEIGHT = 20; // Number of cells vertically
  const CELL_SIZE = 20; // Size of each cell in pixels

  const BOARD_PIXEL_WIDTH = BOARD_WIDTH * CELL_SIZE;
  const BOARD_PIXEL_HEIGHT = BOARD_HEIGHT * CELL_SIZE;
  const INITIAL_SPEED = 200; // Initial speed in milliseconds

  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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

  const moveSnake = useCallback(() => {
    if (gameOver) return;

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
      setGameOver(true);
      return;
    }

    // Check self-collision
    if (
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
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
  }, [snake, direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood(generateFood());
    setDirection("RIGHT");
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setGameOver(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

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
        <h1 className="text-3xl font-bold text-[#03045e]">Snake Game</h1>
        <div className="text-xl mt-2 text-[#03045e]">
          Score: <span className="font-bold text-[#03045e]">{score}</span>
        </div>
      </div>

      {gameOver && (
        <div className="absolute z-10 bg-[#0077b6] p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-[#90e0ef] mb-4">Game Over!</h2>
          <p className="mb-4 text-[#90e0ef]">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-[#003049] hover:bg-[#002439] text-[#90e0ef] font-bold py-2 px-4 rounded"
          >
            Restart Game
          </button>
        </div>
      )}

      <div
        className="relative border-4 border-[#0077b6]"
        style={{
          width: `${BOARD_PIXEL_WIDTH + 4}px`, // Adjust for border size
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

      <div className="mt-4 text-sm text-[#03045e]">
        <p>Use Arrow Keys or Swipe to Control the Snake</p>
      </div>
    </div>
  );
};

export default SnakeGame;
