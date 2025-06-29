// Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ volume, setVolume }) {
  return (
    <header className="bg-gradient-to-r from-pink-600 via-pink-500 to-orange-500 shadow-md text-white px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      
      {/* Logo / Brand */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="flex items-center space-x-2 transform hover:scale-105 transition">
          <span className="text-3xl">🪷</span>
          <span className="text-2xl font-bold text-white drop-shadow-sm">Cultural AI</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-lg font-medium">
        <NavLink
          to="/cultural-voice-ai"
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-white pb-1'
              : 'hover:text-yellow-200 transition'
          }
        >
          Voice AI
        </NavLink>
        <NavLink
          to="/cultural-chat-ai"
          className={({ isActive }) =>
            isActive
              ? 'border-b-2 border-white pb-1'
              : 'hover:text-yellow-200 transition'
          }
        >
          Chat AI
        </NavLink>
      </nav>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 text-sm w-full md:w-auto">
        <span className="text-white whitespace-nowrap">🔊 Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full md:w-24 accent-pink-300 cursor-pointer"
        />
      </div>
    </header>
  );
}
