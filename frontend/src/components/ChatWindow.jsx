import React, { useState, useEffect } from 'react';
import socket from '../socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';

const ChatWindow = ({ username, onDisconnect }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // 1. Fetch chat history via REST API
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/messages`);
        if (res.ok) {
          const history = await res.json();
          setMessages(history);
        } else {
          console.error('Failed to load message history from REST API');
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();

    // 2. Connect socket
    socket.connect();
    if (socket.connected) {
      socket.emit('join', username);
    }

    // 3. Register Socket.io listeners
    socket.on('connect', () => {
      setConnectionError(false);
      socket.emit('join', username);
    });

    socket.on('disconnect', () => {
      setConnectionError(true);
    });

    socket.on('connect_error', () => {
      setConnectionError(true);
    });

    socket.on('new_message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on('system_message', (sysMsg) => {
      // System notices look like standard message objects but without username field
      setMessages((prev) => [...prev, {
        id: null,
        message: sysMsg.message,
        timestamp: sysMsg.timestamp
      }]);
    });

    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('user_typing', (data) => {
      // Prevent showing ourselves as typing
      if (data.username !== username) {
        if (data.isTyping) {
          setTypingUser(data.username);
        } else {
          setTypingUser(null);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('new_message');
      socket.off('system_message');
      socket.off('online_users');
      socket.off('user_typing');
      socket.disconnect();
    };
  }, [username]);

  const handleSendMessage = (messageText) => {
    socket.emit('send_message', {
      username,
      message: messageText
    });
  };

  const handleTypingStatus = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  const handleLeave = () => {
    socket.disconnect();
    onDisconnect();
  };

  return (
    <div className="chat-window-container">
      {connectionError && (
        <div className="connection-error-banner">
          ⚠️ Server connection lost. Attempting to reconnect...
        </div>
      )}
      
      <div className="chat-header">
        <h2>Chat Room</h2>
        <button onClick={handleLeave} className="btn-secondary">Leave</button>
      </div>

      <div className="chat-body">
        <div className="chat-main-section">
          <MessageList
            messages={messages}
            currentUser={username}
            typingUser={typingUser}
          />
          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTypingStatus}
          />
        </div>
        <OnlineUsers
          users={onlineUsers}
          currentUser={username}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
