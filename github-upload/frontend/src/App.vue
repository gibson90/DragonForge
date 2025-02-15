<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/Nav-Bar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>
/* Reset margins and paddings */
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
main {
  padding: 20px;
}
</style>
