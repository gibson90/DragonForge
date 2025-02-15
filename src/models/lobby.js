// src/models/Lobby.js
const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
  lobbyId: {
    type: String,
    required: true,
    unique: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck',
      },
      ready: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: String,
    enum: ['waiting', 'started', 'finished'],
    default: 'waiting',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lobby', LobbySchema);
