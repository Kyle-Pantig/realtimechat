'use client';

interface ConnectedUsersProps {
  users: string[];
  currentUser: string;
  isConnected: boolean;
}

export default function ConnectedUsers({ users, currentUser, isConnected }: ConnectedUsersProps) {
  if (!isConnected || users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">No users online</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">Waiting for connections...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <span className="text-sm font-semibold text-white">Online Users</span>
          </div>
          <div className="bg-white/20 rounded-full px-2 py-1">
            <span className="text-xs font-medium text-white">{users.length}</span>
          </div>
        </div>
      </div>
      
      {/* Users List */}
      <div className="p-4">
        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                user === currentUser
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {/* User Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                user === currentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>
                {user.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium truncate ${
                    user === currentUser
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {user}
                  </span>
                  {user === currentUser && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Total connected: {users.length}</span>
            <span className="text-green-500">● Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
