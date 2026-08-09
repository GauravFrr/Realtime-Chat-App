import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    // Emit typing status if first keypress
    if (!isTyping && val.trim() !== '') {
      setIsTyping(true);
      onTyping(true);
    }

    // Reset indicator if user stops typing for 1.5 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanText = text.trim();
    if (cleanText) {
      onSend(cleanText);
      setText('');
      
      // Clear timeout and stop typing status immediately
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      onTyping(false);
    }
  };

  // Cleanup timer on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Type a message..."
        maxLength={500}
        required
      />
      <button type="submit" className="btn-send">Send</button>
    </form>
  );
};

export default MessageInput;
