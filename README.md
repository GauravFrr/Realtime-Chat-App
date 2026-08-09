# Real-Time Chat Application

This is a real-time web chat application featuring a React-based web frontend and a Node.js + Express + Socket.io + SQLite backend. Users can join the chat room by choosing a username and participate in a real-time group chat.

## Architecture

The project is structured into two separate main directories:
1. **`backend/`**: An Express server integrated with Socket.io. It handles client connections, tracks online users in memory, exposes REST APIs for message logging and history, and persists messages in a local SQLite database file.
2. **`frontend/`**: A React web application built with Vite. It queries the backend API for chat history on startup, connects to the Socket.io server for real-time messaging, updates active user lists, and displays visual alerts if the server drops offline.

## Design Decisions

- **SQLite Database**: We chose SQLite because it is lightweight, serverless, and stores data in a single file (`chat.db`). This makes the application self-contained and extremely easy to set up, run, and test locally without requiring a separate database server (like PostgreSQL or MySQL).
- **React Web over React Native**: Due to the short deadline (24-hour job assessment target), we built a React web application instead of React Native. Scaffolding, styling, testing, and debugging socket connections are significantly faster in a web browser than configuring mobile emulators, native build dependencies, and cross-platform layouts.

## Assumptions Made

- **Simple Authentication**: There is no password-based registration or user authentication. The username entered on startup is stored only in the local application state to identify the message sender.
- **In-Memory Active Users**: The active/online users list is kept in the server's memory (`onlineUsers` dictionary). If the server restarts, the list is reset, and clients must rejoin to show up.
- **No Encryption**: Chat messages are sent in plain text over HTTP/WebSockets and stored as plain text in the SQLite database (no end-to-end encryption or hashing).

## Backend Environment Variables

Create a `.env` file in the `backend/` directory based on the `.env.example` template:
```env
PORT=5000
DB_PATH=chat.db
FRONTEND_URL=http://localhost:5173
```
- `PORT`: The port on which the Express server listens (default: 5000).
- `DB_PATH`: The filename/path for the SQLite database.
- `FRONTEND_URL`: The URL of the React frontend used to configure CORS allowances.

---

## Setup and Running Locally

### 1. Run the Backend Server
Navigate to the `backend/` folder:
```bash
cd backend
npm install
npm start
```
The server will initialize the SQLite schema and start listening on port 5000.

### 2. Run the Frontend React Web App
Open a separate terminal window and navigate to the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at the local address printed in the terminal (usually `http://localhost:5173`).

---

## Deploying the Backend to Render

To deploy the backend to Render:
1. Push your project code to your GitHub repository (e.g., `https://github.com/GauravFrr/OIBSIP.git`).
2. Log in to the [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
   - **Name**: `vedaz-chat-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In the **Environment** tab, add the environment variables:
   - `PORT` = `5000` (or leave empty to let Render assign)
   - `DB_PATH` = `/opt/render/project/src/chat.db` (to persist SQLite between deploys, use Render's persistent disk, or leave as default `chat.db` for transient deploys)
   - `FRONTEND_URL` = `https://vedaz-chat-frontend.onrender.com` (your deployed React frontend URL)

### Live API URL
Once deployed, the live backend service is hosted at:
**Live API URL**: [https://vedaz-chat-backend.onrender.com](https://vedaz-chat-backend.onrender.com)
