import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiMoon, FiSun, FiLoader } from 'react-icons/fi';
import { FaUser, FaRobot } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const chatEndRef = useRef(null);
  const userId = '1234';

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { 
      role: 'user', 
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/chat', {
        id: userId,
        mes: input,
      });

      const botReply = response.data;
      setChat(prev => [...prev, { 
        role: 'model', 
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setChat(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  // Apply dark mode to HTML element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <FaRobot className="text-xl" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Buddy AI</h1>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-300"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <FiSun className="h-5 w-5 text-yellow-300" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4 space-y-4 pb-20">
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <FaRobot className="text-3xl text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Hello there!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  I'm Buddy, your AI assistant. I can help answer questions, brainstorm ideas, or just chat.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Try asking:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button 
                      onClick={() => setInput("What's the weather like today?")}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                    >
                      Weather today?
                    </button>
                    <button 
                      onClick={() => setInput("Tell me a joke")}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                    >
                      Tell me a joke
                    </button>
                    <button 
                      onClick={() => setInput("Explain quantum computing")}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                    >
                      Quantum computing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {chat.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {msg.role === 'model' && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mt-1">
                  <FaRobot className="text-blue-500 dark:text-blue-400" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-xs sm:max-w-md md:max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`rounded-2xl px-4 py-2.5 transition-all duration-200 ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow'}`}
                >
                  <p className="text-sm md:text-base">{msg.text}</p>
                </div>
                <span className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-gray-500 dark:text-gray-400`}>
                  {msg.time}
                </span>
              </div>
              
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mt-1">
                  <FaUser className="text-blue-500 dark:text-blue-400" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mt-1">
                <FaRobot className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col max-w-xs sm:max-w-md md:max-w-lg">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Message Buddy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center 
              ${loading || !input.trim() 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'}`}
          >
            {loading ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <IoMdSend className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-center md:block hidden text-gray-500 dark:text-gray-400 mt-2">
          Buddy may produce inaccurate information about people, places, or facts.
        </p>
      </div>
    </div>
  );
}

export default App;