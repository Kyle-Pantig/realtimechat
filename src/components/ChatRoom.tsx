'use client';

import { useState, useEffect } from 'react';
import Chat from './Chat';
import { useSocket } from '@/hooks/useSocket';
import ThemeToggle from './ThemeToggle';
import ConnectedUsers from './ConnectedUsers';

export default function ChatRoom() {
  const [username, setUsername] = useState('');
  const [roomId] = useState('general'); // You can make this configurable later
  
  const { messages, isConnected, typingUsers, connectedUsers, sendMessage, handleTyping } = useSocket(roomId, username);

  // Add welcome message when user joins
  useEffect(() => {
    if (username && messages.length === 0) {
      // Welcome message functionality can be added here later
      console.log(`User ${username} joined the chat`);
    }
  }, [username, messages.length]);

  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Real-Time Chat</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Join the conversation with your friends</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2">Welcome!</h2>
                <p className="text-gray-600 dark:text-gray-300">Enter your username to start chatting</p>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const usernameInput = formData.get('username') as string;
                  if (usernameInput.trim()) {
                    setUsername(usernameInput.trim());
                  }
                }}
                className="max-w-md mx-auto space-y-4"
              >
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="off"
                    autoFocus
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Join Chat
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-hidden">
          {/* Header Background */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Real-Time Chat</h1>
                  <p className="text-xs sm:text-sm text-blue-100">Room: {roomId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {/* Header Content */}
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              {/* Connection Status */}
              <div className="flex items-center justify-center sm:justify-start space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">User:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{username}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <button
                  onClick={() => setUsername('')}
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Change User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Connected Users Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ConnectedUsers 
              users={connectedUsers} 
              currentUser={username} 
              isConnected={isConnected} 
            />
          </div>
          
          {/* Chat Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="h-[500px] sm:h-[600px]">
              <Chat
                messages={messages}
                onSendMessage={sendMessage}
                onTyping={handleTyping}
                username={username}
                typingUsers={typingUsers}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
