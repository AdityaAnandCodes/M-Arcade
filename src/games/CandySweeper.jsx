import React, { useState, useEffect } from 'react';

const generateBoard = () => {
  const totalSquares = 16;
  const board = Array(totalSquares).fill().map(() => ({
    content: '',
    isRevealed: false,
    isMine: false
  }));

  // Place 4 mines
  let minesPlaced = 0;
  while (minesPlaced < 3) {
    const index = Math.floor(Math.random() * totalSquares);
    if (!board[index].isMine) {
      board[index].isMine = true;
      board[index].content = 'bomb';
      minesPlaced++;
    }
  }

  // Place 4 candies
  let candiesPlaced = 0;
  while (candiesPlaced < 4) {
    const index = Math.floor(Math.random() * totalSquares);
    if (!board[index].isMine && board[index].content === '') {
      board[index].content = 'candy';
      candiesPlaced++;
    }
  }

  // Fill remaining with empty
  board.forEach(square => {
    if (square.content === '') {
      square.content = 'empty';
    }
  });

  return board;
};

const CandyMinesweeper = () => {
  const [board, setBoard] = useState(generateBoard());
  const [revealedCount, setRevealedCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');

  const handleSquareClick = (index) => {
    if (gameStatus !== 'playing' || board[index].isRevealed) return;

    const newBoard = [...board];
    newBoard[index].isRevealed = true;

    // Check game conditions
    if (newBoard[index].content === 'bomb') {
      setGameStatus('lost');
    } else {
      const newRevealedCount = newBoard.filter(square => square.isRevealed).length;
      setRevealedCount(newRevealedCount);

      // Win condition: 8 squares revealed without hitting a bomb
      if (newRevealedCount >= 8) {
        setGameStatus('won');
      }
    }

    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(generateBoard());
    setRevealedCount(0);
    setGameStatus('playing');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black font-sans">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Candy Minesweeper
        </h1>

        {gameStatus === 'playing' && (
          <p className="text-center mb-4">
            Reveal 8 squares without hitting a bomb!
          </p>
        )}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              className={`
                w-full aspect-square border-2 rounded-lg
                transition-all duration-200 ease-in-out
                flex items-center justify-center
                ${!square.isRevealed 
                  ? 'bg-gray-200 hover:bg-gray-300' 
                  : square.content === 'bomb' 
                    ? 'bg-red-500 text-white' 
                    : square.content === 'candy' 
                      ? 'bg-pink-300 text-white' 
                      : 'bg-green-200'}
                text-3xl font-bold
              `}
              disabled={square.isRevealed || gameStatus !== 'playing'}
            >
              {square.isRevealed 
                ? (square.content === 'bomb' 
                    ? '💣' 
                    : square.content === 'candy' 
                      ? '🍬' 
                      : '✨')
                : ''}
            </button>
          ))}
        </div>

        {gameStatus === 'lost' && (
          <div className="text-center text-red-600 mb-4">
            <p className="text-xl font-bold">Game Over!</p>
            <p>You hit a bomb. Better luck next time!</p>
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="text-center text-green-600 mb-4">
            <p className="text-xl font-bold">Congratulations!</p>
            <p>You successfully avoided the bombs!</p>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={resetGame}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandyMinesweeper;