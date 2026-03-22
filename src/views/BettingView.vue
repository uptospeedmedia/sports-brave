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
  :odds="getOddsForBook(book.name)"
/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BettingCard from '../components/BettingCard.vue'
import { books, regions } from '../data/bettingData.js'

const PROXY_URL = import.meta.env.VITE_PROXY_URL

const activeRegion = ref('All')
const oddsData = ref({})
const loadingOdds = ref(false)

const filteredBooks = computed(() => {
  if (activeRegion.value === 'All') return books
  return books.filter(b => b.region === activeRegion.value)
})

async function fetchOdds() {
  loadingOdds.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await fetch(
      `${PROXY_URL}?target=sharpapi&path=/events&league=nba,nfl,mlb,epl&date=${today}&limit=20`
    )
    if (!res.ok) throw new Error(`Proxy error: ${res.status}`)
    const json = await res.json()
    const events = (json.data ?? []).filter(e =>
      e.away_team &&
      e.status === 'upcoming' &&
      e.books?.some(b => !['kalshi', 'polymarket'].includes(b))
    )
    console.log('Filtered events:', events.map(e => `${e.home_team} vs ${e.away_team} — books: ${e.books?.join(', ')}`))

    if (events.length === 0) {
      console.log('No events with real sportsbooks found today')
      return
    }

    const bookOdds = {}
    for (const event of events.slice(0, 3)) {
      const oddsRes = await fetch(
        `${PROXY_URL}?target=sharpapi&path=/events/${event.id}/odds&limit=200`
      )
      if (!oddsRes.ok) continue
      const oddsJson = await oddsRes.json()
      const oddsList = oddsJson.data ?? []
      const marketTypes = [...new Set(oddsList.map(o => o.market_type))]
      console.log(`${event.home_team} vs ${event.away_team} — markets:`, marketTypes)

      for (const odd of oddsList) {
        if (!['moneyline', 'h2h', 'match_winner', 'moneyline_reg_time'].includes(odd.market_type)) continue
        if (['kalshi', 'polymarket'].includes(odd.sportsbook)) continue
        const book = odd.sportsbook?.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (!book) continue
        if (!bookOdds[book]) bookOdds[book] = { event: `${event.home_team} vs ${event.away_team}` }
        const st = odd.selection_type?.toLowerCase()
if (['home', 'team1', '1', 'home_team'].includes(st)) bookOdds[book].home = odd.odds_american
if (['away', 'team2', '2', 'away_team', 'draw'].includes(st)) bookOdds[book].away = odd.odds_american
      }
    }

    oddsData.value = bookOdds
    console.log('Final odds:', JSON.stringify(bookOdds).slice(0, 500))
  } catch (e) {
    console.log('Odds error:', e.message)
  } finally {
    loadingOdds.value = false
  }
}

function getOddsForBook(bookName) {
  const keyMap = {
    'fanduel': 'fanduel',
    'draftkings': 'draftkings',
    'betmgm': 'betmgm',
    'caesarssportsbook': 'caesars',
    'espnbet': 'espnbet',
    'pointsbet': 'pointsbet',
    'pointsbetau': 'pointsbet',
    'bet365': 'bet365',
    'bet365canada': 'bet365',
    'skybet': 'skybet',
    'williamhill': 'williamhill',
    'betway': 'betway',
    'betwaycanada': 'betway',
    'pinnacle': 'pinnacle',
    'bookmaker': 'bookmaker',
    'bookmakereu': 'bookmaker',
    'unibet': 'unibet',
    'unibetuk': 'unibet',
    'betsson': 'betsson',
    'hardrockbet': 'hardrock',
    'fanatics': 'fanatics',
    'bwin': 'bwin',
    'paddypower': 'paddypower',
    'coral': 'coral',
    'ladbrokes': 'ladbrokes',
    'betfair': 'betfair',
    'betfredk': 'betfred',
    'sportsbet': 'sportsbet',
    'tab': 'tab',
    'neds': 'neds',
    'sportsbetio': 'sportsbetio',
    'betano': 'betano',
    'boylesports': 'boylesports',
    'betonline': 'betonline',
    'betonlineag': 'betonline',
  }
  const key = bookName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const mapped = keyMap[key] ?? key
  return oddsData.value[mapped] ?? null
}

onMounted(fetchOdds)
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