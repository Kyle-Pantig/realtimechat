'use client';

import { useState, useEffect } from 'react';
import Chat from './Chat';
import { useSocket } from '@/hooks/useSocket';

export default function ChatRoom() {
  const [username, setUsername] = useState('');
  const [roomId] = useState('general'); // You can make this configurable later
  
  const { messages, isConnected, typingUsers, sendMessage, handleTyping } = useSocket(roomId, username);

  // Add welcome message when user joins
  useEffect(() => {
    if (username && messages.length === 0) {
      // Welcome message functionality can be added here later
      console.log(`User ${username} joined the chat`);
    }
  }, [username, messages.length]);

  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Chat</h1>
            <p className="text-xl text-gray-600">Join the conversation with your friends</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome!</h2>
              <p className="text-gray-600">Enter your username to start chatting</p>
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
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="off"
                  autoFocus
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Join Chat
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Chat</h1>
              <p className="text-gray-600">Room: {roomId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-semibold text-blue-600">{username}</span>
              </div>
              <button
                onClick={() => setUsername('')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Change User
              </button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[600px]">
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
  );
}
