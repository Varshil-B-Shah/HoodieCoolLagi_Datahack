import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload } from 'lucide-react';

const Analysis = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'This is a simulated response.', sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center">
          {/* Upload Button */}
          <button
            className="mr-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
            onClick={() => alert('Upload clicked')}
          >
            <Upload className="h-5 w-5" />
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send Button */}
          <button
            className="ml-2 p-2 rounded-md bg-blue-500 hover:bg-blue-400 text-white"
            onClick={sendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
