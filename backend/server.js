require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { initDb } = require('./db/db');
const messagesRouter = require('./routes/messages');
const handleSocketConnection = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);

// Configure CORS origin to support local dev and live URL
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = socketIo(server, {
  cors: {
    origin: [frontendUrl, 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: [frontendUrl, 'http://localhost:5173']
}));
app.use(express.json());

// Initialize SQLite schema
initDb();

// Map REST API routes
app.use('/api/messages', messagesRouter);

// Root health check to prevent "Cannot GET /" errors in browser demos
app.get('/', (req, res) => {
  res.send('Chat backend is running');
});

// Health check endpoint (useful for Render deployments)
app.get('/health', (req, res) => {
  res.send('Server is healthy and running.');
});

// Set up socket event handlers
handleSocketConnection(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`CORS configured origin: ${frontendUrl}`);
});
