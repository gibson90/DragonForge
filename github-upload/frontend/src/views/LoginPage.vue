<!-- frontend/src/views/Login.vue -->
<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const error = ref('');

//const authStatus = computed(() => authStore.authStatus);
const isAuthenticated = computed(() => authStore.isAuthenticated());

const handleLogin = async () => {
  error.value = "";
  try {
    console.log("🔹 Attempting to log in...", isAuthenticated.value);

    const response = await authStore.loginUser({
      username: username.value,
      password: password.value,
    });

    console.log(response);

    if (response) {
      router.push({ name: "Dashboard" });
    } else {
      console.log("❌ Login failed, no response received.");
    }
  } catch (err) {
    console.error("❌ Login error:", err.response?.data?.msg || err);
    error.value = err.response?.data?.msg || "An error occurred during login.";
  }
};

watch(isAuthenticated.value, (value) => {
  console.log("🔄 Auth state changed. isAuthenticated:", value);
  if (value) {
    router.push({ name: "Dashboard" });
  }
});
</script>


<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            required
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p class="mt-3">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  <!--
  <script>
  import { mapActions, mapGetters } from "vuex";
  import { useAuthStore } from '@/store/modules/auth';
  
  export default {
    name: "Login-Page",
    data() {
      return {
        username: "",
        password: "",
        error: "",
      };
    },
    computed: {
      ...mapGetters("auth", ["authStatus", "isAuthenticated"]),
    },
    methods: {
      ...mapActions("auth", ["loginUser"]),
      async handleLogin() {
        this.error = "";
        try {
          console.log("🔹 Attempting to log in...");
  
          // ✅ Login and receive tokens
          const response = await this.loginUser({
            username: this.username,
            password: this.password,
          });
  
          if (response) {
            console.log("✅ Login successful. Redirecting...");
            this.$router.push({ name: "Dashboard" });
          } else {
            console.log("❌ Login failed, no response received.");
          }
        } catch (err) {
          console.error("❌ Login error:", err.response?.data?.msg || err);
          this.error = err.response?.data?.msg || "An error occurred during login.";
        }
      },
    },
    watch: {
      isAuthenticated(value) {
        console.log("🔄 Auth state changed. isAuthenticated:", value);
        if (value) {
          this.$router.push({ name: "Dashboard" });
        }
      },
    },
  };
  </script>
  -->
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: #333;
  }
  
  input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    font-size: 1em;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .mt-3 {
    margin-top: 1rem;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  