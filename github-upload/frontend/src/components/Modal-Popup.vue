<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import CardSearch from './Card-Search.vue';
import { useDeckStore } from '@/store/modules/deck';

const props = defineProps({ mode: { type: String, default: 'default' } });
const emit = defineEmits(['close', 'create', 'import']);

const deckStore = useDeckStore();
const alert = computed(() => deckStore.alert);

const deckName = ref('');
const format = ref('Commander / EDH');
const gameType = ref('Any');
const commandZone = ref('');
const massImportText = ref('');

const createDeck = () => {
    emit('create', { deckName: deckName.value, format: format.value, gameType: gameType.value, commandZone: commandZone.value });
    console.log("Creating deck with name:", deckName.value);
    emit('close');
};

const importCards = () => {
    const lines = massImportText.value.split('\n');
    const importedCards = lines.map(line => {
        const match = line.match(/^\d+\s(.+)\s\((\w+)\)$/);
        return match ? { name: match[1], set: match[2] } : null;
    }).filter(Boolean);
    emit('import', importedCards);
    emit('close');
};
</script>

<template>
    <div :class="['modal-overlay', props.mode]">
        <div v-if="props.mode === 'newDeck'" class="modal">
            <div class="modal-header">New Deck</div>

            <div class="form-group">
                <label for="deck-name">Deck name</label>
                <input type="text" id="deck-name" v-model="deckName" placeholder="Enter deck name">
            </div>

            <div class="form-group">
                <label for="format">Format</label>
                <select id="format" v-model="format">
                    <option>Commander / EDH</option>
                    <option>Standard</option>
                    <option>Modern</option>
                    <option>Pioneer</option>
                </select>
            </div>
            <div class="extra-options">
                <label for="game-type">Game type</label>
                <select id="game-type" v-model="gameType">
                    <option>Any</option>
                    <option>Casual</option>
                    <option>Competitive</option>
                </select>

                <label for="command-zone">Command zone</label>
                <CardSearch @card="commandZone = $event" />
                <!--<input type="text" id="command-zone" v-model="commandZone" placeholder="Search for card(s)">-->

            </div>

            <button class="create-deck-btn" @click="createDeck">Create deck</button>
            <button class="cancel-deck-btn" @click="$emit('close')">Cancel</button>
        </div>

        <div v-if="props.mode === 'cardImport'" class="modal">
            <div class="modal-header">Mass Import Cards</div>

            <div class="form-group textarea-container">
                <label for="mass-import">Paste Card List</label>
                <textarea id="mass-import" v-model="massImportText" placeholder="Example: 1 Ajani (cmr)"></textarea>
            </div>

            <div class="modal-buttons">
                <button class="import-btn" @click="importCards">Import</button>
                <button class="cancel-btn" @click="$emit('close')">Cancel</button>
            </div>
        </div>
        <div v-if="props.mode === 'deckAlert'" class="modal">
            <div class="modal-header">Deck Validation</div>
            <div class="modal-content">
                <ul>
                    <li v-for="(error, index) in alert" :key="index">
                        {{ error.title }}:  {{ error.subject }}
                    </li>
                </ul>
            </div>
            <div class="modal-buttons">
                <button class="cancel-btn" @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<!--
<script>
import { computed } from 'vue';
import CardSearch from './Card-Search.vue';
import { useDeckStore } from '@/store/modules/deck';

const deckStore = useDeckStore();

const alert = computed(() => deckStore.alert);

export default {
    setup: {
        alert
    },
    componments: {
        CardSearch,
    }, 
    props: {
        mode: {
            type: String,
            required: false,
            default: 'default',
        },
    },
    data() {
        return {
            deckName: '',
            format: 'Commander / EDH',
            gameType: 'Any',
            commandZone: '',
            massImportText: '',
        };
    },
    methods: {
        toggleCollapsible(option) {
            this[option] = !this[option];
        },
        createDeck() {
            // ✅ Emit an event with the new deck details
            this.$emit('create', {
                deckName: this.deckName,
                format: this.format,
                gameType: this.gameType,
                commandZone: this.commandZone,
            });
            // For demonstration, log the new deck details
            console.log("Creating deck with name:", this.deckName);
            // Close the modal
            this.$emit('close');

        },
        importCards() {
            const lines = this.massImportText.split('\n');
            const importedCards = [];
            lines.forEach(line => {
                const match = line.match(/^\d+\s(.+)\s\((\w+)\)$/);
                if (match) {
                    const [, name, set] = match;
                    importedCards.push({ name, set });
                }
            });
            this.$emit('import', importedCards);
            this.$emit('close');
        },
    },
};
</script>
-->
<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    z-index: 9999;
}

.modal {
    display: flex;
    flex-direction: column;
    width: 600px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 10000;
}

.modal-overlay.cardImport .modal {
    height: 600px;
}

.modal-overlay.cardImport .modal-buttons button {
    margin-right: 15px;
}

.modal-header {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.textarea-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

textarea {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    font-size: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

input[type="text"],
select,
.checkbox-container {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
}


.extra-options label:nth-last-child(2) {
    margin-top: 10px;
}

.collapsible {
    margin-bottom: 15px;
}

.collapsible label {
    cursor: pointer;
    color: #007bff;
}

.collapsible-content {
    display: none;
    margin-top: 10px;
}

.collapsible-content.open {
    display: block;
}

.create-deck-btn,
.cancel-deck-btn,
.import-btn,
.cancel-btn {
    display: inline-block;
    background: #28a745;
    color: #fff;
    border: none;
    padding: 10px 20px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
}

.create-deck-btn:hover,
.import-btn:hover {
    background: #218838;
}

.cancel-btn,
.cancel-deck-btn {
    background: #dc3545;
}

.cancel-btn:hover {
    background: #c82333;
}
</style>
