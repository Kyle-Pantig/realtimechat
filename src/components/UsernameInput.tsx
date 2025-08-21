'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface UsernameInputProps {
  onUsernameSubmit: (username: string) => void;
}

export default function UsernameInput({ onUsernameSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onUsernameSubmit(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Chat</h1>
          <p className="text-gray-600 dark:text-gray-300">Enter your username to start chatting</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-field w-full px-4 py-3 rounded-lg transition-colors"
              autoComplete="off"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Join Chat
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a real-time chat application built with Next.js and Socket.IO
          </p>
        </div>
      </div>
    </div>
  );
}
