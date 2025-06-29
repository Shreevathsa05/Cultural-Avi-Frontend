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

  const baseUrl=`https://cultural-ai-backend-sqft.onrender.com`;


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
        const newurl= `${baseUrl}/api/voice`
      const response = await fetch(newurl || "http://localhost:5000/api/voice", {
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
    <div>
      {/* Chat display section */}
      <div className="flex justify-center items-center h-[70vh] bg-gray-100 overflow-y-auto">
        <div className="bg-gray-200 p-4 rounded-2xl w-full max-w-xl">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-2 rounded ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"}`}>
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
            </div>
          ))}
          {isLoading && <div className="text-center">Generating response...</div>}
        </div>
      </div>

      {/* Control section */}
      <div className="flex justify-center mt-4 space-x-4">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border border-gray-400 rounded px-2 py-1">
            {LANG_OPTIONS.map(
                ({ code, label }) => 
            (<option key={code} value={code}> {label} </option> )
            )}
        </select>

        <button
          onClick={!isRecording ? callSTT : null}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          {isRecording ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
              Listening...
            </>
          ) : (
            "Start Listening"
          )}
        </button>
      </div>
    </div>
  );
}

export default CulturalVoiceAi;
