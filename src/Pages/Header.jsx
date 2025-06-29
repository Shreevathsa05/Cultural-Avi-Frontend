import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({
  volume,
  setVolume,
  isPlaying,
  togglePlay,
  musicFiles,
  currentTrackIndex,
  selectTrack,
}) {
  return (
    <header className="bg-gradient-to-r from-orange-600 via-pink-400 to-orange-300 shadow-md text-black px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">

      {/* Logo / Brand */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition">
          <span className="text-3xl">🪷</span>
          <span className="text-2xl font-bold">Cultural AI</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-lg font-medium">
        <NavLink to="/" className={({isActive}) => isActive ? 'border-b-2 border-black pb-1' : 'hover:text-pink-700'}>
          Home
        </NavLink>
        <NavLink to="/cultural-voice-ai" className={({isActive}) => isActive ? 'border-b-2 border-black pb-1' : 'hover:text-pink-700'}>
          Speak Avi
        </NavLink>
        <NavLink to="/cultural-chat-ai" className={({isActive}) => isActive ? 'border-b-2 border-black pb-1' : 'hover:text-pink-700'}>
          Chat Avi
        </NavLink>
      </nav>

      {/* Audio Controls */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="px-3 py-1 bg-orange-300 text-black rounded shadow hover:bg-gray-200 transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        

        {/* Volume Slider */}
        <div className="flex items-center space-x-2">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-pink-300 cursor-pointer"
          />
        </div>
        {/* Track Selector */}
        <select
          value={currentTrackIndex}
          onChange={(e) => selectTrack(Number(e.target.value))}
          className="px-2 py-1 rounded border focus:outline-none"
        >
          {musicFiles.map((track, idx) => (
            <option key={idx} value={idx}>
              {track.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

// // Header.jsx
// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';

// export default function Header({ volume, setVolume }) {
//   return (
//     <header className="bg-gradient-to-r from-orange-600 via-pink-400 to-orange-300 shadow-md text-white px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      
//       {/* Logo / Brand */}
//       <div className="flex justify-between items-center w-full md:w-auto">
//         <Link to="/" className="flex items-center space-x-2 transform hover:scale-105 transition">
//           <span className="text-3xl">🪷</span>
//           <span className="text-2xl font-bold text-white drop-shadow-sm">Cultural AI</span>
//         </Link>
//       </div>


//       {/* Navigation Links */}
//       <nav className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-lg font-medium">
//        <NavLink
//           to="/"
//           className={({ isActive }) =>
//             isActive
//               ? 'border-b-2 border-white pb-1'
//               : 'hover:text-yellow-200 transition'
//           }
//         >
//           Home
//         </NavLink>
//         <NavLink
//           to="/cultural-voice-ai"
//           className={({ isActive }) =>
//             isActive
//               ? 'border-b-2 border-white pb-1'
//               : 'hover:text-yellow-200 transition'
//           }
//         >
//           Speak Avi
//         </NavLink>
//         <NavLink
//           to="/cultural-chat-ai"
//           className={({ isActive }) =>
//             isActive
//               ? 'border-b-2 border-white pb-1'
//               : 'hover:text-yellow-200 transition'
//           }
//         >
//           Chat Avi
//         </NavLink>
//       </nav>

//       {/* Volume Control */}
//       <div className="flex items-center space-x-2 text-sm w-full md:w-auto">
//         <span className="text-white whitespace-nowrap">🔊 Volume</span>
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={(e) => setVolume(parseFloat(e.target.value))}
//           className="w-full md:w-24 accent-pink-300 cursor-pointer"
//         />
//       </div>
//     </header>
//   );
// }
