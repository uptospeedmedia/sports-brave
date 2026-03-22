<template>
  <div class="home-view">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">Live • Scores • Streaming • Betting</div>
        <h1>Your ultimate<br><span class="accent">sports hub</span></h1>
        <p class="hero-sub">Live scores, streaming guides, and the best betting offers — all in one place.</p>
        <div class="hero-btns">
  <router-link to="/scores" class="btn-primary">Live Scores →</router-link>
  <router-link to="/streaming" class="btn-secondary">Live Streaming →</router-link>
  <router-link to="/betting" class="btn-secondary">Betting Directory →</router-link>
</div>
      </div>
    </section>

    <!-- Live scores strip -->
    <section class="section">
      <div class="section-header">
        <h2>Today's Games</h2>
        <router-link to="/scores" class="see-all">See all →</router-link>
      </div>
      <div v-if="loadingScores" class="state-msg">Loading scores...</div>
      <div v-else-if="featuredGames.length === 0" class="state-msg">No games today.</div>
      <div v-else class="scores-strip">
        <div v-for="game in featuredGames" :key="game.id" class="mini-score-card">
          <span class="mini-status" :class="getStatusClass(game.status)">{{ game.status || 'Scheduled' }}</span>
          <div class="mini-teams">
            <div class="mini-team">
              <span>{{ game.home_team?.abbreviation ?? 'HOME' }}</span>
              <span class="mini-score">{{ game.home_team_score ?? '-' }}</span>
            </div>
            <div class="mini-team">
              <span>{{ game.visitor_team?.abbreviation ?? 'AWAY' }}</span>
              <span class="mini-score">{{ game.visitor_team_score ?? '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick links -->
    <section class="section">
      <div class="section-header">
        <h2>Explore</h2>
      </div>
      <div class="quick-links">
        <router-link to="/scores" class="quick-card">
          <span class="quick-icon">⚽</span>
          <span class="quick-title">Live Scores</span>
          <span class="quick-sub">NBA, NFL, MLB, EPL</span>
        </router-link>
        <router-link to="/streaming" class="quick-card">
          <span class="quick-icon">📺</span>
          <span class="quick-title">Streaming Guide</span>
          <span class="quick-sub">Find where to watch</span>
        </router-link>
        <router-link to="/betting" class="quick-card">
          <span class="quick-icon">🎰</span>
          <span class="quick-title">Betting Directory</span>
          <span class="quick-sub">Best sportsbook offers</span>
        </router-link>
      </div>
    </section>

    <!-- Top betting offers strip -->
    <section class="section">
      <div class="section-header">
        <h2>Top Offers Today</h2>
        <router-link to="/betting" class="see-all">See all →</router-link>
      </div>
      <div class="offers-strip">
        
          <div
  v-for="book in topBooks"
  :key="book.name"
  class="offer-card"
  @click="openLink(book.url)"
>
  <span class="offer-name">{{ book.name }}</span>
  <span class="offer-text">{{ book.offer }}</span>
  <span class="offer-cta">Claim</span>
</div>
      </div>
      <p class="disclaimer">18+ only. Gamble responsibly. T&Cs apply.</p>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const PROXY_URL = import.meta.env.VITE_PROXY_URL

const featuredGames = ref([])
const loadingScores = ref(false)

function openLink(url) {
  window.open(url, '_blank', 'noopener')
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function getStatusClass(status) {
  if (!status) return 'scheduled'
  if (status === 'Final') return 'final'
  if (status.includes('Qtr') || status.includes('Half') || status.includes('Period') || status.includes('Inning')) return 'live'
  return 'scheduled'
}

async function fetchFeaturedGames() {
  loadingScores.value = true
  try {
    const res = await fetch(`${PROXY_URL}?target=balldontlie&path=/nba/v1/games&dates[]=${today()}&per_page=6`)
    
    const json = await res.json()
    featuredGames.value = (json.data ?? []).slice(0, 6)
  } catch (e) {
    featuredGames.value = []
  } finally {
    loadingScores.value = false
  }
}

const topBooks = [
  { name: 'FanDuel', offer: 'Bet $5, Get $150 in Bonus Bets', url: 'https://fanduel.com' },
  { name: 'DraftKings', offer: 'Bet $5, Get $200 in Bonus Bets', url: 'https://draftkings.com' },
  { name: 'BetMGM', offer: 'First Bet up to $1,500', url: 'https://betmgm.com' },
  { name: 'bet365', offer: 'Bet £10, Get £30 in Free Bets', url: 'https://bet365.com' },
]

onMounted(fetchFeaturedGames)
</script>

<style scoped>
.home-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.hero {
  padding: 4rem 0 3rem;
  border-bottom: 1px solid #2a2d3a;
  margin-bottom: 3rem;
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #e63946;
  background: #1a0a0c;
  border: 1px solid #3a1015;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  margin-bottom: 1.2rem;
}

.hero h1 {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.accent {
  color: #e63946;
}

.hero-sub {
  font-size: 1.1rem;
  color: #9ca3af;
  max-width: 500px;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #e63946;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 0.2s;
}

.btn-primary:hover { opacity: 0.88; }

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid #2a2d3a;
  transition: border-color 0.2s;
}

.btn-secondary:hover { border-color: #4a4d5a; }

.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
}

.see-all {
  font-size: 0.85rem;
  color: #e63946;
  text-decoration: none;
  font-weight: 500;
}

.see-all:hover { opacity: 0.8; }

.scores-strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.mini-score-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 10px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mini-status {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  width: fit-content;
}

.mini-status.live { background: #1a3a1a; color: #4ade80; }
.mini-status.final { background: #1a1a2e; color: #6b7280; }
.mini-status.scheduled { background: #1a2a3a; color: #60a5fa; }

.mini-teams {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mini-team {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #e5e7eb;
}

.mini-score {
  font-weight: 700;
  color: #ffffff;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: border-color 0.2s;
}

.quick-card:hover { border-color: #e63946; }

.quick-icon { font-size: 1.8rem; }

.quick-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.quick-sub {
  font-size: 0.82rem;
  color: #6b7280;
}

.offers-strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.offer-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: border-color 0.2s;
}

.offer-card:hover { border-color: #e63946; }

.offer-name {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.offer-text {
  font-size: 0.82rem;
  color: #9ca3af;
  line-height: 1.4;
}

.offer-cta {
  font-size: 0.82rem;
  color: #e63946;
  font-weight: 600;
  margin-top: 0.25rem;
}

.state-msg {
  color: #6b7280;
  font-size: 0.95rem;
}

.disclaimer {
  font-size: 0.68rem;
  color: #4a4d5a;
  margin-top: 0.75rem;
}
</style>