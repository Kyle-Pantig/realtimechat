import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface ChatMessage {
  id: string;
  message: string;
  user: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: ChatMessage[];
}
