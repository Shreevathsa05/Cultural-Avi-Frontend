import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div className='bg-black'>
    <header className="bg-gradient-to-r from-pink-500 to-orange-400 shadow-md text-white px-6 py-4 flex justify-between items-center rounded-b-3xl ">
      <Link
        to="/"
        className="text-3xl font-extrabold flex items-center space-x-2 hover:scale-105 transition-transform"
      >
        <span>🪷</span> {/* Cute cultural emoji */}
        <span>Cultural AI</span>
      </Link>

      <nav className="space-x-4 text-lg">
        <NavLink
          to="/cultural-voice-ai"
          className={({ isActive }) =>
            isActive
              ? 'text-yellow-200 font-semibold border-b-2 border-yellow-200 pb-1'
              : 'hover:text-yellow-100 transition-colors'
          }
        >
          Voice AI
        </NavLink>

        <NavLink
          to="/cultural-chat-ai"
          className={({ isActive }) =>
            isActive
              ? 'text-yellow-200 font-semibold border-b-2 border-yellow-200 pb-1'
              : 'hover:text-yellow-100 transition-colors'
          }
        >
          Chat AI
        </NavLink>
      </nav>
    </header>
    </div>
  );
};

export default Header;
