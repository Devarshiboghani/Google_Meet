<div align="center">
  <img src="https://img.icons8.com/color/96/000000/google-meet.png" alt="Nexus Meet Logo" />
  <h1>🎥 Google Meet - Real-Time Video Conferencing</h1>
  <p><strong>A modern, full-stack video conferencing platform built with React, Node.js, WebRTC, Socket.io & MongoDB</strong></p>
</div>

---

## 📖 About

**Nexus Meet** is a highly advanced, full-stack video conferencing web application designed to replicate the core functionalities of Google Meet. It allows users to connect seamlessly through high-quality peer-to-peer video calls using WebRTC. Wrapped in a responsive, premium dark-mode UI, it offers secure authentication, real-time messaging, file sharing, screen sharing, and cloud meeting recordings.

---

## ✨ Features

- 🔒 **Authentication** — Secure Sign-up & Sign-in with JWT (JSON Web Tokens).
- 📹 **Real-Time Video Calling** — Low-latency, high-quality P2P video and audio streaming powered by **WebRTC** Mesh topology.
- 💬 **Live Chat & File Sharing** — Real-time messaging and file attachments (Images, PDFs, Docs) powered by **Socket.io**.
- 🖥️ **Screen Sharing** — Instantly share your screen or specific browser tabs with all meeting participants.
- ☁️ **Cloud Recording** — Record meetings (Video + Audio) and securely save them directly to the backend cloud.
- ✋ **Interactive Tools** — "Raise Hand" feature, participant muting, host controls, and participant removal.
- 🎨 **Dynamic Layouts** — Auto-adjusting video grid, Spotlight (Pin video), and Fullscreen modes.
- 🗓️ **Google Calendar Integration** — One-click meeting scheduling with auto-generated meeting links.
- 📊 **Meeting Dashboard** — View your complete meeting history, active meetings, chat archives, and manage profile settings.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React (Vite) + React Router DOM |
| **Backend Framework** | Node.js with Express.js |
| **Real-Time Engine** | Socket.io |
| **P2P Streaming** | WebRTC (RTCPeerConnection) |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT & bcryptjs |
| **Styling** | Tailwind CSS (Premium Dark Mode System) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```bash
Nexus_Meet/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Dashboard, Chat, VideoGrid)
│   │   ├── context/            # Global State (AuthContext)
│   │   ├── hooks/              # Custom Hooks (useWebRTC, useSocket)
│   │   ├── pages/              # Main Route Pages (Landing, MeetingRoom, Dashboard)
│   │   └── App.jsx             # Main Application Router
│   ├── package.json            # Frontend Dependencies
│   └── tailwind.config.js      # Tailwind CSS Configuration
│
├── server/                     # Backend Node.js Server
│   ├── config/                 # DB Connection Setup
│   ├── middleware/             # JWT Auth Middleware
│   ├── models/                 # Mongoose Schemas (User, Meeting, Message, File)
│   ├── routes/                 # Express API Endpoints
│   ├── sockets/                # Socket.io Event Handlers (WebRTC Signaling, Chat)
│   ├── uploads/                # Local Cloud Storage for Recordings & Files
│   ├── server.js               # Main Express Server Entry Point
│   └── .env                    # Environment Variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- A **MongoDB** database (Local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Devarshiboghani/Google_Meet.git
   cd Google_Meet
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MongoDB URI, JWT Secret, FRONTEND_URL, PORT
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   # Open a new terminal window
   cd client
   npm install
   # Create a .env file VITE_BACKEND_URL
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the app running!

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Fetch currently authenticated user data |

### Meetings & Recordings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/meetings/history` | Get user's complete meeting history |
| `GET` | `/api/meetings/my-recordings` | Get all cloud recordings saved by user |
| `GET` | `/api/meetings/:id` | Fetch specific meeting details & chat logs |
| `POST` | `/api/meetings/:id/recordings`| Save metadata for a new cloud recording |

### Files
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/files/upload` | Upload files (Attachments/Recordings) |

---

## 🧩 Application Pages

| Route | Description |
| :--- | :--- |
| `/` | Landing page highlighting features |
| `/login` | User authentication & login |
| `/register` | New user account creation |
| `/dashboard` | Main hub: Join, Schedule, or Start instant meetings |
| `/meeting/:id` | The main Video Conferencing Room (WebRTC) |
| `/dashboard/recordings`| View and download your cloud-saved recordings |

---