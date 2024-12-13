import { Circle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path ? "fill-black max-sm:fill-white" : "";

  return (
    <nav className="w-full flex justify-between items-center p-4 sm:px-6 md:px-8 z-10">
      {/* Logo */}
      <Link to="/">
        <div className="logo text-2xl sm:text-3xl md:text-4xl font-bold focus:border-none">M-Arcade</div>
      </Link>
      {/* Hamburger Menu for Mobile */}
      <div className="sm:hidden" onClick={toggleMobileMenu}>
        <Circle
          className={`${isMobileMenuOpen ? "fill-black" : ""} w-6 h-6 cursor-pointer transition-all duration-300 hover:scale-110`}
        />
      </div>

      {/* Navigation and Sign Up Button */}
      <div
        className={`${
          isMobileMenuOpen ? "flex text-white" : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 justify-center items-center font-bold text-sm sm:text-base md:text-lg absolute sm:relative top-16 sm:top-0 left-0 w-full sm:w-auto bg-black sm:bg-transparent p-4 max-sm:z-10 sm:p-0`}
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
        <Link to="/nft">
          <div className="flex gap-2 justify-center items-center transition-all duration-300 hover:scale-110 hover:text-black">
            <Circle className={`w-3 h-3 ${isActive("/nft")}`} />
            Shop
          </div>
        </Link>
        {/* Sign Up Button inside Mobile Menu */}
        <div className="p-2 px-3 sm:hidden rounded-3xl border border-black text-sm sm:text-base md:text-lg mt-4 sm:mt-0">
          Sign Up
        </div>
      </div>

      {/* Regular Sign Up Button for Desktop */}
      <div className="hidden sm:block p-2 px-3 rounded-3xl border border-black text-sm sm:text-base md:text-lg hover:bg-black hover:text-white hover:scale-105 duration-300 transition-all">
        Connect Wallet
      </div>
    </nav>
  );
};

export default Navbar;
