import React, { useState } from 'react';
import UsernameEntry from './components/UsernameEntry';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  const handleJoin = (name) => {
    setUsername(name);
  };

  const handleDisconnect = () => {
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
