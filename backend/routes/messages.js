const express = require('express');
const router = express.Router();
const { getMessages, saveMessage } = require('../db/db');

// GET full chat history
router.get('/', async (req, res) => {
  try {
    const list = await getMessages();
    res.json(list);
  } catch (err) {
    console.error('Error fetching chat history:', err.message);
    res.status(500).json({ error: 'Failed to retrieve message history.' });
  }
});

// POST save single message (fallback or alternative save route)
router.post('/', async (req, res) => {
  const { username, message, timestamp } = req.body;
  
  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message text are required.' });
  }
  
  // Use current ISO string if frontend doesn't supply it
  const msgTime = timestamp || new Date().toISOString();
  
  try {
    const newId = await saveMessage(username, message, msgTime);
    res.status(201).json({ id: newId, username, message, timestamp: msgTime });
  } catch (err) {
    console.error('Error saving chat message:', err.message);
    res.status(500).json({ error: 'Failed to save message to database.' });
  }
});

module.exports = router;
