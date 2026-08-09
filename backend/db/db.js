const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get database file path from env, fallback to chat.db
const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || 'chat.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
  }
});

// Setup the table on startup
const initDb = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating messages table:', err.message);
    }
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const saveMessage = (username, message, timestamp) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)',
      [username, message, timestamp],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // resolve with new row ID
          resolve(this.lastID);
        }
      }
    );
  });
};

module.exports = {
  initDb,
  getMessages,
  saveMessage,
  db
};
