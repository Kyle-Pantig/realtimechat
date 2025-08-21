# Real-Time Chat Application

A modern, real-time chat application built with Next.js, TypeScript, Tailwind CSS v3, and Socket.IO.

## Features

- 🚀 Real-time messaging using Socket.IO
- 💬 Beautiful, responsive chat interface
- 🎨 Modern UI with Tailwind CSS v3
- 📱 Mobile-friendly design
- 🔄 Live connection status indicator
- 👤 Username-based chat system
- 🏠 Room-based chat (currently supports general room)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v3
- **Real-time**: Socket.IO
- **Development**: ESLint, PostCSS, Autoprefixer

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd realtime-chat
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev:all
```

This will start both the Next.js application (port 3000) and Socket.IO server (port 3001) simultaneously.

### Option 2: Run Servers Separately

**Terminal 1 - Next.js App:**
```bash
npm run dev
```

**Terminal 2 - Socket.IO Server:**
```bash
npm run socket
```

### Production Mode

```bash
npm run build
npm start
```

**Note**: For production, you'll need to run the Socket.IO server separately or integrate it with your hosting solution.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
│   ├── Chat.tsx        # Chat interface
│   ├── ChatRoom.tsx    # Main chat room
│   └── UsernameInput.tsx # Username input form
├── hooks/              # Custom React hooks
│   └── useSocket.ts    # Socket.IO hook
└── types/              # TypeScript type definitions
    └── socket.ts       # Socket.IO types
socket-server.js         # Socket.IO server
```

## How It Works

1. **User Authentication**: Users enter a username to join the chat
2. **Socket Connection**: The app establishes a WebSocket connection to the Socket.IO server (port 3001)
3. **Room Management**: Users automatically join the general chat room
4. **Real-time Messaging**: Messages are sent and received in real-time
5. **Connection Status**: Visual indicator shows connection status

## Socket.IO Events

- `join-room`: User joins a chat room
- `leave-room`: User leaves a chat room
- `send-message`: User sends a message
- `receive-message`: User receives a message

## Customization

### Adding New Rooms

To add new chat rooms, modify the `ChatRoom.tsx` component and update the room selection logic.

### Styling

The application uses Tailwind CSS v3. You can customize the design by modifying the Tailwind classes in the components.

### Environment Variables

Create a `.env.local` file to customize:
- `SOCKET_PORT`: Socket.IO server port (default: 3001)
- `PORT`: Next.js app port (default: 3000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Troubleshooting

### Common Issues

1. **Port already in use**: 
   - Change the port in `socket-server.js` or kill the process using the port
   - Use `netstat -an | findstr :3001` (Windows) or `lsof -i :3001` (Mac/Linux) to find processes

2. **Socket connection failed**: 
   - Ensure the Socket.IO server is running on port 3001
   - Check browser console for connection errors
   - Verify CORS settings in `socket-server.js`

3. **Tailwind styles not loading**: 
   - Verify Tailwind CSS v3 is properly installed and configured
   - Check `tailwind.config.js` and `postcss.config.mjs`

### Getting Help

If you encounter any issues, please check:
- Node.js version compatibility
- All dependencies are properly installed
- Both servers are running (Next.js on 3000, Socket.IO on 3001)
- Browser console for error messages
- Server console for connection logs

### Development Workflow

1. Start both servers with `npm run dev:all`
2. Open http://localhost:3000 in your browser
3. Enter a username to join the chat
4. Open another browser tab/window to test real-time messaging
5. Check the Socket.IO server console for connection logs
