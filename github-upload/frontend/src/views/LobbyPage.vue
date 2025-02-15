<!-- frontend/src/views/Home.vue -->
<template>
    <div class="home">
      <h1>Welcome to MTG Arena Clone</h1>
      <p>Your ultimate online Magic: The Gathering experience awaits!</p>
      <div class="actions">

      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home-Page',
  };
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    background-color: #f0f8ff;
    text-align: center;
  }
  
  .home h1 {
    font-size: 3em;
    margin-bottom: 20px;
  }
  
  .home p {
    font-size: 1.5em;
    color: #555;
  }
  
  .actions {
    margin-top: 30px;
  }
  
  .btn {
    padding: 12px 24px;
    margin: 0 10px;
    border: none;
    border-radius: 25px;
    text-decoration: none;
    color: white;
    font-size: 1em;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary {
    background-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-secondary {
    background-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  </style>
  