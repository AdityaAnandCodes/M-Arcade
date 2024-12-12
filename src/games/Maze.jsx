import React, { useState, useEffect, useCallback, useRef } from "react";

// Maze generation algorithm using recursive backtracking
const generateMaze = (width, height) => {
  // Create a grid filled with walls
  const maze = Array(height)
    .fill()
    .map(() => Array(width).fill(1));

  const isValidCell = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

  const carve = (x, y) => {
    maze[y][x] = 0;

    // Randomize directions to create more interesting paths
    const directions = [
      [0, 1], // Down
      [1, 0], // Right
      [0, -1], // Up
      [-1, 0], // Left
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (isValidCell(nx, ny) && maze[ny][nx] === 1) {
        maze[y + dy][x + dx] = 0;
        carve(nx, ny);
      }
    }
  };

  // Start carving from a random point
  const startX = Math.floor(Math.random() * (width / 2)) * 2 + 1;
  const startY = Math.floor(Math.random() * (height / 2)) * 2 + 1;
  carve(startX, startY);

  // Set start and end points
  maze[1][1] = 2; // Green start point
  maze[height - 2][width - 2] = 3; // Red end point

  return maze;
};

const ProceduralMazeGame = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameStatus, setGameStatus] = useState("playing");
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  const MAZE_WIDTH = 21;
  const MAZE_HEIGHT = 21;

  // Initialize maze and timer
  useEffect(() => {
    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameStatus("playing");
    setTimeLeft(30);

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameStatus("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or game reset
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle player movement
  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameStatus !== "playing") return;

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Check if move is valid (within maze and not a wall)
      if (
        newX >= 0 &&
        newX < MAZE_WIDTH &&
        newY >= 0 &&
        newY < MAZE_HEIGHT &&
        maze[newY][newX] !== 1
      ) {
        setPlayerPos({ x: newX, y: newY });

        // Check for win condition
        if (maze[newY][newX] === 3) {
          clearInterval(timerRef.current);
          setGameStatus("won");
        }
      }
    },
    [playerPos, maze, gameStatus]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  // Regenerate maze
  const resetMaze = () => {
    // Clear existing timer if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameStatus("playing");
    setTimeLeft(30);

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameStatus("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Maze Game</h1>

      {/* Timer Display */}
      <div className="mb-4 text-2xl font-bold">
        Time Left:
        <span
          className={`ml-2 ${
            timeLeft <= 10 ? "text-red-500" : "text-green-500"
          }`}
        >
          {timeLeft} seconds
        </span>
      </div>

      {/* Maze Grid */}
      <div
        className="grid gap-0 border-2 border-gray-400"
        style={{
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, 20px)`,
          gridTemplateRows: `repeat(${MAZE_HEIGHT}, 20px)`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            let cellClass = "w-5 h-5 border border-gray-300";

            // Coloring different cell types
            if (cell === 1) cellClass += " bg-gray-700"; // Wall
            if (cell === 2) cellClass += " bg-green-500"; // Start
            if (cell === 3) cellClass += " bg-red-500"; // End

            // Player position
            if (x === playerPos.x && y === playerPos.y) {
              cellClass += " bg-blue-500";
            }

            return <div key={`${x}-${y}`} className={cellClass} />;
          })
        )}
      </div>

      {/* Game Status and Reset */}
      {(gameStatus === "won" || gameStatus === "lost") && (
        <div className="mt-4 text-center">
          {gameStatus === "won" && (
            <p className="text-2xl font-bold text-green-600">
              Congratulations! You Won!
            </p>
          )}
          {gameStatus === "lost" && (
            <p className="text-2xl font-bold text-red-600">
              Time's Up! You Lost!
            </p>
          )}
          <button
            onClick={resetMaze}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Use arrow keys to navigate. Green square is the start, red is the end.
          Reach the end before time runs out!
        </p>
      </div>
    </div>
  );
};

export default ProceduralMazeGame;