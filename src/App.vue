<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #0f1117;
  color: #ffffff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

#app {
  min-height: 100vh;
}

main {
  padding-top: 64px;
}
</style>
