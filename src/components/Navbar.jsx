import { Circle } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <section className="w-full flex justify-between items-center p-4 sm:px-6 md:px-8 z-10">
      {/* Logo */}
      <div className="logo text-2xl sm:text-3xl md:text-4xl font-bold">M-Arcade</div>

      {/* Hamburger Menu for Mobile */}
      <div className="sm:hidden" onClick={toggleMobileMenu}>
        <Circle  className={`${
          isMobileMenuOpen ? "fill-yl " : ""} w-6 h-6 cursor-pointer"`} />
      </div>

      {/* Navigation and Sign Up Button */}
      <div
        className={`${
          isMobileMenuOpen ? "flex " : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 justify-center items-center font-bold text-sm sm:text-base md:text-lg absolute sm:relative top-16 sm:top-0 left-0 w-full sm:w-auto bg-black sm:bg-transparent p-4 max-sm:z-10 sm:p-0`}
      >
        <div className="flex gap-2 justify-center items-center">
          <Circle className="w-3 h-3" /> Games
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Circle className="w-3 h-3" /> Shop
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Circle className="w-3 h-3 fill-yl" /> About
        </div>

        {/* Sign Up Button inside Mobile Menu */}
        <div className="p-2 px-3 sm:hidden rounded-3xl border border-yl text-sm sm:text-base md:text-lg mt-4 sm:mt-0">
          Sign Up
        </div>
      </div>

      {/* Regular Sign Up Button for Desktop */}
      <div className="hidden sm:block p-2 px-3 rounded-3xl border border-yl text-sm sm:text-base md:text-lg">
        Sign Up
      </div>
    </section>
  );
};

export default Navbar;
