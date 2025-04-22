// === Chatbot.jsx (React Frontend Component) ===

import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setBotTyping(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botResponse = response.data.response;
      const botMessage = { from: 'bot', text: botResponse };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setBotTyping(false);
    }
  };

  return (
    <div className="p-8 max-w-screen mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Stress2Peace ChatBot 💬</h1>
      <div className="h-64 bg-blue-50 p-4 overflow-y-scroll rounded-xl shadow-inner mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'} text-sm`}
          >
            <span className={`${msg.from === 'user' ? 'text-blue-800' : 'text-green-600'}`}>{msg.text}</span>
          </div>
        ))}
        {botTyping && <p className="text-green-600 italic">Bot is typing...</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 rounded-lg border"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
