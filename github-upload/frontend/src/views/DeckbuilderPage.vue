<template>
    <div class="deck-builder">
        <Decklist @create-deck="openModal('newDeck')" />
        <DeckEditor v-if="deckStore.localDeck && deckStore.localDeck._id" :deckId="deckStore.localDeck" @close="closeDeckEditor" />
        <ModalPopup v-if="isModalOpen" :mode="modalMode" @close="closeModal" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
import { useDeckStore } from "@/store/modules/deck";
import { useCardStore } from "@/store/modules/card";
import Decklist from "@/components/Deck-List.vue";
import DeckEditor from "@/components/Deck-Editor.vue";
import ModalPopup from "@/components/Modal-Popup.vue";

const deckStore = useDeckStore();
const cardStore = useCardStore();
const isModalOpen = ref(false);
const modalMode = ref("default");
const toggleVar = computed(() => cardStore.toggleVar);

const openModal = (mode) => {
    console.log(`Opening modal: ${mode}`);
    modalMode.value = mode;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const closeDeckEditor = () => {
    deckStore.localDeck = null; // ✅ Clear the selected deck in the store
};

const handleLeftClick = () => {
    if (toggleVar.value) {
        cardStore.toggleVar = false; // Close the menu
    }
};

onMounted(() => {
    document.addEventListener("click", handleLeftClick);
});

// Cleanup the event listener when the component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener("click", handleLeftClick);
});
</script>

<style scoped>
.deck-builder {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>
