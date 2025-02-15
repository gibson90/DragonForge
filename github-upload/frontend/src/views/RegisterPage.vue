<template>
    <div class="register-container">
      <h2>Register</h2>
      
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required minlength="6" />
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required minlength="6" />
        </div>
  
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
  
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import axios from "axios";
  
  export default {
    setup() {
      const username = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const errorMessage = ref("");
      const successMessage = ref("");
  
      const register = async () => {
        errorMessage.value = "";
        successMessage.value = "";
  
        if (password.value !== confirmPassword.value) {
          errorMessage.value = "Passwords do not match!";
          return;
        }
  
        try {
          const response = await axios.post("http://localhost:4000/api/auth/register", {
            username: username.value,
            password: password.value,
          });
          console.log(response);
          successMessage.value = "Registration successful! You can now log in.";
          username.value = "";
          password.value = "";
          confirmPassword.value = "";
        } catch (error) {
          errorMessage.value = error.response?.data?.msg || "An error occurred during registration.";
        }
      };
  
      return {
        username,
        password,
        confirmPassword,
        errorMessage,
        successMessage,
        register,
      };
    },
  };
  </script>
  
  <style scoped>
  .register-container {
    width: 300px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #218838;
  }
  </style>
  