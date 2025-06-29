import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Pages/Header';
import Home from './Pages/Home';
import CulturalVoiceAi from './Ai/CulturalVoiceAi';
import CulturalChatAi from './Ai/CulturalChatAi';
import ErrorPage from './Pages/ErrorPage';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const musicFiles = [
    { name: 'Track 1', src: '/music1.mp3' },
    { name: 'Track 2', src: '/music2.mp3' },
    { name: 'Track 3', src: '/music3.mp3' },
    { name: 'Track 4', src: '/music4.mp3' },
    { name: 'Track 5', src: '/music5.mp3' },
  ];

  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    Math.floor(Math.random() * musicFiles.length)
  );

  // whenever currentTrackIndex or volume changes, reconfigure audio
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = musicFiles[currentTrackIndex].src;
    audio.loop = true;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(() => {/* ignore blocked */});
    }
  }, [currentTrackIndex, volume, isPlaying]);

  // ensure first user gesture kicks off playback on mobile
  useEffect(() => {
    const startOnGesture = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
      ['click', 'keydown', 'touchstart'].forEach(evt =>
        document.removeEventListener(evt, startOnGesture)
      );
    };
    ['click', 'keydown', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, startOnGesture, { once: true })
    );
  }, [isPlaying]);

  // handlers to pass down
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <Router>
      <Header
        volume={volume}
        setVolume={setVolume}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        musicFiles={musicFiles}
        currentTrackIndex={currentTrackIndex}
        selectTrack={selectTrack}
      />

      <main className="bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cultural-voice-ai" element={<CulturalVoiceAi />} />
          <Route path="/cultural-chat-ai" element={<CulturalChatAi />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      {/* keep audio element around but hidden */}
      <audio ref={audioRef} hidden />
    </Router>
  );
}

export default App;

// // App.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './Pages/Header';
// import Home from './Pages/Home';
// import CulturalVoiceAi from './Ai/CulturalVoiceAi';
// import CulturalChatAi from './Ai/CulturalChatAi';
// import ErrorPage from './Pages/ErrorPage';
// import './App.css';

// function App() {
//   const audioRef = useRef(null);
//   const [volume, setVolume] = useState(0.3);

//   const musicFiles = ['/music1.mp3', '/music2.mp3', '/music3.mp3','/music4.mp3', '/music5.mp3', '/music6.mp3'];

//   useEffect(() => {
//     const audio = audioRef.current;
//     const randomMusic = musicFiles[Math.floor(Math.random() * musicFiles.length)];
//     audio.src = randomMusic;
//     audio.loop = true;
//     audio.volume = volume;

//     const tryPlay = () => {
//       audio.play().catch((err) => {
//         console.log("Autoplay blocked: " + err);
//       });
//     };

//     tryPlay();

//     const handleInteraction = () => {
//       tryPlay();
//       document.removeEventListener('click', handleInteraction);
//       document.removeEventListener('keydown', handleInteraction);
//     };

//     document.addEventListener('click', handleInteraction);
//     document.addEventListener('keydown', handleInteraction);

//     return () => {
//       document.removeEventListener('click', handleInteraction);
//       document.removeEventListener('keydown', handleInteraction);
//     };
//   }, []);

//   // Update volume dynamically
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//     }
//   }, [volume]);

//   return (
//     <Router>
//       <Header volume={volume} setVolume={setVolume} />
//       <main className="bg-black">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/cultural-voice-ai" element={<CulturalVoiceAi />} />
//           <Route path="/cultural-chat-ai" element={<CulturalChatAi />} />
//           <Route path="*" element={<ErrorPage />} />
//         </Routes>
//       </main>
//       <audio ref={audioRef} hidden autoPlay />
//     </Router>
//   );
// }

// export default App;
