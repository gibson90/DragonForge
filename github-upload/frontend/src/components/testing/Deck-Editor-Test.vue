<template>
    <div :class="['deck-editor', mode]">

        <div v-if="mode === 'modal'" class="modal-container">
            <div class="modal-content">
                <h2>Editing in Modal</h2>
            </div>
        </div>

        <div v-else class="container">
            <div class="container-header">
                <div class="container-header-title">
                    <h2>Edit Deck: {{ localDeck?.name || "Loading..." }}</h2>
                </div>
                <div class="container-header-functions">
                    <button @click="toggleView">{{ isTableView ? "Card View" : "Table View" }}</button>
                    <!-- Card Search Input -->
                    <CardSearch @card="addCard" />
                    <!-- Editor Header Controls -->
                    <button @click="openMassImport">Import Cards</button> <!--Import Cards function -->
                    <button @click="saveDeck">Save Deck</button><!-- Save Deck Function -->
                    <button @click="$emit('close')">Close Editor</button><!-- Emit to Deckbuilder: Close -->
                </div>
            </div>

            <!-- Card Grid or Table View -->
            <!-- ✅ Card Grid View -->
            <div v-if="!isTableView" class="card-grid">
                <div v-for="(card, index) in localDeck.cards" :key="card" class="card-item"
                    @mouseenter="showDots(index)" @mouseleave="hideDots(index)">
                    <span v-if="menuVisible === index" class="menu-icon" @click="toggleCardMenu(index)">
                        <EllipsisVertical />
                    </span>
                    <!-- Individual MENU for each card -->
                    <div v-if="menuVisible === index" class="menu-container" @mouseleave="toggleCardMenu(index)">
                        <ul v-if="activeVisible === index" class="menu-dropdown">
                            <li class="menu-item card-name">{{ card.name }}</li>
                            <hr class="menu-divider" />
                            <!-- Section 1 -->
                            <li class="menu-item" @click="increaseQuantity">
                                <span class="icon">
                                    <FilePlus2 />
                                </span>
                                <span>Increase quantity</span>
                                <span class="shortcut"></span>
                            </li>
                            <li class="menu-item" @click="decreaseQuantity">
                                <span class="icon">
                                    <FileMinus2 />
                                </span>
                                <span>Decrease quantity</span>
                                <span class="shortcut"></span>
                            </li>
                            <li class="menu-item" @click="addAsNewCard">
                                <span class="icon">
                                    <PlusIcon />
                                </span>
                                <span>Add as new card</span>
                            </li>
                            <hr class="menu-divider" />

                            <!-- Section 2 -->
                            <li class="menu-item" @click="switchCardPrinting">
                                <span class="icon">
                                    <GridIcon />
                                </span>
                                <span>Switch card printing</span>
                                <span class="shortcut"></span>
                            </li>
                            <li class="menu-item" @click="switchToFoil">
                                <span class="icon">
                                    <SparklesIcon />
                                </span>
                                <span>Switch to foil</span>
                                <span class="shortcut"></span>
                            </li>
                            <li class="menu-item" @click="promoteToCommander(card)">
                                <span class="icon">
                                    <CrownIcon />
                                </span>
                                <span>Set as commander</span>
                            </li>
                            <hr class="menu-divider" />

                            <!-- Section 3 -->
                            <li class="menu-item">
                                <span class="icon">
                                    <ArrowRight />
                                </span>
                                <span>Move to category</span>
                                <span class="submenu-arrow"></span>
                            </li>
                            <li class="menu-item" @click="viewCardDetails">
                                <span class="icon">
                                    <EyeIcon />
                                </span>
                                <span>View card details</span>
                                <span class="shortcut"></span>
                            </li>
                            <li class="menu-item" @click="removeCard(card)">
                                <span class="icon">
                                    <TrashIcon />
                                </span>
                                <span>Remove card</span>
                                <span class="shortcut"></span>
                            </li>
                            <hr class="menu-divider" />

                            <!-- Section 4 -->
                            <li class="menu-item">
                                <span class="icon">
                                    <SettingsIcon />
                                </span>
                                <span>Card extras</span>
                                <span class="submenu-arrow"></span>
                            </li>
                        </ul>
                    </div>

                    <img :src="card.imageUrl" :alt="card.name" />
                </div>
            </div>

            <!-- ✅ Table View -->
            <div v-else>
                <table>
                    <tr>
                        <th>Quantity</th>
                        <th>Name</th>
                        <th>Set</th>
                        <th>Mana Cost</th> <!-- ✅ New Column -->
                        <th>Remove</th>
                    </tr>
                    <tr v-for="card in localDeck.cards" :key="card.id">
                        <td>{{ card.quantity }}</td>
                        <td>{{ card.name }}</td>
                        <td>{{ card.set }}</td>
                        <td>{{ card.manaCost }}</td> <!-- ✅ Show Mana Cost -->
                        <td><button @click="removeCard(card.id)">X</button></td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Mass Import Modal -->
        <MassImportModal v-if="showMassImport" @close="showMassImport = false" @import="handleMassImport"
            :mode="'cardImport'" />
    </div>
</template>

<script>
import { mapActions } from "vuex";
// import axios from "axios";
import MassImportModal from "@/components/Modal-Popup.vue";
import CardSearch from "@/components/Card-Search.vue";
import debounce from "lodash.debounce"; // ✅ Import debounce
import { fetchCardDetails } from "@/services/scryfall";

export default {
    components: { MassImportModal, CardSearch },
    props: {
        deck: Object,
        mode: { type: String, default: "default" },
    },
    data() {
        return {
            isTableView: false,
            searchQuery: "",
            searchResults: [],
            showDropdown: false,
            showMassImport: false,
            showCreateDeck: false,
            localDeck: null,
            menuVisible: null, // Track which card has an open menu
            activeVisible: null,
        };
    },
    watch: {
        deck: {
            immediate: true,
            handler(newDeck) {
                this.localDeck = newDeck
                    ? JSON.parse(JSON.stringify(newDeck))
                    : { name: "New Deck", cards: [], commandZone: [] };
            },
        },
        "localDeck.cards": {
            deep: true, // Watches nested properties
            handler: debounce(async function () {
                await this.saveDeck();
            }, 1000), // Debounce to prevent excessive api calls
        }
    },
    methods: {
        ...mapActions("deck", { updateDeck: "updateDeck" }),



        showDots(index) {
            this.menuVisible = index;
        },
        hideDots(index) {
            if (this.menuVisible === index) {
                this.menuVisible = null;
            }
        },
        toggleCardMenu(index) {
            this.activeVisible = this.activeVisible === index ? null : index;
        },

        // When a card suggestion is clicked
        async addCard(cardSuggestion) {
            // cardSuggestion is a string (the card name)
            let card;
            try {
                // Fetch full card details using the card name
                card = await fetchCardDetails(cardSuggestion, this.searchSet);
            } catch (error) {
                console.error("Error fetching full card details:", error);
                return;
            }

            // Build a new card object from the fetched card details
            const newCard = {
                id: card.id,
                name: card.name,
                set: card.set || "Unknown Set",
                quantity: 1,
                type: card.type_line || "Unknown",
                scryfallId: card.id,
                imageUrl: card.image_uris?.normal || "https://via.placeholder.com/150",
                artCropUrl: card.image_uris?.art_crop || "https://via.placeholder.com/150",
                manaCost: card.mana_cost || "N/A",
                commander: false
            };

            console.log("Adding card:", newCard, " | To deck:", this.localDeck);

            // Add the card to your deck
            this.localDeck.cards.push(newCard);

            // Clear the dropdown results (and optionally the search query)
            this.searchResults = [];
            this.searchQuery = "";
        },

        hideDropdownWithDelay() {
            setTimeout(() => {
                this.showDropdown = false;
            }, 200);
        },
        // ✅ FIX: Remove card by index, not cardId
        removeCard(card) {
            if (!card) {
                console.log("No card was provided.");
            }

            console.log("Removing card at index:", card);
            const index = this.localDeck.cards.findIndex(c => c.id === card.id);
            console.log("Index of card to remove:", index);
            if (index === -1) {
                console.log("Card not found in deck.");
                return;
            }
            console.log("Removing card:", this.localDeck.cards[index]);
            this.localDeck.cards.splice(index, 1);
        },

        promoteToCommander(card) {
            console.log("Card", card);
            // This function should only be active for Commander decks.
            if (this.localDeck.type !== "Commander") {
                alert("You can only designate a commander for Commander decks.");
                return;
            }

            // Assume each card may have a "partner" attribute (true/false).
            // If not provided, default it to false.
            const isPartner = card.partner || false;

            // Get a list of all currently designated commanders.
            const currentCommanders = this.localDeck.cards.filter(c => c.commander);

            // For non-partner cards: allow only one commander.
            if (!isPartner) {
                if (currentCommanders.length > 0) {
                    alert("A commander is already selected. Only one commander is allowed for non-partner cards.");
                    return;
                }
                // Otherwise, designate this card as the commander.
                card.commander = true;
            } else {
                // For cards with the partner attribute: allow up to 2 commanders.
                if (currentCommanders.length >= 2) {
                    alert("You cannot have more than two commanders with partner.");
                    return;
                }
                card.commander = true;
            }

            // Add the card to the commandZone if it isn’t already there.
            if (!this.localDeck.commandZone) {
                // Ensure commandZone exists (it should if your deck schema is correct)
                this.localDeck.commandZone = [];
            }
            if (!this.localDeck.commandZone.find(c => c.id === card.id)) {
                this.localDeck.commandZone.push(card);
            }

            // Optionally, you might want to update a deck-level commander field.
            // For example, if your deck schema has a 'commander' field that points to one primary commander:
            if (!this.localDeck.commander && !isPartner) {
                this.localDeck.commander = card.id;
            } else if (isPartner) {
                // In a partner scenario you might choose to either leave the deck-level field blank
                // or store an array of commander IDs.
                // For now, we’ll leave it as-is.
            }

            alert(`${card.name} is now designated as commander.`);
        },

        openMassImport() {
            this.showMassImport = true;
        },

        openCreateDeck() {
            this.showCreateDeck = true;
        },

        handleMassImport(cards) {
            this.localDeck.cards.push(...cards);
        },

        toggleView() {
            this.isTableView = !this.isTableView;
        },

        async saveDeck() {
            if (!this.localDeck._id) {
                console.error("Deck ID is missing! Cannot save.");
                return;
            }

            // Create a transformed copy for saving without reassigning the reactive array
            const cardsWithCommander = this.localDeck.cards.map(card => ({
                ...card,
                commander: typeof card.commander !== 'undefined' ? card.commander : false,
            }));

            try {
                await this.updateDeck({
                    id: this.localDeck._id,
                    name: this.localDeck.name,
                    type: this.localDeck.type,
                    cards: cardsWithCommander,
                });
                console.log("Deck successfully saved:", this.localDeck);
            } catch (error) {
                console.error("Error saving deck:", error);
            }
        },
    },

};
</script>

<style scoped>

/* Modal styling */
.deck-editor.default {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid gray;
    border-radius: 15px;
    padding: 10px;
}

.container-header {
    display: flex;
    align-items: center;
}

.container-header-functions {
    margin-left: auto;
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.container-header-functions button {
    min-height: 31px;
    max-height: 31px;
    margin-left: 10px;
}

.card-grid {
    display: flex;
}

.card-grid img {
    max-height: 360px;
    margin-left: 20px;
    border-radius: 15px;
}

.card-item {
    position: relative;
}

.menu-container.menu-icon {
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50% !important;
    background: #fff;
}

.menu-container {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 1000;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.menu-dropdown {
    list-style: none;
    margin: 0;
    padding: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    /* Vertically center content */
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.menu-item:hover {
    background-color: #f4f4f4;
}

.menu-item span {
    flex: none;
    /* Prevent text from stretching unnecessarily */
}

.icon {
    margin-right: 10px;
    color: #595959;
    width: 20px;
    flex: none;
    /* Prevents the icon from taking extra space */
}

.shortcut,
.submenu-arrow {
    margin-left: auto;
    /* Pushes these elements to the right */
    font-size: 12px;
    color: #999;
}

.menu-divider {
    border: none;
    height: 1px;
    background: #e4e4e4;
    margin: 8px 0;
}


.menu-icon {
    position: absolute;
    top: 18px;
    right: 12px;
    background: #fff;
    border-radius: 60%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 24px;
    height: 24px;
}

/* Card Styling */
.card-name {
    font-weight: bold;
}
</style>
