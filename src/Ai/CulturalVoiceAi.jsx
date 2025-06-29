import React, { useState } from 'react';

function CulturalVoiceAi() {
  const [language, setLanguage] = useState('en-US');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  const LANG_OPTIONS = [
    { code: "bn-IN", label: "Bengali (India)" },
    { code: "en-IN", label: "English (India)" },
    { code: "gu-IN", label: "Gujarati (India)" },
    { code: "hi-IN", label: "Hindi (India)" },
    { code: "kn-IN", label: "Kannada (India)" },
    { code: "ml-IN", label: "Malayalam (India)" },
    { code: "mr-IN", label: "Marathi (India)" },
    { code: "pa-IN", label: "Punjabi (India)" },
    { code: "ta-IN", label: "Tamil (India)" },
    { code: "te-IN", label: "Telugu (India)" },
    { code: "ur-IN", label: "Urdu (India)" },
    { code: "en-US", label: "English (US)" },
  ];

  const baseUrl = `https://cultural-ai-backend-sqft.onrender.com`+`err`;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const callSTT = () => {
    const r = new SpeechRecognition();
    r.lang = language;
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsRecording(true);
    };

    r.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };

    r.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    r.onend = () => {
      setIsRecording(false);
    };

    r.start();
  };

  const handleUserMessage = async (userText) => {
    const updatedMessages = [
      ...messages,
      { role: "user", content: userText }
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const newurl = `${baseUrl}/api/voice`;
      const response = await fetch(newurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chats: updatedMessages,
          newMessage: userText,
          languageCode: language,
        }),
      });

      const data = await response.json();
      console.log("API audioContent:", data.audioContent);

      if (data.error) {
        console.error("API error:", data.error);
        setIsLoading(false);
        return;
      }

      // Add Gemini response to messages
      setMessages(prev => [
        ...prev,
        { role: "model", content: data.text }
      ]);

      // Play the audio response
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audio.play();
      const byteCharacters = atob(data.audioContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setAudioSrc(url);

    } catch (err) {
      console.error("Error calling API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Cultural Voice AI
          </h1>
          <p className="text-gray-600 text-lg">Experience AI in your native language</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white bg-opacity-80 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-700">
              {language === 'en-US' ? 'English (US)' : LANG_OPTIONS.find(l => l.code === language)?.label}
            </span>
          </div>
        </div>

        {/* Chat display section */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-white border-opacity-30 mb-8 overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
            <h2 className="text-white font-semibold text-lg">Conversation</h2>
          </div>
          
          <div className="h-[60vh] overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  <p className="text-lg">Start a conversation by clicking the microphone</p>
                  <p className="text-sm mt-2">Speak in any supported Indian language</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md transform transition-all duration-300 hover:scale-105 ${
                      msg.role === "user" 
                        ? "order-2" 
                        : "order-1"
                    }`}>
                      {/* Avatar */}
                      <div className={`flex items-center mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          msg.role === "user" 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                            : "bg-gradient-to-r from-orange-500 to-red-500"
                        }`}>
                          {msg.role === "user" ? "U" : "AI"}
                        </div>
                        <span className={`ml-2 text-sm font-medium text-gray-600 ${msg.role === "user" ? "order-first mr-2 ml-0" : ""}`}>
                          {msg.role === "user" ? "You" : "Assistant"}
                        </span>
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`px-4 py-3 rounded-2xl shadow-lg border ${
                        msg.role === "user" 
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md border-blue-200" 
                          : "bg-white text-gray-800 rounded-bl-md border-gray-200"
                      }`}>
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-medium">
                          AI
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">Assistant</span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm">Generating response...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Control section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl border border-white border-opacity-30 p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* Language selector */}
            <div className="relative w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Language</label>
              <div className="relative">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 w-full lg:w-64"
                >
                  {LANG_OPTIONS.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Voice recording button */}
            <div className="flex flex-col items-center">
              <button
                onClick={!isRecording ? callSTT : null}
                disabled={isRecording}
                className={`relative group flex items-center justify-center w-20 h-20 rounded-full font-medium text-white shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                  isRecording 
                    ? "bg-gradient-to-r from-red-500 to-red-600 cursor-not-allowed focus:ring-red-300 animate-pulse" 
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-300"
                }`}
              >
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent mb-1"></div>
                  </div>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                )}
                
                {/* Ripple effect */}
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping"></div>
                )}
              </button>
              
              <span className="mt-3 text-sm font-medium text-gray-700">
                {isRecording ? "Listening..." : "Tap to speak"}
              </span>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 flex items-center justify-center">
            <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isRecording 
                ? "bg-red-100 text-red-800 border-2 border-red-200" 
                : isLoading
                ? "bg-orange-100 text-orange-800 border-2 border-orange-200"
                : "bg-green-100 text-green-800 border-2 border-green-200"
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isRecording 
                  ? "bg-red-500 animate-pulse" 
                  : isLoading
                  ? "bg-orange-500 animate-spin border-2 border-orange-300 border-t-transparent"
                  : "bg-green-500"
              }`}></div>
              <span>
                {isRecording ? "Recording your voice..." : isLoading ? "Processing with AI..." : "Ready to listen"}
              </span>
            </div>
          </div>

          {/* Audio player (if available) */}
          {audioSrc && (
            <div className="mt-4 flex justify-center">
              <audio 
                controls 
                src={audioSrc}
                className="w-full max-w-md rounded-lg shadow-sm"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CulturalVoiceAi;