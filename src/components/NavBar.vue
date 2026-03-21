<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/">sports.brave</router-link>
    </div>
    <div class="nav-links">
      <router-link to="/scores">Scores</router-link>
      <router-link to="/streaming">Streaming</router-link>
      <router-link to="/betting">Betting</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #13161e;
  border-bottom: 1px solid #2a2d3a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
}

.nav-brand a {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e63946;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #a0a3b1;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #ffffff;
}
</style>
```

Save all files with **Ctrl+S**. Then let's test it locally — in your terminal run:
```
npm run dev