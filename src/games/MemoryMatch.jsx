

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from  '@/components/ui/card';


const Page = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState('playing');

  const MAX_MOVES = 50;
  const TOTAL_TIME = 120;

  // Generate cards for the game
  const initializeGame = () => {
    const symbols = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'];
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
    setGameStatus('playing');
  };

  // Time and moves tracking
  useEffect(() => {
    let timer;
    if (gameStatus === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setGameStatus('lost');
      setGameOver(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  // Handle card click
  const handleCardClick = (clickedCard) => {
    if (
      selectedCards.length >= 2 || 
      matchedPairs.includes(clickedCard.id) || 
      clickedCard.isFlipped ||
      gameStatus !== 'playing'
    ) return;

    setMoves(prev => prev + 1);

    // Check for game over on moves
    if (moves + 1 >= MAX_MOVES) {
      setGameStatus('lost');
      setGameOver(true);
      return;
    }

    const newCards = cards.map(card => 
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
          setGameStatus('won');
          setGameOver(true);
        }
      } else {
        // Flip cards back if no match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstCard.id || card.id === clickedCard.id 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Memory Matching Game</h1>
          
          {/* Game Status Display */}
          <div className="flex justify-between mb-4">
            <div>Moves: {moves}/{MAX_MOVES}</div>
            <div>Time: {timeLeft}s</div>
          </div>

          {gameOver ? (
            <div className="text-center">
              {gameStatus === 'won' ? (
                <p className="text-xl font-semibold text-green-600">🎉 Congratulations! You Won! 🎉</p>
              ) : (
                <p className="text-xl font-semibold text-red-600">Game Over! Try Again</p>
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
                    ${matchedPairs.includes(card.id) 
                      ? 'bg-green-200 opacity-50' 
                      : card.isFlipped 
                        ? 'bg-blue-100' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }
                  `}
                >
                  {card.isFlipped || matchedPairs.includes(card.id) ? card.symbol : '?'}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;