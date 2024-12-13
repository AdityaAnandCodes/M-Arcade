import { Circle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants_contract";

const Navbar = ({ onWalletAddressUpdate }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) =>
    location.pathname === path ? "fill-black max-sm:fill-white" : "";

  const connectWalletAndRegister = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const network = await provider.getNetwork();
        if (network.chainId !== 5003) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x138B" }], // Replace with your Chain ID
          });
        }

        // Connect to contract
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        let playerNameLocal = playerName; // Use a different name to avoid conflicts
        if (!playerNameLocal) {
          try {
            // Attempt to get existing player name from contract
            const existingPlayerName = await contractInstance.playerNames(
              address
            );

            // If an existing name is found, use it
            if (existingPlayerName) {
              playerNameLocal = existingPlayerName;
              setPlayerName(existingPlayerName);
            }
          } catch (error) {
            console.error("Error checking existing player name:", error);
          }
        }

        // If still no name, prompt for registration
        if (!playerNameLocal) {
          alert("Please provide a name to register.");
          return;
        }

        // Call registerPlayer (which now handles existing players)
        const tx = await contractInstance.registerPlayer(playerNameLocal);
        await tx.wait();

        setWalletConnected(true);
        setWalletAddress(address);

        // Pass the wallet address up to the parent component
        onWalletAddressUpdate(address);

        alert(
          `Wallet connected${playerNameLocal ? ` as ${playerNameLocal}` : ""}`
        );
      } catch (error) {
        console.error("Error connecting wallet and registering:", error);
        alert("Failed to connect wallet or register.");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 sm:px-6 md:px-8 relative z-10">
      {/* Logo */}
      <Link to="/">
        <div className="logo text-2xl sm:text-3xl md:text-4xl font-bold focus:border-none">
          M-Arcade
        </div>
      </Link>

      {/* Hamburger Menu for Mobile */}
      <div 
        className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2" 
        onClick={toggleMobileMenu}
      >
        <Circle
          className={`${
            isMobileMenuOpen ? "fill-black" : ""
          } w-6 h-6 cursor-pointer transition-all duration-300 hover:scale-110`}
        />
      </div>

      {/* Navigation and Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "flex text-white" : "hidden"
        } sm:flex flex-col sm:flex-row gap-10 justify-center items-center font-bold text-sm sm:text-base md:text-lg absolute sm:relative left-0 w-full sm:w-auto bg-black sm:bg-transparent p-4 max-sm:z-20 sm:p-0 top-full sm:top-0`}
      >
        <Link to="/">
          <div className="flex gap-2 justify-center items-center transition-all duration-300 hover:scale-110 hover:text-black">
            <Circle className={`w-3 h-3 ${isActive("/")}`} />
            Home
          </div>
        </Link>
        <Link to="/games">
          <div className="flex gap-2 justify-center items-center transition-all duration-300 hover:scale-110 hover:text-black">
            <Circle className={`w-3 h-3 ${isActive("/games")}`} />
            Games
          </div>
        </Link>
        <Link to="/leaderboard">
          <div className="flex gap-2 justify-center items-center transition-all duration-300 hover:scale-110 hover:text-black">
            <Circle className={`w-3 h-3 ${isActive("/leaderboard")}`} />
            Leaderboard
          </div>
        </Link>

        {/* Sign Up / Wallet Button */}
        {!isWalletConnected ? (
          <div className="sm:hidden flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="p-2 border rounded-md"
            />
            <button
              onClick={connectWalletAndRegister}
              className="p-2 px-3 rounded-3xl border border-black text-sm sm:text-base md:text-lg mt-4 sm:mt-0"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="p-2 px-3 block sm:hidden rounded-3xl border border-green-500 text-sm sm:text-base md:text-lg mt-4 sm:mt-0 text-green-500">
            {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`}
          </div>
        )}
      </div>

      {/* Regular Connect Wallet Button for Desktop */}
      {!isWalletConnected ? (
        <div className="hidden sm:flex gap-2 items-center">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={connectWalletAndRegister}
            className="p-2 px-3 rounded-3xl border border-black text-sm sm:text-base md:text-lg hover:bg-black hover:text-white hover:scale-105 duration-300 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="hidden sm:block p-2 px-3 rounded-3xl border border-black text-sm sm:text-base md:text-lg text-black hover:bg-black hover:text-white duration-500 transition-all">
          {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
            -4
          )}`}
        </div>
      )}
    </nav>
  );
};

export default Navbar;