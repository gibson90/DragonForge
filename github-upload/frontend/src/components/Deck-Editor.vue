<script setup>
import { ref, computed, defineProps } from 'vue';
import { useDeckStore } from '@/store/modules/deck';
import { useCardStore } from '@/store/modules/card';
import ModalPopup from '@/components/Modal-Popup.vue';
import CardSearch from '@/components/Card-Search.vue';
import CardGrid from '@/components/Card-Grid.vue';
//import CardTable from '@/components/CardTable.vue';

const props = defineProps({
    mode: {
        type: String,
        default: 'default'
    }
});

const deckStore = useDeckStore();
const cardStore = useCardStore();
const localDeck = computed(() => deckStore.localDeck);
const alert = computed(() => deckStore.alert);
const isTableView = ref(true);
const modalState = ref({});

const toggleView = () => (isTableView.value = !isTableView.value);
const toggleModal = (type) => {
    if (type === 'import') modalState.value.import = !modalState.value.import;
    if (type === 'alert') modalState.value.alert = !modalState.value.alert;
};
const saveDeck = () => deckStore.updateDeck();
const addCard = (card) => cardStore.addNewCard(card)
const handleMassImport = (cards) => deckStore.importCards(cards);


</script>

<template>
    <div :class="['deck-editor', props.mode]">

        <div v-if="props.mode === 'modal'" class="modal-container">
            <div class="modal-content">
                <h2>Editing in Modal</h2>
            </div>
        </div>

        <div v-else class="container">
            <div class="container-header">
                <div class="container-header-title">
                    <h2>Edit Deck: {{ localDeck?.name || "Loading..." }}</h2>
                </div>
                <div class="container-header-alerts">
                    <CircleCheckIcon v-if="!alert" class="validation-icon-success" />
                    <CircleXIcon v-else class="validation-icon-failure" @click="toggleModal('alert')" />
                </div>
                <div class="container-header-functions">
                    <button @click="toggleView">{{ isTableView ? "Card View" : "Table View" }}</button>
                    <!-- Card Search Input -->
                    <CardSearch @card="addCard" />
                    <!-- Editor Header Controls -->
                    <button @click="toggleModal({ type: 'import' })">Import Cards</button><!--Import Cards function -->
                    <button @click="saveDeck">Save Deck</button><!-- Save Deck Function -->
                    <button @click="$emit('close')">Close Editor</button><!-- Emit to Deckbuilder: Close -->
                </div>
            </div>

            <!-- Card Grid or Table View -->
            <CardGrid />
            <!--<CardTable />-->
        </div>

        <!-- Mass Import Modal -->
        <ModalPopup v-if="modalState.import" @close="modalState.import = false" @import="handleMassImport"
            :mode="'cardImport'" />
        <ModalPopup v-if="modalState.alert" @close="modalState.alert = false" mode="deckAlert" />
    </div>
</template>

<style scoped>
/* Modal styling */
.deck-editor.default {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid gray;
    border-radius: 15px;
    padding: 10px;
    margin-right: 10px;
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

.validation-icon-success {
    position: relative;
    left: 5px;
    color: green;
}

.validation-icon-failure {
    position: relative;
    left: 5px;
    color: red;
    cursor: pointer;
}
</style>
