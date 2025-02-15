<script setup>
import CardMenu from "@/components/Card-Menu.vue";
import { useDeckStore } from "@/store/modules/deck";
import { useCardStore } from "@/store/modules/card";
import { computed, onMounted, ref } from "vue";


const deckStore = useDeckStore();
const cardStore = useCardStore();

// Computed property to get the current deck's cards
const cards = computed(() => deckStore.localDeck?.cards || []);
const toggle = computed(() => cardStore.toggleVar);
const menuPosition = ref({ x: 0, y: 0 });

// When right clicking, showcase the menu
function toggleMenu(card, event) {
    // Flips the toggleVar around and gets  the index
    cardStore.toggleMenu(card, event);
    // Setup Position values
    let posX = event.clientX;
    let posY = event.clientY;
    // if the toggle is true, set the menu position to the event's clientX and clientY
    if (toggle.value) {
        if (posY + 586 > window.innerHeight) {
            posY = window.innerHeight - 596 ;
            menuPosition.value = { x: posX, y: posY };
        }
        menuPosition.value = { x: posX, y: posY };

    } else {
        menuPosition.value = { x: 0, y: 0 };
    }
}

function toggleFace(card) {
    if (card.cardFaces?.length > 0) {
        card.imageUrl = card.imageUrl === card.cardFaces[0].image_uris?.normal ? card.cardFaces[1].image_uris?.normal : card.cardFaces[0].image_uris?.normal;
    }
}

onMounted(() => {
    //console.log("Card Grid mounted", cards.value);
});

</script>

<template>
    <div class="card-grid">
        <div v-for="(card, index) in cards" :key="index" class="card-item" :data-card-id="card._id || card.id"
            @contextmenu.prevent="toggleMenu(card, $event)">
            <img :src="card.imageUrl">
            <span v-if="card.cardFaces?.length > 0" class="menu-icon" @click="toggleFace(card)"
                @mouseover="showIcon = true" @mouseleave="showIcon = false">
                <i class="icon">
                    <RefreshIcon />
                </i>
            </span>
            <CardMenu :card="card" :index="index" :x="menuPosition.x" :y="menuPosition.y" />
        </div>
    </div>
</template>


<style scoped>
.card-grid {
    display: flex;
    flex-wrap: wrap;
}

.card-grid img {
    max-height: 360px;
    margin-left: 20px;
    border-radius: 15px;
}

.card-grid .error img {
    border: 1px solid red;
}

.card-item {
    position: relative;
}

.menu-icon {
    position: absolute;
    top: 45px;
    right: 25px;
    background: #ffffffa8;
    border-radius: 60%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 32px;
    height: 32px;
}

.icon {
    width: 24px;
    height: 24px;
    position: relative;
    top: 4px;
    left: 4px;
}
</style>