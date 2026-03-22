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
      <ScoreCard v-for="game in games" :key="game.id" :game="game" :sport="activeSport" :oddsMap="oddsMap" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SportTabs from '../components/SportTabs.vue'
import ScoreCard from '../components/ScoreCard.vue'

const PROXY_URL = import.meta.env.VITE_PROXY_URL

const sports = ['NBA', 'MLB', 'EPL']
const activeSport = ref('NBA')
const games = ref([])
const loading = ref(false)
const error = ref(null)
let timer = null

const oddsMap = ref({})

async function fetchAllOdds(sport) {
  if (!import.meta.env.VITE_PROXY_URL) return
  try {
    const sportKeyMap = {
      'NBA': 'basketball_nba',
      'MLB': 'baseball_mlb',
      'EPL': 'soccer_epl'
    }
    const sportKey = sportKeyMap[sport]
    if (!sportKey) return

    const res = await fetch(
      `${import.meta.env.VITE_PROXY_URL}?target=oddsapi&path=/sports/${sportKey}/odds&regions=us,uk&markets=h2h,spreads,totals&oddsFormat=american&bookmakers=betonline,bovada,betway,draftkings,fanduel,betmgm,bet365,williamhill,unibet`
    )
    if (!res.ok) return
    const json = await res.json()
    const events = json ?? []

    const map = {}
    for (const event of events) {
      const homeKey = (event.home_team ?? '').toLowerCase().replace(/[^a-z]/g, '')
      const awayKey = (event.away_team ?? '').toLowerCase().replace(/[^a-z]/g, '')
      const key = `${homeKey}_${awayKey}`

      const byBook = {}
      for (const bookmaker of (event.bookmakers ?? [])) {
        const book = bookmaker.key
        if (!byBook[book]) byBook[book] = {}
        for (const market of (bookmaker.markets ?? [])) {
          if (market.key === 'h2h') {
            byBook[book].moneyline = {
              home: market.outcomes.find(o => o.name === event.home_team)?.price,
              away: market.outcomes.find(o => o.name === event.away_team)?.price
            }
          }
          if (market.key === 'spreads') {
            byBook[book].spread = {
              home: market.outcomes.find(o => o.name === event.home_team)?.point,
              away: market.outcomes.find(o => o.name === event.away_team)?.point
            }
          }
          if (market.key === 'totals') {
            byBook[book].total = market.outcomes.find(o => o.name === 'Over')?.point
          }
        }
      }
      map[key] = byBook
    }
    oddsMap.value = map
  } catch (e) {
    console.log('Odds fetch error:', e.message)
  }
}

function parseOddsList(oddsList, event) {
  const byBook = {}
  for (const odd of oddsList) {
    if (['kalshi', 'polymarket'].includes(odd.sportsbook)) continue
    const book = odd.sportsbook
    if (!byBook[book]) byBook[book] = {}
    if (['moneyline', 'moneyline_reg_time', 'h2h'].includes(odd.market_type)) {
      if (!byBook[book].moneyline) byBook[book].moneyline = {}
      const st = odd.selection_type?.toLowerCase()
      if (['home', 'team1', '1'].includes(st)) byBook[book].moneyline.home = odd.odds_american
      if (['away', 'team2', '2'].includes(st)) byBook[book].moneyline.away = odd.odds_american
    }
    if (['point_spread', 'spread', 'handicap'].includes(odd.market_type)) {
      if (!byBook[book].spread) byBook[book].spread = {}
      const st = odd.selection_type?.toLowerCase()
      if (['home', 'team1', '1'].includes(st)) byBook[book].spread.home = odd.line
      if (['away', 'team2', '2'].includes(st)) byBook[book].spread.away = odd.line
    }
    if (['total_points', 'totals', 'over_under'].includes(odd.market_type)) {
      if (odd.selection_type?.toLowerCase() === 'over') byBook[book].total = odd.line
    }
  }
  return byBook
}

function today() {
  return new Date().toISOString().split('T')[0]
}

async function fetchGames() {
  loading.value = true
  error.value = null
  try {
    const sport = activeSport.value.toLowerCase()
    const dateParam = ['EPL', 'NHL'].includes(activeSport.value) ? `date=${today()}` : `dates[]=${today()}`
    const url = `${PROXY_URL}?target=balldontlie&path=/${sport}/v1/games&${dateParam}&per_page=30`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    games.value = json.data ?? []
    fetchAllOdds(activeSport.value)
if (games.value.length > 0) console.log('Sample game:', JSON.stringify(games.value[0]))
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

watch(activeSport, () => {
  oddsMap.value = {}
  fetchGames()
})

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