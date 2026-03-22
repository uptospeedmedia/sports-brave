<template>
  <div class="betting-view">
    <div class="betting-header">
      <h1>Betting Directory</h1>
      <p class="subtitle">Top rated sportsbooks — compare offers and claim bonuses</p>
    </div>

    <div class="filter-bar">
      <button
        v-for="region in regions"
        :key="region"
        :class="['filter-btn', { active: activeRegion === region }]"
        @click="activeRegion = region"
      >
        {{ region }}
      </button>
    </div>

    <div class="betting-grid">
      <BettingCard
        v-for="book in filteredBooks"
        :key="book.name"
        :book="book"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BettingCard from '../components/BettingCard.vue'
import { books, regions } from '../data/bettingData.js'

const activeRegion = ref('All')

const filteredBooks = computed(() => {
  if (activeRegion.value === 'All') return books
  return books.filter(b => b.region === activeRegion.value)
})
</script>

<style scoped>
.betting-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.betting-header {
  margin-bottom: 2rem;
}

.betting-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
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

.filter-btn:hover {
  border-color: #4a4d5a;
  color: #ffffff;
}

.filter-btn.active {
  background: #e63946;
  border-color: #e63946;
  color: #ffffff;
}

.betting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>