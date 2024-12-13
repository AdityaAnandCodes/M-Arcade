import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Games from "./pages/Games";
import Home2 from "./pages/Home2";
import MemoryMatch from "./games/MemoryMatch";
import ProceduralMazeGame from "./games/Maze";
import SnakeGame from "./games/SnakeGame";
import PingPongGame from "./games/PingPong";
import NFT from "./pages/NFT";
import CandyMinesweeper from "./games/CandySweeper";
import Navbar from "./components/Navbar";
import Leaderboard from "./pages/LeaderBoard";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleWalletAddressUpdate = (address) => {
    setWalletAddress(address);
  };

  return (
    <Router>
      <Navbar onWalletAddressUpdate={handleWalletAddressUpdate} />
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route
          path="/games"
          element={<Games walletAddress={walletAddress} />}
        />
        <Route
          path="/leaderboard"
          element={<Leaderboard walletAddress={walletAddress} />}
        />
        ;
        <Route path="/nft" element={<NFT walletAddress={walletAddress} />} />
        <Route
          path="/games/memory-match"
          element={<MemoryMatch walletAddress={walletAddress} />}
        />
        <Route
          path="/games/maze"
          element={<ProceduralMazeGame walletAddress={walletAddress} />}
        />
        <Route
          path="/games/snake"
          element={<SnakeGame walletAddress={walletAddress} />}
        />
        <Route
          path="/games/ping-pong"
          element={<PingPongGame walletAddress={walletAddress} />}
        />
        <Route
          path="/games/candy-minesweeper"
          element={<CandyMinesweeper walletAddress={walletAddress} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
