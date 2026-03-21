<template>
  <div class="streaming-view">
    <div class="streaming-header">
      <h1>Streaming Guide</h1>
      <p class="subtitle">Find where to watch sport in your country</p>
    </div>

    <div class="country-selector">
      <select v-model="selectedCountry">
        <option value="">Select your country...</option>
        <option v-for="(data, code) in streamingData" :key="code" :value="code">
          {{ data.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedCountry && currentServices.length" class="services-section">
      <div class="filter-bar">
        <button
          v-for="sport in availableSports"
          :key="sport"
          :class="['filter-btn', { active: activeSport === sport }]"
          @click="toggleSport(sport)"
        >
          {{ sport }}
        </button>
      </div>

      <div class="services-grid">
        <div
          v-for="service in filteredServices"
          :key="service.name"
          class="service-card"
        >
          <div class="service-top">
            <span class="service-name">{{ service.name }}</span>
            <a :href="service.url" target="_blank" rel="noopener" class="visit-btn">Visit →</a>
          </div>
          <div class="sports-tags">
            <span v-for="sport in service.sports" :key="sport" class="sport-tag">
              {{ sport }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedCountry" class="state-msg">
      No services found for this country yet.
    </div>

    <div v-else class="state-msg">
      Select a country above to see available streaming services.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import streamingData from '../data/streaming.json'

const selectedCountry = ref('US')
const activeSport = ref('')

const currentServices = computed(() => {
  if (!selectedCountry.value) return []
  return streamingData[selectedCountry.value]?.services ?? []
})

const availableSports = computed(() => {
  const all = currentServices.value.flatMap(s => s.sports)
  return ['All', ...new Set(all)].sort()
})

const filteredServices = computed(() => {
  if (!activeSport.value || activeSport.value === 'All') return currentServices.value
  return currentServices.value.filter(s => s.sports.includes(activeSport.value))
})

function toggleSport(sport) {
  activeSport.value = activeSport.value === sport ? '' : sport
}
</script>

<style scoped>
.streaming-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.streaming-header {
  margin-bottom: 2rem;
}

.streaming-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.country-selector select {
  width: 100%;
  max-width: 360px;
  padding: 0.75rem 1rem;
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
}

.country-selector select:focus {
  border-color: #e63946;
}

.services-section {
  margin-top: 2rem;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #2a2d3a;
  background: transparent;
  color: #a0a3b1;
  font-size: 0.82rem;
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.service-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.service-card:hover {
  border-color: #4a4d5a;
}

.service-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.visit-btn {
  font-size: 0.8rem;
  color: #e63946;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.visit-btn:hover {
  opacity: 0.8;
}

.sports-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.sport-tag {
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  background: #1e2130;
  border: 1px solid #2a2d3a;
  border-radius: 999px;
  color: #a0a3b1;
}

.state-msg {
  margin-top: 3rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}
</style>