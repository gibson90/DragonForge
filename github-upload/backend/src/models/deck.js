const mongoose = require("mongoose");

// Define Card Schema separately
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  set: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true }, // Card type (e.g., Creature, Instant)
  scryfallId: { type: String, required: true }, // Scryfall unique ID
  imageUrl: { type: String, required: false }, // Image URL for display
  artCropUrl: { type: String, required: false }, // Cropped art image
  manaCost: { type: String, required: false }, // Mana cost display
  colorIdentity: {type: Array, required: false}, // Color identity of card
  cardFaces: { type: Array, required: false }, // For double-sided cards
  commander: { type: Boolean, required: false, default: false } // Default value added
});

// Define Deck Schema
const DeckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to User ID
    type: { 
      type: String, 
      required: true, 
      enum: ["Commander", "Standard", "Modern", "Pioneer", "Legacy", "Vintage"] 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    cards: [cardSchema], // Use cardSchema

    // Commander-specific fields
    commander: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', default: null },
    commandZone: { type: [cardSchema], default: [], required: function () { return this.type === "Commander"; } },

    // Optional: Extra deck data
    sideboard: { type: [cardSchema], default: [] }, // Used in some formats
    companions: { type: [cardSchema], default: [] } // Used in certain competitive decks
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Deck", DeckSchema);
