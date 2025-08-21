'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/socket';
import TypingIndicator from './TypingIndicator';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onTyping: () => void;
  username: string;
  typingUsers: string[];
}

export default function Chat({ messages, onSendMessage, onTyping, username, typingUsers }: ChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    onTyping();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">💬</div>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No messages yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Start the conversation by sending a message!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user === username ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                  message.user === username
                    ? 'bg-blue-500 text-white'
                    : message.user === 'System'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {message.user === username ? 'You' : message.user}
                  </span>
                  <span className="text-xs opacity-75 flex-shrink-0">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm break-words">{message.message}</p>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        <TypingIndicator users={typingUsers} />
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg transition-colors duration-300">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="input-field flex-1 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
