const { saveMessage } = require('../db/db');

// In-memory list to keep track of active sockets -> usernames
// not persisting online users to DB, just in-memory for now — fine for this scope
const onlineUsers = {};

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    const connTime = new Date().toLocaleTimeString();
    console.log(`[${connTime}] Client socket connected: ${socket.id}`);

    // Client registration / Join
    socket.on('join', (username) => {
      if (!username) return;
      
      const cleanName = username.trim();
      
      // Prevent duplicate join events from firing twice for the same socket connection
      if (onlineUsers[socket.id] === cleanName) {
        return;
      }
      
      onlineUsers[socket.id] = cleanName;
      
      const logTime = new Date().toLocaleTimeString();
      console.log(`[${logTime}] User joined: ${cleanName} (${socket.id})`);
      
      // Notify other users of new arrival
      socket.broadcast.emit('system_message', {
        message: `${cleanName} joined the chat`,
        timestamp: new Date().toISOString()
      });
      
      // Emit updated list of active user names to everyone
      io.emit('online_users', Object.values(onlineUsers));
    });

    // Handling sent chat message
    socket.on('send_message', async (data) => {
      const { username, message } = data;
      if (!username || !message || message.trim() === '') return;
      
      const cleanMsg = message.trim();
      const msgTime = new Date().toISOString();
      
      try {
        // Save to SQLite database
        const newId = await saveMessage(username, cleanMsg, msgTime);
        
        // Broadcast the final saved message to all connected clients
        io.emit('new_message', {
          id: newId,
          username,
          message: cleanMsg,
          timestamp: msgTime
        });
      } catch (err) {
        console.error('Error handling socket message database insert:', err.message);
        socket.emit('error_message', 'Message could not be saved due to a server database error.');
      }
    });

    // Handling typing status
    socket.on('typing', (isTyping) => {
      const username = onlineUsers[socket.id];
      if (!username) return;
      
      // Broadcast typing indicator to everyone else
      socket.broadcast.emit('user_typing', {
        username,
        isTyping
      });
    });

    // Handling client disconnection
    socket.on('disconnect', () => {
      const username = onlineUsers[socket.id];
      const disTime = new Date().toLocaleTimeString();
      console.log(`[${disTime}] Client socket disconnected: ${socket.id} (${username || 'Guest'})`);
      
      if (username) {
        delete onlineUsers[socket.id];
        
        // Broadcast left notification
        socket.broadcast.emit('system_message', {
          message: `${username} left the chat`,
          timestamp: new Date().toISOString()
        });
        
        // Broadcast updated users list
        io.emit('online_users', Object.values(onlineUsers));
      }
    });
  });
};

module.exports = handleSocketConnection;
