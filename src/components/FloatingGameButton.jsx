import React, { useState } from 'react';
import { Gamepad, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingGameButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // List of routes where the button should appear
  const noNavbarRoutes = [
    "/games/memory-match",
    "/games/maze",
    "/games/candy-minesweeper",
    "/games/ping-pong",
    "/games/snake",
    "/games/chess"
  ];

  // Don't render if not in a game route
  if (!noNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleYes = () => {
    navigate('/games');
    setShowPopup(false);
  };

  const handleNo = () => {
    setShowPopup(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button 
        onClick={handleButtonClick}
        className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <Gamepad className="w-8 h-8" />
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={handleNo} // Close on background click
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Leave Game</h2>
              <button 
                onClick={handleNo}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Would you like to return to the games page?
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={handleNo}
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Stay
              </button>
              <button 
                onClick={handleYes}
                className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingGameButton;