<script setup>
import { computed, onMounted } from "vue";
import { useDeckStore } from "@/store/modules/deck";

const deckStore = useDeckStore();

const decks = computed(() => deckStore.decks);

function selectDeck(deck) {
    deckStore.fetchDeck(deck);
    deckStore.alert.length = 0;
}

function test(deck) {
    console.log("Deck Info:", deck)
}

onMounted(() => {
    deckStore.fetchDecks();
});

</script>

<template>
    <div class="deck-container">
        <div class="deck-container-title">
            <h2>Your Decks ({{ decks.length }})</h2>
            <button @click="$emit('create-deck', 'newDeck')">+</button>
        </div>

        <div class="deck-container-body">
            <div v-if="decks.length === 0">
                <p>No decks found. Click "Create New Deck" to start.</p>
            </div>

            <ul v-else class="deck-list">
                <li v-for="deck in decks" :key="deck._id" class="deck-item">
                    <div class="deck-card" @click="selectDeck(deck._id )"> 
                        <div class="deck-image">
                            <div class="deck-overlay"></div>
                            <div class="deck-meta">
                                <span>0 games</span> • <span>Last Edited: Today</span>
                            </div>
                        </div>
                        <div class="deck-content">
                            <div class="deck-colors">
                                <span class="mana-symbol white"></span>
                                <span class="mana-symbol blue"></span>
                                <span class="mana-symbol black"></span>
                            </div>
                            <div class="deck-title">
                                <span class="lock-icon">
                                    <!-- 🔒 -->
                                </span>
                                <h3> {{ deck.name }}</h3>
                                <span class="menu-icon" @click="test(deck)">⋮</span>
                            </div>
                            <div class="deck-details">
                                <p>{{ deck.type }}</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.deck-container {
    padding: 20px;
}

.deck-container-title {
    display: flex;
    align-items: center;
}

button {
    padding: 8px;
    margin: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    max-height: 28px;
    border-radius: 5px;
    font-size: 400;
    font-weight: bold;
}

ul {
    padding-inline-start: 0px;
}

.deck-list {
    display: flex;
    list-style: none;
}

.deck-card {
    width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    background: #fff;
    margin: 10px;
}

.deck-image {
    position: relative;
    height: 150px;
    background-image: url('https://cards.scryfall.io/art_crop/front/d/9/d99a9a7d-d9ca-4c11-80ab-e39d5943a315.jpg?1632831210');
    background-size: cover;
    background-position: center;
}

.deck-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
}

.deck-meta {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 12px;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.deck-content {
    padding: 10px;
}

.deck-colors {
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-bottom: 10px;
}

.mana-symbol {
    width: 20px;
    height: 20px;
    border-radius: 50%;
}

.mana-symbol.white {
    background-color: #f8f4d9;
    border: 1px solid #e2d6a3;
}

.mana-symbol.blue {
    background-color: #cfe2f3;
    border: 1px solid #a6c8e0;
}

.mana-symbol.black {
    background-color: #3b3b3b;
    border: 1px solid #222;
}

.deck-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.deck-title h3 {
    margin: 0;
    font-size: 16px;
}

.lock-icon {
    font-size: 14px;
    margin-right: 5px;
}

.menu-icon {
    font-size: 18px;
    cursor: pointer;
}

.deck-details {
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-top: 5px;
}
</style>