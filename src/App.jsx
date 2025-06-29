import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import CulturalVoiceAi from './Ai/CulturalVoiceAi';
import CulturalChatAi from './Ai/CulturalChatAi';
import ErrorPage from './Components/ErrorPage';

import './App.css';

function App() {
  const audioRef = useRef(null);

  const musicFiles = [
    '/music1.mp3',
    '/music2.mp3',
    '/music3.mp3'
  ];

  useEffect(() => {
    const audio = audioRef.current;

    // Select random track
    const randomMusic = musicFiles[Math.floor(Math.random() * musicFiles.length)];
    audio.src = randomMusic;
    audio.loop = true;
    audio.volume=0.3;

    const tryPlay = () => {
      audio.play().catch((err) => {
        console.log("Autoplay blocked. Waiting for user interaction to play audio.");
      });
    };

    // Attempt immediate playback
    tryPlay();

    // Add user interaction fallback
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    // Clean up
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <Router>
      <Header />
      <main className='bg-black'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cultural-voice-ai" element={<CulturalVoiceAi />} />
          <Route path="/cultural-chat-ai" element={<CulturalChatAi />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      {/* Hidden background music */}
      <audio ref={audioRef} hidden />
    </Router>
  );
}

export default App;
