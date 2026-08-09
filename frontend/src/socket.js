import { io } from 'socket.io-client';

// Read backend API URL from Vite env, fallback to localhost:5000
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Initialize socket without auto-connecting on load
export const socket = io(BACKEND_URL, {
  autoConnect: false
});

export default socket;
