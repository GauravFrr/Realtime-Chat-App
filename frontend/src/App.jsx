import React, { useState } from 'react';
import UsernameEntry from './components/UsernameEntry';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  // Read initial username from localStorage to persist sessions across page refreshes
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chat_username') || '';
  });

  const handleJoin = (name) => {
    localStorage.setItem('chat_username', name);
    setUsername(name);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('chat_username');
    setUsername('');
  };

  return (
    <div className="app-container">
      {!username ? (
        <UsernameEntry onJoin={handleJoin} />
      ) : (
        <ChatWindow username={username} onDisconnect={handleDisconnect} />
      )}
    </div>
  );
}

export default App;
