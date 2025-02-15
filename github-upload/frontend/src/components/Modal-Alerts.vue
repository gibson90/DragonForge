<script setup>
import { useDeckStore } from "@/store/modules/deck";
import { computed, watch, defineProps } from "vue";

const deckStore = useDeckStore();

const props = defineProps({
    type: {
        type: String,
        default: "default",
    },
});

console.log("Modal-Alerts props:", props);

const alert = computed(() => deckStore.alert);

watch(
    () => deckStore.alert,
    (newAlert) => {
        console.log("Alert changed:", newAlert.title);
    }
);

</script>

<template>
    <div :class="['modal-alerts', type]">
        <div v-if="type === 'deck-validation' && alert != null" class="modal-container">
            <div class="modal-header">
                <span class="modal-title">{{alert.title}}:</span>
                <span class="modal-subject">{{alert.subject}}</span>
                <div class="modal-close">
                    <CircleXIcon @click="$emit('close')" />
                </div>
            </div>
            <div class="modal-content">
                <p v-if="deckStore.alert.message != null">deckStore.alert.message</p>
            </div>
        </div>
        <div v-else-if="type === 'card-validation'" class="modal-container">
            <div class="modal-header">
                <span class="modal-title">Card Validation</span>
                <button @click="$emit('close')">Close</button>
            </div>
            <div class="modal-content">
                <p>Card validation in progress...</p>
                <ul>
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </div>
        </div>
    </div>


</template>

<style scoped>
.modal-alerts.deck-validation {
    background-color: rgb(248, 215, 218, .5);
    color: #721c24;
    border-radius: 15px;
    border: 1px solid #f5c6cb;
    position: relative;
    top: -10px;
    left: 15%;
}

.modal-container {
    padding: 10px;
    border-radius: 15px;
}

.modal-header { 
    display: flex;
    align-items: center;
}

.modal-title {
    font-size: 1.2em;
    font-weight: bold;
}

.modal-subject {
    padding-top: 3px;
    margin-left: 5px;
}

.modal-close {
    margin-left: auto;
    cursor: pointer;
    color: rgb(114, 28, 36);
}

</style>