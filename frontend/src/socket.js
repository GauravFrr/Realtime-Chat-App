import { io } from 'socket.io-client';

// Read backend API URL from Vite env, fallback to deployed Render url
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://realtime-chat-app-0pgz.onrender.com';

// Initialize socket without auto-connecting on load
export const socket = io(BACKEND_URL, {
  autoConnect: false
});

export default socket;
