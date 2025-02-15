<template>
    <nav class="navbar">
        <div class="nav-container">
            <router-link to="/dashboard" class="logo">MTG Online</router-link>

            <ul class="nav-links">
                <template v-if="isLoggedIn">
                    <div v-if="currentRouteName != 'Dashboard'">
                        <div v-if="currentRouteName == 'Deckbuilder'">
                            <li><router-link to="/dashboard">Home</router-link></li>
                            <li><router-link to="/lobby">Play</router-link></li>
                        </div>
                        <div v-if="currentRouteName == 'lobby' || currentRouteName == 'lobby/:sessionId'">
                            <li><router-link to="/deckbuilder">Deckbuilder</router-link></li>
                            <li><router-link to="/dashboard">Home</router-link></li>
                        </div>
                    </div>
                    <div v-else>
                        <li><router-link to="/deckbuilder">Deckbuilder</router-link></li>
                        <li><router-link to="/lobby">Play</router-link></li>
                    </div>
                    <li><a href="#" @click="logout">Logout</a></li>
                </template>

                <template v-else>
                    <li><router-link to="/login">Login</router-link></li>
                    <li><router-link to="/register">Register</router-link></li>
                </template>
            </ul>
        </div>
    </nav>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/modules/auth";

export default {
    computed: {
        currentRouteName() {
            console.log("Current Route: ",this.$route.name);
            return this.$route.name;
        }
    },
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        // Use Pinia state
        const isLoggedIn = computed(() => authStore.isAuthenticated());
        const user = computed(() => authStore.getUser);

        const logout = () => {
            authStore.logout(); // Clear Pinia state & localStorage
            router.push("/login");
        };

        return { isLoggedIn, user, logout };
    },
};
</script>

<style scoped>
.navbar {
    background-color: #34495e;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-brand .navbar-item {
    color: #ecf0f1;
    font-size: 1.5em;
    text-decoration: none;
}

.navbar-menu .navbar-item {
    color: #ecf0f1;
    margin-left: 15px;
    text-decoration: none;
}

.navbar-menu .navbar-item.router-link-active {
    font-weight: bold;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.logo {
    color: white;
    font-size: 1.5rem;
    text-decoration: none;
}

.nav-links {
    list-style: none;
    display: flex;
}

.nav-links li {
    display: inline;
}

.nav-links li {
    margin-left: 20px;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
}

.nav-links a:hover {
    text-decoration: underline;
}
</style>