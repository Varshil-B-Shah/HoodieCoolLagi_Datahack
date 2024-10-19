import React, { useState, useRef, useEffect } from "react";
import { Send, Upload } from "lucide-react";

const Analysis = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (inputMessage.trim() !== "" || inputFile) {
      let newMessages = [...messages];
      if (inputMessage.trim() !== "") {
        newMessages.push({ text: inputMessage, sender: "user" });
      }
      if (inputFile) {
        newMessages.push({
          text: `Uploaded file: ${inputFile.name}`,
          sender: "user",
        });
        setInputFile(null);
      }
      setMessages(newMessages);
      setInputMessage("");

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is a simulated response.", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-col h-screen w-full absolute inset-0 z-10" // Ensure it's on top
    >
      {/* Message Area */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-900 bg-opacity-70 text-green-400 cyber-scrollbar"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#2c7b41 #0c1018" }} // Fallback for Firefox
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-green-700 text-white"
                  : "bg-gray-800 text-green-400"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 bg-opacity-80">
        <div className="flex items-center">
          {/* File Upload Button */}
          <label
            className="mr-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
            htmlFor="fileUpload"
          >
            <Upload className="h-5 w-5" />
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={(e) => setInputFile(e.target.files[0])}
          />

          {/* Input Field */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or upload a file..."
            className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Send Button */}
          <button
            className="ml-2 p-2 rounded-md bg-green-600 hover:bg-green-500 text-white"
            onClick={sendMessage}
            disabled={!inputMessage.trim() && !inputFile} // Disable button if neither text nor file is present
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
