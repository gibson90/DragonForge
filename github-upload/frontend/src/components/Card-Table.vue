<template>
    <!-- ✅ Table View -->
    <div v-if="isTableView">
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
</template>

<script>
export default {
    props: {
        localDeck: {
            type: Object,
            required: true,
        },
        isTableView: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        removeCard(cardId) {
            this.$emit('remove-card', cardId);
        },
    },
};

</script>

<style scoped></style>