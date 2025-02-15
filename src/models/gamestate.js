// src/models/GameState.js
const mongoose = require('mongoose');

const PlayerStateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true,
  },
  life: {
    type: Number,
    default: 20,
  },
  hand: [
    {
      type: String, // Card identifiers
    },
  ],
  // Add more fields as needed (e.g., battlefield, graveyard)
});

const GameStateSchema = new mongoose.Schema({
  lobby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lobby',
    required: true,
    unique: true,
  },
  players: [PlayerStateSchema],
  currentTurn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  phase: {
    type: String,
    enum: ['draw', 'main', 'combat', 'end'],
    default: 'draw',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add more game state properties as needed
});

module.exports = mongoose.model('GameState', GameStateSchema);
