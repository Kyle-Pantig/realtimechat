const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3001;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create Socket.IO server with production settings
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
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

  server.listen(port, () => {
    console.log(`🚀 Production server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Socket.IO server ready`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
