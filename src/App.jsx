import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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

const AppContent = ({ walletAddress, handleWalletAddressUpdate }) => {
  const location = useLocation(); // Get the current route

  // List of routes where Navbar should not appear
  const noNavbarRoutes = [
    "/games/memory-match",
    "/games/maze",
    "/games/candy-minesweeper",
    "/games/ping-pong",
    "/games/snake",
  ];

  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {showNavbar && (
        <Navbar onWalletAddressUpdate={handleWalletAddressUpdate} />
      )}
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
    </div>
  );
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleWalletAddressUpdate = (address) => {
    setWalletAddress(address);
  };

  return (
    <Router>
      <AppContent
        walletAddress={walletAddress}
        handleWalletAddressUpdate={handleWalletAddressUpdate}
      />
    </Router>
  );
};

export default App;
