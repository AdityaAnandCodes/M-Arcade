import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants_contract";

const generateMaze = (width, height) => {
  const maze = Array(height)
    .fill()
    .map(() => Array(width).fill(1));

  const isValidCell = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

  const carve = (x, y) => {
    maze[y][x] = 0;
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
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

  const startX = Math.floor(Math.random() * (width / 2)) * 2 + 1;
  const startY = Math.floor(Math.random() * (height / 2)) * 2 + 1;
  carve(startX, startY);

  maze[1][1] = 2;
  maze[height - 2][width - 2] = 3;

  return maze;
};

const ProceduralMazeGame = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameStatus, setGameStatus] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState(30);
  const [walletConnected, setWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const timerRef = useRef(null);

  const MAZE_WIDTH = 21;
  const MAZE_HEIGHT = 21;

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
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

        const address = await signer.getAddress();
        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        setUserAddress(address);
        setContract(gameContract);
        setWalletConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const startGame = async () => {
    try {
      if (!contract) return;

      await contract.enterGame({ value: ethers.parseEther("0.01") });
      alert("Entry fee paid. Starting the game!");

      // Initialize maze and start timer
      const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
      setMaze(newMaze);
      setPlayerPos({ x: 1, y: 1 });
      setGameStatus("playing");
      setTimeLeft(30);

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
    } catch (error) {
      console.error("Error paying entry fee:", error);
    }
  };

  const movePlayer = useCallback(
    async (dx, dy) => {
      if (gameStatus !== "playing" || !walletConnected || !contract) return;

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      if (
        newX >= 0 &&
        newX < MAZE_WIDTH &&
        newY >= 0 &&
        newY < MAZE_HEIGHT &&
        maze[newY][newX] !== 1
      ) {
        setPlayerPos({ x: newX, y: newY });

        if (maze[newY][newX] === 3) {
          clearInterval(timerRef.current);
          setGameStatus("won");

          try {
            // Pay the winner
            const payTx = await contract.payWinner(userAddress);
            await payTx.wait();
            alert("Congratulations! Token Transferred");

            // If won within 10 seconds, mint an additional NFT
            if (timeLeft > 15) {
              const mintTx = await contract.mintWinningNFT(1);
              await mintTx.wait();
              alert("You won within 10 seconds! Special NFT minted!");
            }
          } catch (error) {
            console.error("Error during NFT or payment processing:", error);
          }
        }
      }
    },
    [playerPos, maze, gameStatus, walletConnected, contract, timeLeft]
  );

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Maze Game</h1>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      ) : gameStatus === "waiting" ? (
        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Pay Entry Fee & Start Game
        </button>
      ) : (
        <>
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

                if (cell === 1) cellClass += " bg-gray-700";
                if (cell === 2) cellClass += " bg-green-500";
                if (cell === 3) cellClass += " bg-red-500";
                if (x === playerPos.x && y === playerPos.y) {
                  cellClass += " bg-blue-500";
                }

                return <div key={`${x}-${y}`} className={cellClass} />;
              })
            )}
          </div>

          {gameStatus !== "playing" && (
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
            </div>
          )}
        </>
      )}

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
