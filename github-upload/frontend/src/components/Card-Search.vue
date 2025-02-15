<template>
    <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search for a card" @input="searchCards"
            @focus="showDropdown = true" @blur="hideDropdownWithDelay" />
        <ul v-if="showDropdown && searchResults.length" class="dropdown">
            <li v-for="card in searchResults" :key="card" @mousedown.prevent="selectedCard(card)">
                {{ card }}
            </li>
        </ul>
    </div>
</template>

<script>
import { fetchAutocompleteSuggestions } from "@/services/scryfall";

export default {
    data() {
        return {
            searchQuery: "",
            searchResults: [],
            showDropdown: false,
        };
    },
    methods: {
        async searchCards() {
            if (this.searchQuery.length < 3) {
                this.searchResults = [];
                return;
            }
            try {
                const results = await fetchAutocompleteSuggestions(this.searchQuery);
                this.searchResults = results;
            } catch (error) {
                console.error("Error fetching card suggestions:", error);
            }
        },
        selectedCard(card) {
            this.$emit('card', card);
            this.searchQuery = '';
            this.showDropdown = false;
        },
        hideDropdownWithDelay() {
            setTimeout(() => {
                this.showDropdown = false;
            }, 100); // Delay to allow click event to register
        },
    },
};
</script>

<style scoped>
/* Dropdown styling */
.search-container {
    position: relative;
    margin-right: 10px;
}

.search-container input {
    width: 100%;
    padding: 0;
    max-height: 30px;
    min-height: 30px;
    border-width: 1px;
    margin: 0 110px 0 10px;
}

.search-container input::placeholder {
    padding-left: 10px;
}

.dropdown {
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    z-index: 10;
    left: 10px;
    top:30px;
    padding: 0;
}

.dropdown::-webkit-scrollbar {
    display: none;
}

.dropdown ul {
    padding: 0px;
}

.dropdown li {
    padding: 8px;
    cursor: pointer;
    list-style: none;
}

.dropdown li:hover {
    background: #f0f0f0;
}

</style>