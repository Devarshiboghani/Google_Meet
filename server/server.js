const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config({ override: true });

const connectDB = require('./config/db');
const { initializeSocket } = require('./sockets');
const path = require('path');
const fileRoutes = require('./routes/files');
const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/meetings', meetingRoutes);

// Basic Route for Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running with structured layout"
  });
});

// Initialize Socket.IO
initializeSocket(server);

const PORT = process.env.PORT || 5000;

// Start Server Flow
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
