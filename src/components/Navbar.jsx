import { Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants_contract";

const Navbar = ({ onWalletAddressUpdate }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const location = useLocation();

  useEffect(() => {
    const loadWallet = async () => {
      const storedAddress = localStorage.getItem("walletAddress");
      if (storedAddress && typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          if (address === storedAddress) {
            setWalletConnected(true);
            setWalletAddress(address);
            onWalletAddressUpdate(address);
          }
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
        }
      }
    };

    loadWallet();
  }, [onWalletAddressUpdate]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) =>
    location.pathname === path ? "fill-black max-sm:fill-white" : "";

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setPlayerName("");

    localStorage.removeItem("walletAddress");

    onWalletAddressUpdate("");

    showAlert("Wallet disconnected", "info");
  };

  const connectWalletAndRegister = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request wallet access and enable wallet selection
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Check the network and switch if needed
        const network = await provider.getNetwork();
        if (network.chainId !== 5003) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x138B" }],
          });
        }

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        let playerNameLocal = playerName;
        if (!playerNameLocal) {
          try {
            const existingPlayerName = await contractInstance.playerNames(
              address
            );
            if (existingPlayerName) {
              playerNameLocal = existingPlayerName;
              setPlayerName(existingPlayerName);
            }
          } catch (error) {
            console.error("Error checking existing player name:", error);
          }
        }

        if (!playerNameLocal) {
          showAlert("Please provide a name to register.", "warning");
          return;
        }

        const tx = await contractInstance.registerPlayer(playerNameLocal);
        await tx.wait();

        setWalletConnected(true);
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        onWalletAddressUpdate(address);

        showAlert(
          `Wallet connected${playerNameLocal ? ` as ${playerNameLocal}` : ""}`,
          "success"
        );
      } catch (error) {
        console.error("Error connecting wallet and registering:", error);
        showAlert("Failed to connect wallet or register.", "error");
      }
    } else {
      showAlert("MetaMask is not installed!", "error");
    }
  };

  return (
    <>
      {alert.message && (
        <div
          className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
            alert.type === "success"
              ? "bg-green-500"
              : alert.type === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {alert.message}
        </div>
      )}
      <nav className="w-full flex justify-between items-center p-4 sm:px-6 md:px-8 relative z-10">
        <Link to="/">
          <div className="logo text-2xl sm:text-3xl md:text-4xl font-bold focus:border-none">
            M-Arcade
          </div>
        </Link>
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
        <div
          className={`${
            isMobileMenuOpen ? "flex text-white" : "hidden"
          } sm:flex flex-col md:ml-24 sm:flex-row gap-10 max-sm:gap-2 justify-center items-center font-bold text-sm sm:text-base md:text-lg absolute sm:relative left-0 w-full sm:w-auto bg-black sm:bg-transparent p-4 max-sm:z-20 sm:p-0 top-full sm:top-0`}
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
          <div className="flex gap-2 max-sm:flex-col md:hidden">
                <div className="p-2 px-3 rounded-3xl border border-green-500 text-sm sm:text-base md:text-lg text-green-500">
                  {`Connected: ${walletAddress.slice(
                    0,
                    6
                  )}...${walletAddress.slice(-4)}`}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 px-3 rounded-3xl border border-red-500 text-red-500 text-sm sm:text-base md:text-lg w-full sm:w-auto hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
          </div>
          <div>
          <div className="flex flex-col sm:flex-row gap-2 items-center max-sm:w-full">
            {!isWalletConnected ? (
              <>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="p-2 border rounded-md max-sm:mb-2"
                />
                <button
                  onClick={connectWalletAndRegister}
                  className="p-2 px-3 rounded-3xl border border-black text-sm sm:text-base md:text-lg hover:bg-black hover:text-white hover:scale-105 duration-300 transition-all w-full sm:w-auto"
                >
                  Connect Wallet
                </button>
              </>
            ) : (
              <div className="flex gap-2 max-sm:hidden">
                <div className="p-2 px-3 rounded-3xl border border-green-500 text-sm sm:text-base md:text-lg text-green-500">
                  {`Connected: ${walletAddress.slice(
                    0,
                    6
                  )}...${walletAddress.slice(-4)}`}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 px-3 rounded-3xl border border-red-500 text-red-500 text-sm sm:text-base md:text-lg w-full sm:w-auto hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
