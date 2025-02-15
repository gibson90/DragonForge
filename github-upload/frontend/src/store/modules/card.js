// frontend/src/store/card.js (Refactored Pinia version)
import { defineStore } from 'pinia';
import { useDeckStore } from './deck';
import { fetchCardDetails } from "@/services/scryfall";
import { ref } from "vue";

export const useCardStore = defineStore("card", () => {
    // Initialize Deck Store
    const deckStore = useDeckStore();
    // Intialize variables
    const index = ref(null);
    const card = ref(null);
    const isTableView = ref(false);
    const toggleVar = ref(false);

    // Function to toggle between table and card view
    function toggleTable() {
        isTableView.value = !isTableView.value;
    }

    function toggleMenu(i, e) {
        if (toggleVar.value == true) {
            //console.log("True -> False");
            toggleVar.value = false;
            index.value = null;
        } else {
            let deck = deckStore.localDeck;
            let cardIndex = (deck.cards || []).findIndex(card => card._id === i._id);

            //console.log("False -> True");
            index.value = cardIndex;
            toggleVar.value = !toggleVar.value;

            console.log("Toggled index:", toggleVar.value, e);
        }
    }

    // Functions for Card Menu
    function adjustQuantity(payload) {
        let deck = deckStore.localDeck;
        let card = deck.cards[index.value];

        if (!card) {
            console.warn("No card found at index", index.value);
            return;
        }

        if (payload.type === 'increase') {
            if (validateCard(card)) card.quantity += payload.amount;
        } else if (payload.type === 'decrease') {
            card.quantity -= payload.amount;
            if (card.quantity <= 0) {
                removeCard();
                return; // Avoid further execution after removal
            }
        }

        deck.cards[index.value] = card;
        deckStore.localDeck = deck;
    }

    async function addNewCard(newCard) {
        if (typeof newCard !== 'object') {
            let card;
            console.warn("String passed, searching for card details:", newCard);
            try {
                card = await fetchCardDetails(newCard);
            } catch (error) {
                console.error("Error fetching full card details:", error);
                return;
            }

            const savedCard = {
                id: card.id,
                name: card.name,
                set: card.set || "Unknown Set",
                quantity: 1,
                type: card.type_line || "Unknown",
                scryfallId: card.id,
                imageUrl: card.image_uris?.normal || "https://via.placeholder.com/150",
                artCropUrl: card.image_uris?.art_crop || "https://via.placeholder.com/150",
                manaCost: card.mana_cost || "N/A",
                colorIdentity: card.colors,
                cardFaces: card.card_faces,
                commander: false,
            };
            console.log("Card found:", savedCard);
            deckStore.localDeck.cards.push(savedCard);
            return;

        } else {
            let deck = deckStore.localDeck;
            let existingCardIndex = deck.cards.findIndex(card => card._id === newCard.card._id);

            if (existingCardIndex !== -1) {
                console.log("Card already exists in deck");
                if (validateCard(newCard.card)) {
                    deck.cards[existingCardIndex].quantity += 1;
                }
            } else {
                deck.cards.push(newCard);
            }

            deckStore.localDeck = deck;
        }
    }

    // Function to switch between printings of a card & Change to foil
    function switchPrint(payload) {
        let deck = deckStore.localDeck;
        let card = deck.cards[index.value];

        if (!card) {
            console.warn("No card found at index", index.value);
            return;
        }

        if (payload.type === 'switch') {
            card.scryfallId = payload.card.id;
            card.imageUrl = payload.card.image_uris?.normal || "https://via.placeholder.com/150";
            card.artCropUrl = payload.card.image_uris?.art_crop || "https://via.placeholder.com/150";
            card.manaCost = payload.card.mana_cost || "N/A";
            card.cardFaces = payload.card.card_faces;
        } else if (payload.type === 'foil') {
            card.foil = true;
        }

        deck.cards[index.value] = card;
        deckStore.localDeck = deck;
    }

    function promoteCommandZone(payload) {
        let deck = deckStore.localDeck;
        let card = deck.cards[payload.index];

        console.log("Card", card);

        if (!card) {
            console.warn("No card found at index", index.value);
            return;
        }

        if (deck.type.toLowerCase() != 'commander') {
            // Empty for now
        } else {
            if (!card.type.includes("Legendary")) {
                console.error("Only Legendary creatures can become commanders");
                return
            } else if (deck.commandZone.length > 0){
                console.error("This deck already has a commander");
                return
            } else {
                card.commander = true;
                deck.commandZone = card;
            }
        }
        deck.cards[index.value] = card;
        deckStore.localDeck = deck;
        deckStore.updateDeck(deckStore.localDeck);
    }

    function removeCard() {
        console.log("Removing card at index:", index.value);
        let deck = deckStore.localDeck;

        // Check if card is in the commandZone and remove it
        if (deck.commandZone && deck.commandZone._id === deck.cards[index.value]._id) {
            deck.localDeck.commandZone = null;
        }
        

        if (index.value !== null && index.value >= 0 && index.value < deck.cards.length) {
            deck.cards.splice(index.value, 1);
        } else {
            console.warn("Invalid index:", index.value);
        }

        // Reset index after removal to prevent out-of-sync issues
        index.value = null;
        deckStore.localDeck = deck;
        deckStore.updateDeck(deckStore.localDeck);
    }


    // Card Validation Function
    function validateCard(card) {
        if (!card.name || !card.set || !card.quantity || !card.type) {
            return false;
        }
        // Validate deck type regulations
        const deck = deckStore.localDeck;
        if (deck.type.toLowerCase() === "commander") {
            // Can only have 1 of each card in a commander deck except for basic lands
            if (card.quantity >= 1 && !card.type.toLowerCase().includes("basic land")) return false;
        } else if (["standard", "modern", "legacy", "vintage"].includes(deck.type.toLowerCase())) {
            // Can only have 4 of each card in a standard, modern, legacy, or vintage deck
            if (card.quantity >= 4) return false;
        }

        return true;
    }

    return {
        index,
        card,
        isTableView,
        toggleVar,
        toggleMenu,
        toggleTable,

        // Functions for Card Menu
        adjustQuantity,
        addNewCard,
        removeCard,
        switchPrint,
        promoteCommandZone,
        // Function for Card Validation
        validateCard,
    };
});
