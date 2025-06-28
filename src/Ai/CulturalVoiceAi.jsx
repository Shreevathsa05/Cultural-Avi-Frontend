import React, { useState } from "react";

function CulturalVoiceAi() {
  const [language, setLanguage] = useState("en-US");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]); // fixed default
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
const languages = [
  { label: "English (India)", code: "en-IN" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Bengali", code: "bn-IN" },
  { label: "Gujarati", code: "gu-IN" },
  { label: "Kannada", code: "kn-IN" },
  { label: "Malayalam", code: "ml-IN" },
  { label: "Marathi", code: "mr-IN" },
  { label: "Punjabi", code: "pa-IN" },
  { label: "Tamil", code: "ta-IN" },
  { label: "Telugu", code: "te-IN" },
  { label: "Urdu", code: "ur-IN" },
];
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

    r.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const newUserMessage = { role: "user", content: transcript };
      setMessages((prev) => [...prev, newUserMessage]);

      // Call your /api/voice backend with the updated chats
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chats: [...messages, newUserMessage],
            newMessage: transcript,
            languageCode: language,
            ssmlGender: "FEMALE",
          }),
        });

        const data = await res.json();
        setAiResponse(data.text);

        // Play the audio
        const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
        audio.play();

        // Append AI response to messages
        setMessages((prev) => [...prev, { role: "model", content: data.text }]);
      } catch (err) {
        console.error("Error calling voice API:", err);
      } finally {
        setLoading(false);
      }
    };

    r.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    r.onend = () => {
      setIsRecording(false);
    };

    r.start();
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Chat display section */}
      <div className="flex flex-col w-full max-w-md h-[60vh] overflow-y-auto bg-gray-100 rounded-lg p-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded ${
              msg.role === "user" ? "bg-blue-200 self-end" : "bg-green-200 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">Processing...</div>}
      </div>

      {/* Language selector */}
      <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="mb-4 border p-2 rounded"
>
  {languages.map((lang) => (
    <option key={lang.code} value={lang.code}>
      {lang.label}
    </option>
  ))}
</select>

      {/* Voice button */}
      <button
        onClick={!isRecording ? callSTT : null}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600"
      >
        {isRecording ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 inline"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              />
            </svg>
            Listening...
          </>
        ) : (
          "Start Listening..."
        )}
      </button>

      {/* AI response display */}
      {aiResponse && (
        <div className="mt-4 bg-green-100 p-3 rounded shadow max-w-md w-full">
          <strong>AI Response:</strong> {aiResponse}
        </div>
      )}
    </div>
  );
}

export default CulturalVoiceAi;
