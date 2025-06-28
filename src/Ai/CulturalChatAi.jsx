import React, { useState } from 'react';

function CulturalAi() {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hello! I am Gemini. Ask me anything." }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: newMessage }];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/gemini-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chats: updatedMessages,
          newMessage: newMessage
        })
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let modelMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.replace("data: ", ""));
            if (data.content) {
              modelMessage += data.content;
              setMessages(prev => [
                ...prev.filter(msg => msg.role !== "model-temp"),
                { role: "model-temp", content: modelMessage }
              ]);
            }
          }
        }
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.role === "model-temp"
            ? { role: "model", content: msg.content }
            : msg
        )
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      {/* Chat display */}
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-4 overflow-y-auto h-[70vh]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-500">Loading...</div>}
      </div>

      {/* Input area */}
      <div className="w-full max-w-md flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CulturalAi;
