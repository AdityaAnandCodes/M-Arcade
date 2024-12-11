import React, { useState, useEffect, useCallback } from "react";

const FlappyBird = () => {
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GRAVITY = 2;
  const JUMP_HEIGHT = 50;
  const PIPE_SPEED = 2;

  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [pipes, setPipes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);

  const generatePipes = useCallback(() => {
    const pipeHeight = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP));
    const topPipe = { height: pipeHeight, x: GAME_WIDTH };
    const bottomPipe = {
      height: GAME_HEIGHT - pipeHeight - PIPE_GAP,
      x: GAME_WIDTH,
    };
    return { topPipe, bottomPipe };
  }, [GAME_HEIGHT, PIPE_GAP, GAME_WIDTH]);

  // Start game and reset values
  const startGame = () => {
    setBirdPosition(GAME_HEIGHT / 2);
    setPipes([generatePipes()]);
    setGameOver(false);
    setScore(0);
    setGameRunning(true);
  };

  const handleJump = () => {
    if (!gameRunning) return;
    setBirdPosition((prev) => Math.max(0, prev - JUMP_HEIGHT));
  };

  const detectCollision = useCallback(() => {
    if (birdPosition + BIRD_SIZE >= GAME_HEIGHT) {
      return true;
    }
    for (const pipe of pipes) {
      const withinPipeWidth =
        pipe.topPipe.x < BIRD_SIZE + 50 && pipe.topPipe.x + PIPE_WIDTH > 50;
      const hitsTopPipe = birdPosition < pipe.topPipe.height;
      const hitsBottomPipe =
        birdPosition + BIRD_SIZE > GAME_HEIGHT - pipe.bottomPipe.height;
      if (withinPipeWidth && (hitsTopPipe || hitsBottomPipe)) {
        return true;
      }
    }
    return false;
  }, [birdPosition, pipes]);

  useEffect(() => {
    let gameLoop;
    if (gameRunning && !gameOver) {
      gameLoop = setInterval(() => {
        // Bird Gravity
        setBirdPosition((prev) =>
          Math.min(GAME_HEIGHT - BIRD_SIZE, prev + GRAVITY)
        );

        // Move Pipes
        setPipes((prevPipes) => {
          let updatedPipes = prevPipes.map((pipe) => ({
            topPipe: { ...pipe.topPipe, x: pipe.topPipe.x - PIPE_SPEED },
            bottomPipe: {
              ...pipe.bottomPipe,
              x: pipe.bottomPipe.x - PIPE_SPEED,
            },
          }));

          // Remove pipes that move out of view and add new pipes
          if (
            updatedPipes.length &&
            updatedPipes[0].topPipe.x + PIPE_WIDTH < 0
          ) {
            updatedPipes.shift();
            setScore((prevScore) => prevScore + 1);
          }

          if (
            !updatedPipes.length ||
            updatedPipes[updatedPipes.length - 1].topPipe.x < GAME_WIDTH / 2
          ) {
            updatedPipes.push(generatePipes());
          }

          return updatedPipes;
        });

        // Detect Collision
        if (detectCollision()) {
          setGameOver(true);
          setGameRunning(false);
        }
      }, 20);
    }

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, detectCollision, generatePipes]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#90e0ef]"
      onClick={handleJump}
    >
      <div
        className="relative border-4 border-[#0077b6] bg-[#ade8f4]"
        style={{
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          position: "relative",
        }}
      >
        {/* Bird */}
        <div
          className="absolute bg-[#ff6f61] rounded-full"
          style={{
            width: `${BIRD_SIZE}px`,
            height: `${BIRD_SIZE}px`,
            top: `${birdPosition}px`,
            left: "50px",
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top Pipe */}
            <div
              className="absolute bg-[#0077b6]"
              style={{
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.topPipe.height}px`,
                left: `${pipe.topPipe.x}px`,
                top: 0,
              }}
            />
            {/* Bottom Pipe */}
            <div
              className="absolute bg-[#0077b6]"
              style={{
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.bottomPipe.height}px`,
                left: `${pipe.bottomPipe.x}px`,
                bottom: 0,
              }}
            />
          </React.Fragment>
        ))}

        {/* Game Over */}
        {gameOver && (
          <div
            className="absolute bg-[#0077b6] text-center rounded-lg p-4"
            style={{
              width: "200px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2 className="text-white font-bold text-lg">Game Over</h2>
            <p className="text-white">Score: {score}</p>
            <button
              onClick={startGame}
              className="bg-[#ff6f61] text-white font-bold px-4 py-2 mt-2 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>

      <div className="text-lg text-[#0077b6] mt-4">
        <p>Score: {score}</p>
        <p>Click to jump!</p>
      </div>

      {!gameRunning && !gameOver && (
        <button
          onClick={startGame}
          className="bg-[#003049] text-white font-bold px-4 py-2 mt-4 rounded"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default FlappyBird;
