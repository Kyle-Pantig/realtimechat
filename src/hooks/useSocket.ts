import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/socket';

export const useSocket = (roomId: string, username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username) return;

    const newSocket = io('http://localhost:3001');

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      newSocket.emit('join-room', roomId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('receive-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('typing-update', (users: string[]) => {
      // Filter out the current user from the typing list
      setTypingUsers(users.filter(user => user !== username));
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room', roomId);
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, username]);

  const sendMessage = (message: string) => {
    if (socket && message.trim()) {
      const messageData = {
        roomId,
        message: message.trim(),
        user: username,
      };
      
      socket.emit('send-message', messageData);
      
      // Add message to local state immediately
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: message.trim(),
        user: username,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const emitTyping = (isTyping: boolean) => {
    if (socket) {
      if (isTyping) {
        socket.emit('typing-start', { roomId, user: username });
      } else {
        socket.emit('typing-stop', { roomId, user: username });
      }
    }
  };

  const handleTyping = () => {
    // Emit typing start
    emitTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1000);
  };

  return {
    socket,
    messages,
    isConnected,
    typingUsers,
    sendMessage,
    handleTyping,
  };
};
