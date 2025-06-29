// App.jsx
import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import CulturalVoiceAi from './Ai/CulturalVoiceAi';
import CulturalChatAi from './Ai/CulturalChatAi';
import ErrorPage from './Components/ErrorPage';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);

  const musicFiles = ['/music1.mp3', '/music2.mp3', '/music3.mp3'];

  useEffect(() => {
    const audio = audioRef.current;
    const randomMusic = musicFiles[Math.floor(Math.random() * musicFiles.length)];
    audio.src = randomMusic;
    audio.loop = true;
    audio.volume = volume;

    const tryPlay = () => {
      audio.play().catch((err) => {
        console.log("Autoplay blocked: " + err);
      });
    };

    tryPlay();

    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Update volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Router>
      <Header volume={volume} setVolume={setVolume} />
      <main className="bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cultural-voice-ai" element={<CulturalVoiceAi />} />
          <Route path="/cultural-chat-ai" element={<CulturalChatAi />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <audio ref={audioRef} hidden autoPlay />
    </Router>
  );
}

export default App;
