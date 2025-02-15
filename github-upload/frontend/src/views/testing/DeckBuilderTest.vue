<template>
    <div class="deck-builder">
        <Decklist @edit-deck="openDeckEditor" @create-deck="openModal('newDeck')" />
        <DeckEditor v-if="selectedDeck" :deck="selectedDeck" @close="closeDeckEditor" />
        <ModalPopup v-if="isModalOpen" :mode="modalMode" @close="closeModal" />
    </div>
</template>

<script>
import Decklist from '@/components/Deck-List.vue';
import DeckEditor from '@/components/Deck-Editor.vue';
import ModalPopup from '@/components/Modal-Popup.vue';

export default {
    name: 'DeckBuilder',
    components: {
        Decklist,
        DeckEditor,
        ModalPopup
    },
    data() {
        return {
            selectedDeck: null, // ✅ Track the currently edited deck
            isModalOpen: false, // ✅ Track if the modal is open
            modalMode: 'default', // ✅ Track the mode of the modal
        };
    },
    methods: {     
        openModal(mode) {
            console.log(`Opening modal: ${mode}`);
            this.modalMode = mode;
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        openDeckEditor(deck) {
            this.selectedDeck = deck; // ✅ Open the editor with the selected deck
        },
        closeDeckEditor() {
            this.selectedDeck = null; // ✅ Close the editor
        },
    },
};
</script>

<style scoped>
.deck-builder {
    display: flex;
    flex-direction: column;
}
</style>
