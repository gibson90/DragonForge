// frontend/src/store/deck.js (Refactored Pinia version)
import { defineStore } from 'pinia';
import api from "@/services/api";
import { ref, reactive, watch, nextTick } from "vue";
import { debounce } from 'lodash';

export const useDeckStore = defineStore("deck", () => {
    // State
    const decks = ref([]);
    const deckId = ref(null);
    const localDeck = ref({});
    const loading = ref(false);
    const error = ref(null);
    const alert = ref([]);

    // **Deck Format Rules**
    const formats = reactive({
        commander: { minSize: 100, maxSize: 100, singleton: true, requiresCommander: true },
        standard: { minSize: 60, maxSize: 60, singleton: false, requiresCommander: false },
        modern: { minSize: 60, maxSize: 60, singleton: false, requiresCommander: false },
    });

    // **Banned Cards by Format**
    const bannedCards = reactive({
        commander: ["Black Lotus", "Ancestral Recall"],
        standard: ["Oko, Thief of Crowns"],
        modern: [],
    });

    // **Max Copies Per Format**
    const maxCopies = reactive({
        commander: 1,
        standard: 4,
        modern: 4,
    });

    async function fetchDecks() {
        loading.value = true;
        try {
            const { data } = await api.get("/decks");
            decks.value = data;
        } catch (err) {
            error.value = err.message || "Error fetching decks";
        } finally {
            loading.value = false;
        }
    }

    async function fetchDeck(currentDeck) {
        loading.value = true;
        try {
            const { data } = await api.get(`/decks/${currentDeck}`);
            if (!localDeck.value) localDeck.value = {}; // Ensure reactivity
    
            Object.assign(localDeck.value, data); // ✅ Update properties instead of replacing
            deckId.value = currentDeck;
        } catch (err) {
            console.error("Error fetching deck:", err);
            error.value = err.message || "Error fetching deck";
        } finally {
            loading.value = false;
        }
    }    

    async function createDeck({ name, type }) {
        loading.value = true;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found.");

            const { data } = await api.post("/decks", { name, type }, { headers: { Authorization: `Bearer ${token}` } });
            decks.value.push(data);
        } catch (err) {
            error.value = err.message || "Error creating deck";
        } finally {
            loading.value = false;
        }
    }

    async function updateDeck(updatedDeck) {
        console.log("Updating deck:", updatedDeck);
        loading.value = true;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found.");

            const { data } = await api.put(`/decks/${updatedDeck._id}`, updatedDeck, { headers: { Authorization: `Bearer ${token}` } });
            console.log("Data", data);
            const index = decks.value.findIndex(deck => deck._id === updatedDeck._id);
            if (index !== -1) {
                decks.value[index] = data;
            }
        } catch (err) {
            error.value = err.message || "Error updating deck";
        } finally {
            loading.value = false;
        }
    }

    async function deleteDeck(deckId) {
        loading.value = true;
        try {
            await api.delete(`/decks/${deckId}`);
            decks.value = decks.value.filter(deck => deck._id !== deckId);
        } catch (err) {
            error.value = err.message || "Error deleting deck";
        } finally {
            loading.value = false;
        }
    }

    function validateDeck(deck) {
        const formatRules = formats[deck.type.toLowerCase()];

        // 2. Check deck size
        if (deck.cards.length < formatRules.minSize || deck.cards.length > formatRules.maxSize) {
            alert.value.push({
                type: "deck-validation",
                title: "Deck Validation Error",
                subject: `Deck size must be between ${formatRules.minSize} and ${formatRules.maxSize} cards.`,
                message: null,
            });
            console.error(`Deck size must be between ${formatRules.minSize} and ${formatRules.maxSize} cards.`, alert.value);
        }

        // 3. Check singleton rule
        if (formatRules.singleton) {
            const cardCounts = {};
            const basicLands = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
                "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp",
                "Snow-Covered Mountain", "Snow-Covered Forest"];

            deck.cards.forEach(card => {
                if (!basicLands.includes(card.name)) {
                    cardCounts[card.name] = (cardCounts[card.name] || 0) + card.quantity;
                }
            });

            for (const card in cardCounts) {
                if (cardCounts[card] > 1) {
                    alert.value.push({
                        type: "deck-validation",
                        title: "Deck Validation Error",
                        subject: `Singleton rule violation: ${card} appears ${cardCounts[card]} times.`,
                        message: null,
                    });
                    console.error(`Singleton rule violation: ${card} appears ${cardCounts[card]} times.`);
                }
            }

        }

        // 4. Check banned cards
        if (deck.type.toLowerCase() in bannedCards) {
            const banned = bannedCards[deck.type.toLowerCase()];
            deck.cards.forEach(card => {
                if (banned.includes(card.name)) {
                    alert.value.push({
                        type: "deck-validation",
                        title: "Deck Validation Error",
                        subject: `${card.name} is banned in ${deck.type} format.`,
                        message: null,
                    });
                    console.error(`${card.name} is banned in ${deck.type} format.`);
                }
            });
        }

        // 5. Check max copies
        if (deck.type.toLowerCase() in maxCopies && !formatRules.singleton) {
            const max = maxCopies[deck.type.toLowerCase()];
            deck.cards.forEach(card => {
                if (card.quantity > max) {
                    alert.value.push({
                        type: "deck-validation",
                        title: "Deck Validation Error",
                        subject: `${card.name} exceeds the maximum of ${max} copies.`,
                        message: null,
                    });
                    console.error(`${card.name} exceeds the maximum of ${max} copies.`);
                }
            });
        }

        // 6. Commander Validation (if applicable)
        if (formatRules.requiresCommander) {
            const commander = deck.commandZone.length;
            if (commander < 1) {
                alert.value.push({
                    type: "deck-validation",
                    title: "Deck Validation Error",
                    subject: "Commander format requires a commander.",
                    message: null,
                });
                console.error("Commander format requires a commander.", alert.value);
            } else {
                console.log("Found commander, checking color identity", deck);
                // Validating Color Identity
                const commanderColors = new Set([...deck.commandZone[0].colorIdentity]);
                const invalidCards = deck.cards.filter(card =>
                    ![...card.colorIdentity].every(color => commanderColors.has(color))
                );
                if (invalidCards.length) {
                    alert.value.push({
                        type: "deck-validation",
                        title: "Deck Validation Error",
                        subject: `Commander deck must follow color identity: ${commanderColors.size ? [...commanderColors].join(", ") : "Colorless"}. Invalid cards: ${invalidCards.map(c => c.name).join(", ")}`,
                        message: null,
                    });
                    console.error(`Commander deck must follow color identity: ${commanderColors.size ? [...commanderColors].join(", ") : "Colorless"}. Invalid cards: ${invalidCards.map(c => c.name).join(", ")}`);
                }
                
            }
        }
    }
    // Waiting for localdeck to update then running validation
    let isInitialRun = true;
    watch(localDeck, debounce(async () => {
        console.log("Local Deck Change:", localDeck.value);
        if (!localDeck.value || !localDeck.value.name || !localDeck.value.type) {
            console.warn("Deck data is incomplete, waiting for update...");
            return;
        }
    
        if (isInitialRun) {       
            await nextTick();     
            validateDeck(localDeck.value);
            isInitialRun = false;
            return;
        }
        await nextTick();
        validateDeck(localDeck.value);
        updateDeck(localDeck.value);
    }, 500), { deep: true });

    return {
        decks,
        deckId,
        localDeck,
        loading,
        error,
        alert,
        fetchDecks,
        fetchDeck,
        createDeck,
        updateDeck,
        deleteDeck,
        validateDeck
    };
});
