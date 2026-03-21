<template>
  <div class="scores-view">
    <div class="scores-header">
      <h1>Live Scores</h1>
      <span class="refresh-info">Updates every 60s</span>
    </div>

    <SportTabs :sports="sports" :active="activeSport" @select="selectSport" />

    <div v-if="loading" class="state-msg">Loading scores...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <div v-else-if="games.length === 0" class="state-msg">No games today.</div>
    <div v-else class="scores-grid">
      <ScoreCard v-for="game in games" :key="game.id" :game="game" :sport="activeSport" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SportTabs from '../components/SportTabs.vue'
import ScoreCard from '../components/ScoreCard.vue'

const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY
const BASE_URL = 'https://api.balldontlie.io'

const sports = ['NBA', 'NFL', 'MLB', 'EPL']
const activeSport = ref('NBA')
const games = ref([])
const loading = ref(false)
const error = ref(null)
let timer = null

function today() {
  return new Date().toISOString().split('T')[0]
}

async function fetchGames() {
  loading.value = true
  error.value = null
  try {
    const sport = activeSport.value.toLowerCase()
    const dateParam = ['EPL', 'NHL'].includes(activeSport.value) ? `date=${today()}` : `dates[]=${today()}`
    const url = `${BASE_URL}/${sport}/v1/games?${dateParam}&per_page=30`
    const res = await fetch(url, {
      headers: { Authorization: API_KEY }
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    games.value = json.data ?? []
  } catch (e) {
    console.log('Error:', e.message)
    error.value = 'Could not load scores. Please try again.'
  } finally {
    loading.value = false
  }
}

function selectSport(sport) {
  activeSport.value = sport
}

watch(activeSport, fetchGames)

onMounted(() => {
  fetchGames()
  timer = setInterval(fetchGames, 60000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.scores-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.scores-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.scores-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.refresh-info {
  font-size: 0.8rem;
  color: #6b7280;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.state-msg {
  margin-top: 3rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}

.state-msg.error {
  color: #e63946;
}
</style>