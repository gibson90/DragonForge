const express = require("express");
const router = express.Router();
const Deck = require("../models/deck");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes

// ✅ Get All Decks for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const decks = await Deck.find({ ownerId: req.user.userId });
        res.json(decks);
    } catch (error) {
        console.error("Error fetching decks:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Fetching deck with ID:", req.params.id); // ✅ Log incoming request
        const deck = await Deck.findById(req.params.id);
        res.json(deck);
    } catch (error) {
        console.error("Error fetching deck:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Create a New Deck
router.post(
    "/",
    authMiddleware,
    [
        body("name").notEmpty().withMessage("Deck name is required"),
        body("type").notEmpty().withMessage("Deck type is required")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, type } = req.body; // ✅ Extract `name` and `type` before using them.

        try {
            if (!["Commander", "Standard", "Modern", "Pioneer", "Legacy", "Vintage"].includes(type)) {
                return res.status(400).json({ msg: "Invalid deck type." });
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json({ msg: "Unauthorized: User ID is missing." });
            }

            const newDeck = new Deck({
                name,
                type, // ✅ Now includes type
                ownerId: req.user.userId,
                cards: [],
            });

            const savedDeck = await newDeck.save();
            res.json(savedDeck);
        } catch (error) {
            console.error("❌ Error creating deck:", error);
            res.status(500).json({ msg: "Server error", error: error.message });
        }
    }
);

// ✅ Delete a Deck
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id);
        if (!deck) return res.status(404).json({ msg: "Deck not found" });

        // Ensure the user owns the deck
        if (deck.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        await deck.remove();
        res.json({ msg: "Deck deleted" });
    } catch (error) {
        console.error("Error deleting deck:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Update a Deck
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Incoming deck update request:", req.body); // ✅ Log incoming data

        const deck = await Deck.findById(req.params.id);
        if (!deck) return res.status(404).json({ msg: "Deck not found" });

        if (deck.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Unauthorized - You do not own this deck" });
        }

        // ✅ Extract request data
        const { name, type, cards, commandZone } = req.body;

        if (!Array.isArray(cards)) {
            return res.status(400).json({ msg: "Cards must be an array" });
        }

        // ✅ Log each card to check for missing fields
        console.log("🃏 Before validation, received cards:", cards);

        // ✅ Prevent overwriting correct values with defaults
        const validatedCards = cards.map(card => {
            let imageUrl = card.imageUrl || "https://via.placeholder.com/150";
            let artCropUrl = card.artCropUrl || "https://via.placeholder.com/150";

            if (card.cardFaces && card.cardFaces.length > 0) {
            imageUrl = card.cardFaces[0].image_uris.normal || imageUrl;
            artCropUrl = card.cardFaces[0].image_uris.art_crop || artCropUrl;
            }

            return {
            name: card.name || "Unknown Card",
            set: card.set || "Unknown Set",
            quantity: card.quantity || 1,
            type: card.type && card.type !== "Unknown" ? card.type : "Unknown",
            scryfallId: card.scryfallId && card.scryfallId !== null ? card.scryfallId : null,
            imageUrl: imageUrl,
            artCropUrl: artCropUrl,
            manaCost: card.manaCost && card.manaCost !== "N/A" ? card.manaCost : "N/A",
            colorIdentity: card.colorIdentity ?? null,
            cardFaces: card.cardFaces ?? null,
            commander: card.commander || false
            };
        });

        console.log("✅ Validated cards (before saving to MongoDB):", validatedCards); // ✅ Log validated cards

        deck.name = name || deck.name;
        deck.type = type || deck.type;
        deck.cards = validatedCards;
        deck.commandZone = commandZone || deck.commandZone;
        deck.updatedAt = Date.now();

        await deck.save();

        console.log("✅ Successfully updated deck:", deck); // ✅ Log final saved deck
        res.json({ msg: "Deck updated successfully", deck });
    } catch (error) {
        console.error("❌ Error updating deck:", error);
        res.status(500).json({ msg: "Server error" });
    }
});


module.exports = router;
