import React from 'react';

const OnlineUsers = ({ users, currentUser }) => {
  return (
    <div className="online-users-sidebar">
      <h3>Active Users ({users.length})</h3>
      <ul className="users-list">
        {users.map((user, idx) => (
          <li key={idx} className={user === currentUser ? 'user-item current' : 'user-item'}>
            <span className="status-dot"></span>
            <span className="username">{user} {user === currentUser && '(You)'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
