'use client';

interface TypingIndicatorProps {
  users: string[];
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing`;
    } else {
      return `${users[0]}, ${users[1]}, and ${users.length - 2} others are typing`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg mx-2 mb-2 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <span className="truncate">{getTypingText()}</span>
      <div className="flex space-x-1 flex-shrink-0">
        <div className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}
