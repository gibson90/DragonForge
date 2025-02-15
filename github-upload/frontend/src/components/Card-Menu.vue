<!-- The Card Menu is a child of the Card Grid & Card Table
     The menu is only visible when the user clicks on the 3 dots
     Which will toggle the menu to show or hide via the menuVisible variable
        The menu will be positioned relative to the card item
        The menu will be hidden when the user clicks outside of the menu
        The menu will recieve the card data and menuVisible variable as props
-->
<script setup>
import { useCardStore } from '@/store/modules/card';
//import { EllipsisVertical } from "lucide-vue-next";
import { defineProps } from 'vue';

const cardStore = useCardStore();

const props = defineProps({
    index: Number,
    card: Object,
    x: Number,
    y: Number
});

const actionType = (action, payload) => {
    cardStore[action](payload);
    //toggleMenu();
};

// watch(() => cardStore.toggleVar, (newValue, oldValue) => {
//     console.log('Value changed from', oldValue, 'to', newValue);
// });


</script>

<template>
    <!-- Individual MENU for each card -->
    <div class="menu-count">
        <span>{{ card.quantity }}</span>
    </div>
    <div v-if="cardStore.toggleVar && index === cardStore.index" class="menu-container"
        :style="{ top: props.y + 'px', left: props.x + 'px' }">
        <ul class="menu-dropdown">
            <li class="menu-item card-name">{{ card.name }}</li>
            <hr class="menu-divider" />

            <!-- Section 1 -->
            <li class="menu-item" @click="actionType('adjustQuantity', { type: 'increase', amount: 1 })">
                <span class="icon">
                    <FilePlus2 />
                </span>
                <span>Increase quantity</span>
            </li>
            <li class="menu-item" @click="actionType('adjustQuantity', { type: 'decrease', amount: 1 })">
                <span class="icon">
                    <FileMinus2 />
                </span>
                <span>Decrease quantity</span>
            </li>
            <li class="menu-item" @click="actionType('addNewCard', { card: card })">
                <span class="icon">
                    <PlusIcon />
                </span>
                <span>Add as new card</span>
            </li>
            <hr class="menu-divider" />

            <!-- Section 2 -->
            <li class="menu-item" @click="cardStore.switchCardPrinting">
                <span class="icon">
                    <GridIcon />
                </span>
                <span>Switch card printing</span>
            </li>
            <li class="menu-item" @click="cardStore.switchToFoil">
                <span class="icon">
                    <SparklesIcon />
                </span>
                <span>Switch to foil</span>
            </li>
            <li class="menu-item" @click="actionType('promoteCommandZone', {card: card, index: index})">
                <span class="icon">
                    <CrownIcon />
                </span>
                <span>Set as commander</span>
            </li>
            <hr class="menu-divider" />

            <!-- Section 3 -->
            <li class="menu-item" @click="actionType('removeCard', {card: card})">
                <span class="icon">
                    <TrashIcon />
                </span>
                <span>Remove card</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.menu-container.menu-icon {
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50% !important;
    background: #fff;
}

.menu-container {
    position: fixed;
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

.menu-count {
    position: absolute;
    top: 0px;
    left: 20px;
    width: 38px;
    height: 38px;
    background-color: red;
    border-radius: 11px 0 0 0 !important;
    clip-path: polygon(0 0, 0 100%, 100% 0);
}

.menu-count span {
    position: absolute;
    top: 33%;
    left: 30%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 16px;
    font-weight: bold;
}

/* Card Styling */
.card-name {
    font-weight: bold;
    align-items: flex-end;
}
</style>