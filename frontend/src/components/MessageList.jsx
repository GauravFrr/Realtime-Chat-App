import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUser, typingUser }) => {
  const listEndRef = useRef(null);

  // Auto-scroll to bottom of conversation log when new messages arrive or user is typing
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="message-list-container">
      <div className="messages-scroller">
        {messages.map((msg, idx) => {
          // If it doesn't contain a username, it's a system event (join/leave)
          const isSystem = !msg.username;
          const isMe = msg.username === currentUser;

          if (isSystem) {
            return (
              <div key={msg.id || idx} className="message-item system">
                <span className="system-text">{msg.message}</span>
                <span className="system-time">{formatTime(msg.timestamp)}</span>
              </div>
            );
          }

          return (
            <div key={msg.id || idx} className={isMe ? 'message-item me' : 'message-item other'}>
              <div className="bubble-wrapper">
                {!isMe && <span className="bubble-sender">{msg.username}</span>}
                <div className="bubble-body">
                  <span className="bubble-text">{msg.message}</span>
                  <span className="bubble-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {typingUser && (
          <div className="message-item system typing-notice">
            <span className="system-text">{typingUser} is typing...</span>
          </div>
        )}
        
        <div ref={listEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
