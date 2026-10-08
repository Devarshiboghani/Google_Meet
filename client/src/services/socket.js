import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * SOCKET.IO FLOW EXPLANATION (For Learning Purposes)
 * 
 * 1. Singleton Connection:
 *    We create a single socket instance here and export it. This prevents 
 *    the application from creating multiple connections to the server when 
 *    different components mount and unmount.
 * 
 * 2. Event Listeners:
 *    Components can import this 'socket' object to listen to events (socket.on)
 *    and send events (socket.emit).
 * 
 * 3. AutoConnect: false
 *    We disable autoConnect so the socket doesn't establish a connection 
 *    while the user is just browsing the landing page. It will only connect 
 *    when we explicitly call connectSocket() inside the meeting room.
 */
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
