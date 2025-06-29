import React from 'react';
import { Link } from 'react-router-dom';

export default function TiltedCards() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-7">
      
      {/* Speak Avi Card */}
      <Link to="/cultural-voice-ai" className="w-72">
        <div
          className="text-black rounded-2xl shadow-2xl p-6 h-48 flex flex-col items-center justify-center text-center space-y-3 transform -rotate-3 border-2 border-black shadow-black"
          style={{
            backgroundImage: 'url(/speak-avi.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-4xl">🎙️</div>
          <div className="bg-white bg-opacity-15 px-2 rounded">
  <div className="text-2xl font-bold text-black opacity-100">Speak Avi</div>
</div>

          <p className="text-sm opacity-90 text-md">
            Experience voice-to-voice cultural AI conversations seamlessly.
          </p>
        </div>
      </Link>

      {/* Chat Avi Card */}
      <Link to="/cultural-chat-ai" className="w-72">
        <div
          className="text-black rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center space-y-3 transform rotate-3 border-2 border-black shadow-black shadow-2xl"
          style={{
            backgroundImage: 'url(/chat-avi.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-4xl">💬</div>
          <div className="text-2xl font-bold text-md">Chat Avi</div>
          <p className="text-sm opacity-90">
            Chat with Avi to explore cultural knowledge and heritage insights.
          </p>
        </div>
      </Link>

    </div>
  );
}
