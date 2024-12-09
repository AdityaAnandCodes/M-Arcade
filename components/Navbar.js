import React from 'react';

const Navbar = () => {
  return (
    <nav className="border-b p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <a href="#" className="hover:underline">Home</a>
        </li>
        <li>
          <a href="#" className="hover:underline">About</a>
        </li>
        <li>
          <a href="#" className="hover:underline">Services</a>
        </li>
        <li>
          <a href="#" className="hover:underline">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
