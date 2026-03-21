<template>
  <div class="sport-tabs">
    <button
      v-for="sport in sports"
      :key="sport"
      :class="['tab', { active: active === sport }]"
      @click="$emit('select', sport)"
    >
      {{ sport }}
    </button>
  </div>
</template>

<script setup>
defineProps({ sports: Array, active: String })
defineEmits(['select'])
</script>

<style scoped>
.sport-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid #2a2d3a;
  background: transparent;
  color: #a0a3b1;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  border-color: #4a4d5a;
  color: #ffffff;
}

.tab.active {
  background: #e63946;
  border-color: #e63946;
  color: #ffffff;
}
</style>