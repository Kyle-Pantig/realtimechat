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
  // Track connected users per room
  const roomUsers = new Map();

  // Helper function to get users in a room
  function getUsersInRoom(roomId) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];
    
    const users = [];
    room.forEach((socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket && socket.username) {
        users.push(socket.username);
      }
    });
    return users;
  }

  // Helper function to emit room users update
  function emitRoomUsersUpdate(roomId) {
    const users = getUsersInRoom(roomId);
    io.to(roomId).emit('room-users', users);
  }

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join-room', (data) => {
      const { roomId, username } = data;
      socket.username = username;
      socket.roomId = roomId;
      
      socket.join(roomId);
      console.log(`User ${username} joined room ${roomId}`);
      
      // Initialize typing users for this room if it doesn't exist
      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Set());
      }
      
      // Initialize room users if it doesn't exist
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
      }
      
      // Add user to room
      roomUsers.get(roomId).add(username);
      
      // Emit user joined event to all users in the room
      socket.to(roomId).emit('user-joined', {
        username: username,
        users: getUsersInRoom(roomId)
      });
      
      // Emit current room users to the joining user
      emitRoomUsersUpdate(roomId);
    });
    
    socket.on('leave-room', (data) => {
      const { roomId, username } = data;
      socket.leave(roomId);
      console.log(`User ${username} left room ${roomId}`);
      
      // Remove user from typing list when they leave
      const roomTypingUsers = typingUsers.get(roomId);
      if (roomTypingUsers) {
        roomTypingUsers.delete(username);
        // Emit updated typing list to remaining users
        socket.to(roomId).emit('typing-update', Array.from(roomTypingUsers));
      }
      
      // Remove user from room users
      const roomConnectedUsers = roomUsers.get(roomId);
      if (roomConnectedUsers) {
        roomConnectedUsers.delete(username);
        
        // Emit user left event to remaining users
        socket.to(roomId).emit('user-left', {
          username: username,
          users: getUsersInRoom(roomId)
        });
      }
    });
    
    socket.on('send-message', (data) => {
      console.log('Message received:', data);
      
      // Remove user from typing list when they send a message
      const roomTypingUsers = typingUsers.get(data.roomId);
      if (roomTypingUsers) {
        roomTypingUsers.delete(data.user);
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
      
      // Handle user leaving if they were in a room
      if (socket.username && socket.roomId) {
        const roomId = socket.roomId;
        const username = socket.username;
        
        // Remove user from typing list
        const roomTypingUsers = typingUsers.get(roomId);
        if (roomTypingUsers) {
          roomTypingUsers.delete(username);
          socket.to(roomId).emit('typing-update', Array.from(roomTypingUsers));
        }
        
        // Remove user from room users
        const roomConnectedUsers = roomUsers.get(roomId);
        if (roomConnectedUsers) {
          roomConnectedUsers.delete(username);
          
          // Emit user left event to remaining users
          socket.to(roomId).emit('user-left', {
            username: username,
            users: getUsersInRoom(roomId)
          });
        }
      }
      
      // Remove user from all typing lists when they disconnect
      typingUsers.forEach((roomTypingUsers, roomId) => {
        if (roomTypingUsers.has(socket.username)) {
          roomTypingUsers.delete(socket.username);
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
