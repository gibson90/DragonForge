// src/server.js
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const connectDB = require('./database/connection');
const config = require('./config');
const logger = require('./utils/logger');
const socketHandlers = require('./sockets/sockets');
const deckRoutes = require("./routes/deckRoutes");
const scryfallRoutes = require("./routes/scryfallRoutes");


app.use("/api/decks", deckRoutes);
app.use("/api/scryfall", scryfallRoutes);

require('dotenv').config({path:'../.env'});
console.log("JWT:", process.env.JWT_SECRET);

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL, // e.g., 'http://localhost:8080'
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket Handlers
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);
  socketHandlers(io, socket);
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
