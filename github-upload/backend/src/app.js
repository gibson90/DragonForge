// backend/src/app.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
//const deckRoutes = require('./routes/deckRoutes');
// ... other imports

const app = express();

// Middleware
app.use(express.json());

// Define rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Enable CORS
app.use(cors({
  origin: "http://localhost:8080",  // Allow frontend requests
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Apply rate limiter to auth routes only
app.use('/api/auth', authLimiter, authRoutes);
//app.use('/api/decks', deckRoutes);
// ... other routes

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


module.exports = app;
