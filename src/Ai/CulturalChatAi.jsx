import React, { useState, useRef, useEffect } from 'react';

function CulturalChatAi() {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hello! I am Avi. Ask me anything.' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const baseUrl = 'https://avi-backend-xedj.onrender.com';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
  if (!newMessage.trim()) return;

  const updatedMessages = [...messages, { role: 'user', content: newMessage }];
  setMessages(updatedMessages);
  setNewMessage('');
  setIsLoading(true);

  try {
    const response = await fetch(`${baseUrl}/api/gemini-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chats: updatedMessages, // <== use updatedMessages here
        newMessage: newMessage,
      }),
    });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.replace('data: ', ''));
            if (data.content) {
              fullMessage += data.content;
              setMessages(prev =>
                [...prev.filter(m => m.role !== 'model-temp'), { role: 'model-temp', content: fullMessage }]
              );
            }
          }
        }
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.role === 'model-temp' ? { role: 'model', content: msg.content } : msg
        )
      );
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-100">
      <div className="max-w-4xl mx-auto flex flex-col h-screen">

        {/* Header */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border-b border-white border-opacity-30 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Cultural AI Assistant
            </h1>
            <p className="text-gray-600">Powered by Gemini</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
              Connected
            </div>
          </div>
        </div>

        {/* Chat Display */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl border border-white border-opacity-30 h-full flex flex-col">
            <div className="bg-gradient-to-r from-pink-600 to-orange-400 p-4 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-sm">G</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Chat Avi</h3>
                  <p className="text-pink-100 text-sm">Always ready to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-xs lg:max-w-md transform transition-all duration-300 hover:scale-105">
                    <div className={`flex items-center mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-orange-400 to-pink-500'
                          : 'bg-gradient-to-r from-pink-600 to-orange-400'
                      }`}>
                        {msg.role === 'user' ? 'U' : 'A'}
                      </div>
                      <span className={`text-sm font-medium text-gray-600 ${msg.role === 'user' ? 'order-first mr-2' : 'ml-2'}`}>
                        {msg.role === 'user' ? 'You' : 'Avi'}
                      </span>
                    </div>

                    <div className={`px-4 py-3 rounded-2xl shadow-lg relative ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-br-md'
                        : msg.role === 'model-temp'
                          ? 'bg-gradient-to-r from-pink-100 to-orange-100 text-gray-800 rounded-bl-md border-2 border-pink-200 animate-pulse'
                          : 'bg-gradient-to-r from-white to-orange-50 text-gray-800 rounded-bl-md border border-gray-200'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      {msg.role === 'model-temp' && (
                        <div className="flex items-center mt-2">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-xs text-pink-600 ml-2">streaming...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && !messages.some(m => m.role === 'model-temp') && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-orange-400 flex items-center justify-center text-white text-sm font-medium">G</div>
                      <span className="ml-2 text-sm font-medium text-gray-600">Gemini</span>
                    </div>
                    <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-6">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl border border-white border-opacity-30 p-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send)"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {newMessage.length}
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="bg-gradient-to-r from-pink-600 to-orange-400 hover:from-pink-700 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                  
                    <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["Introduce yourself", "Explain the Deepawali as festival", "Write a poem", "Tell me about special occasions in this month"].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setNewMessage(prompt)}
                  className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full text-sm transition-colors duration-200"
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CulturalChatAi;
