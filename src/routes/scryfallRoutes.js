const express = require("express");
const axios = require("axios");
const router = express.Router();

// Proxy to Scryfall API
router.get("/search", async (req, res) => {
    const { query, set } = req.query; // Expecting `query` and optional `set` params

    if (!query) {
        return res.status(400).json({ msg: "Query parameter is required." });
    }

    try {
        // Build Scryfall API URL
        let url = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query)}`;
        if (set) {
            console.log("Requesting URL:", url);
            url += `&set=${set}`;
        }

        // Make API call to Scryfall
        const response = await axios.get(url);

        // Send card data back to the client
        res.json(response.data);
    } catch (error) {
        console.error("Error querying Scryfall:", error.message);
        res.status(500).json({ msg: "Failed to fetch data from Scryfall." });
    }
});

router.get("/autocomplete", async (req, res) => {
    const { query } = req.query; // Expecting a partial card name

    if (!query) {
        return res.status(400).json({ msg: "Query parameter is required." });
    }

    try {
        // Build the autocomplete URL for Scryfall
        const url = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`;
        console.log("Requesting URL:", url);

        // Make the API call to Scryfall
        const response = await axios.get(url);
        console.log("Response:",response);
        // Send the autocomplete data (list of card names) back to the client
        res.json(response.data.data);
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Error querying Scryfall autocomplete:", error.response.data);
        } else {
            console.error("Error querying Scryfall autocomplete:", error.message);
        }
        res.status(500).json({ msg: "Failed to fetch autocomplete data from Scryfall." });
    }
});

module.exports = router;
