const { createServer } = require('http');
const { Server } = require('socket.io');

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Track typing users per room
const typingUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Initialize typing users for this room if it doesn't exist
    if (!typingUsers.has(roomId)) {
      typingUsers.set(roomId, new Set());
    }
  });
  
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    
    // Remove user from typing list when they leave
    const roomTypingUsers = typingUsers.get(roomId);
    if (roomTypingUsers) {
      roomTypingUsers.delete(socket.id);
      // Emit updated typing list to remaining users
      socket.to(roomId).emit('typing-update', Array.from(roomTypingUsers));
    }
  });
  
  socket.on('send-message', (data) => {
    console.log('Message received:', data);
    
    // Remove user from typing list when they send a message
    const roomTypingUsers = typingUsers.get(data.roomId);
    if (roomTypingUsers) {
      roomTypingUsers.delete(socket.id);
      // Emit updated typing list to remaining users
      socket.to(data.roomId).emit('typing-update', Array.from(roomTypingUsers));
    }
    
    socket.to(data.roomId).emit('receive-message', {
      id: Date.now().toString(),
      message: data.message,
      user: data.user,
      timestamp: new Date().toISOString(),
    });
  });
  
  socket.on('typing-start', (data) => {
    const roomTypingUsers = typingUsers.get(data.roomId);
    if (roomTypingUsers) {
      roomTypingUsers.add(data.user);
      // Emit typing list to other users in the room
      socket.to(data.roomId).emit('typing-update', Array.from(roomTypingUsers));
    }
  });
  
  socket.on('typing-stop', (data) => {
    const roomTypingUsers = typingUsers.get(data.roomId);
    if (roomTypingUsers) {
      roomTypingUsers.delete(data.user);
      // Emit updated typing list to other users in the room
      socket.to(data.roomId).emit('typing-update', Array.from(roomTypingUsers));
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove user from all typing lists when they disconnect
    typingUsers.forEach((roomTypingUsers, roomId) => {
      if (roomTypingUsers.has(socket.id)) {
        roomTypingUsers.delete(socket.id);
        // Emit updated typing list to remaining users
        socket.to(roomId).emit('typing-update', Array.from(roomTypingUsers));
      }
    });
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Connect your Next.js app to: http://localhost:${PORT}`);
});
