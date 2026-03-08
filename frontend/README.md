# Videogram Frontend

A React frontend for the Videogram video platform, built with Vite and designed for seamless integration with the backend API.

## Features

- **Authentication**: Login, register, and logout with JWT (access + refresh tokens)
- **User Profile**: View and edit profile, avatar, and cover image
- **Dashboard**: Overview of subscription stats and quick links
- **Channel Pages**: View channel profiles with subscriber counts
- **Watch History**: Browse videos you've watched

## Setup

1. Install dependencies:
   ```bash
   cd frontend && npm install
   ```

2. Start the backend (from project root):
   ```bash
   cd backend && npm run dev
   ```

3. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

## Configuration

The frontend uses Vite's proxy to forward `/api` requests to the backend (default: `http://localhost:4000`). Adjust `vite.config.js` if your backend runs on a different port.

**Backend `.env`**: For cookie-based auth to work, set `CORS_ORIGIN=http://localhost:5173` (using `*` may block credentials). Ensure the backend runs on port 4000 or update the Vite proxy accordingly.

## Tech Stack

- React 18 + Vite
- React Router v6
- Axios (with credentials for cookies)
- CSS with custom properties
