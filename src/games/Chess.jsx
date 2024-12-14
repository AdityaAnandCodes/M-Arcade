import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [difficulty, setDifficulty] = useState("easy");

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
  };

  useEffect(() => {
    if (game.turn() === "b") {
      const timer = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [game]);

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to queen for simplicity
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetGame = () => {
    setGame(new Chess());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Chess vs Computer</h1>
          <button
            onClick={resetGame}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Game
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-gray-700">Board Orientation</label>
            <select
              value={boardOrientation}
              onChange={(e) => setBoardOrientation(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="white">White Perspective</option>
              <option value="black">Black Perspective</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="w-full max-w-[600px] mx-auto">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={boardOrientation}
          />
        </div>

        <div className="mt-4 text-center">
          {game.isCheckmate() && <p className="text-red-500">Checkmate!</p>}
          {game.isDraw() && <p className="text-blue-500">Draw!</p>}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
