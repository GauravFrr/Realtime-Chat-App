import React, { useState } from 'react';

const UsernameEntry = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (cleanName) {
      onJoin(cleanName);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Join Chat Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Choose your username</label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gaurav"
              maxLength={20}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary">Connect</button>
        </form>
      </div>
    </div>
  );
};

export default UsernameEntry;
