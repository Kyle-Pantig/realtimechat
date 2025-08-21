import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/socket';

export const useSocket = (roomId: string, username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username) return;

    // Use environment variable for socket server URL, fallback to localhost for development
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      newSocket.emit('join-room', { roomId, username });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
      setConnectedUsers([]);
    });

    newSocket.on('receive-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('typing-update', (users: string[]) => {
      // Filter out the current user from the typing list
      setTypingUsers(users.filter(user => user !== username));
    });

    // User management events
    newSocket.on('user-joined', (data: { username: string; users: string[] }) => {
      console.log(`${data.username} joined the room`);
      setConnectedUsers(data.users);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        message: `${data.username} joined the chat`,
        user: 'System',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    newSocket.on('user-left', (data: { username: string; users: string[] }) => {
      console.log(`${data.username} left the room`);
      setConnectedUsers(data.users);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        message: `${data.username} left the chat`,
        user: 'System',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    newSocket.on('room-users', (users: string[]) => {
      setConnectedUsers(users);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room', { roomId, username });
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
    connectedUsers,
    sendMessage,
    handleTyping,
  };
};
