<template>
  <div class="score-card">
    <div class="card-header">
      <span class="sport-badge">{{ sport }}</span>
      <span class="status" :class="statusClass">{{ statusText }}</span>
    </div>
    <div class="teams">
      <div class="team">
        <span class="team-name">{{ homeTeam }}</span>
        <span class="team-score">{{ homeScore }}</span>
      </div>
      <div class="divider">vs</div>
      <div class="team">
        <span class="team-name">{{ awayTeam }}</span>
        <span class="team-score">{{ awayScore }}</span>
      </div>
    </div>
    <div class="card-footer">{{ gameTime }}</div>

    <div v-if="gameOdds.length" class="odds-section">
      <div class="odds-header">Place Your Bets</div>
      <div v-for="odd in gameOdds" :key="odd.book" class="odds-row">
        <a :href="odd.affiliateUrl" target="_blank" rel="noopener" class="odds-book">
          {{ odd.bookName }}
        </a>
        <div class="odds-markets">
          <span v-if="odd.moneyline" class="odds-pill">
            {{ formatOdds(odd.moneyline.home) }} / {{ formatOdds(odd.moneyline.away) }}
          </span>
          <span v-if="odd.spread" class="odds-pill spread">
            {{ formatSpread(odd.spread.home) }} / {{ formatSpread(odd.spread.away) }}
          </span>
          <span v-if="odd.total" class="odds-pill total">
            O/U {{ odd.total }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { books } from '../data/bettingData.js'

const props = defineProps({ game: Object, sport: String, oddsMap: Object })

const homeTeam = computed(() =>
  props.game.home_team?.full_name ??
  props.game.home_team?.display_name ??
  props.game.home_team?.name ??
  props.game.home_team_name ??
  'Home'
)
const awayTeam = computed(() =>
  props.game.visitor_team?.full_name ??
  props.game.away_team?.display_name ??
  props.game.away_team?.name ??
  props.game.away_team_name ??
  'Away'
)
const homeScore = computed(() =>
  props.game.home_team_score ??
  props.game.home_team_data?.runs ??
  '-'
)
const awayScore = computed(() =>
  props.game.visitor_team_score ??
  props.game.away_team_data?.runs ??
  '-'
)

const statusText = computed(() => {
  const s = props.game.status
  if (!s) return 'Scheduled'
  if (s === 'Final' || s === 'STATUS_FINAL') return 'Final'
  if (s === 'STATUS_IN_PROGRESS') return 'Live'
  if (s.includes('Qtr') || s.includes('Half') || s.includes('OT') || s.includes('Period') || s.includes('Inning')) return s
  return 'Scheduled'
})

const statusClass = computed(() => {
  const s = statusText.value
  if (s === 'Final') return 'final'
  if (s === 'Scheduled') return 'scheduled'
  return 'live'
})

const gameTime = computed(() => {
  if (!props.game.date && !props.game.datetime) return ''
  const d = new Date(props.game.datetime ?? props.game.date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

function formatOdds(val) {
  if (val === undefined || val === null) return '-'
  const n = Number(val)
  return n > 0 ? '+' + n : String(n)
}

function formatSpread(val) {
  if (val === undefined || val === null) return '-'
  const n = Number(val)
  return n > 0 ? '+' + n : String(n)
}

function getAffiliateUrl(bookKey) {
  const key = bookKey.toLowerCase().replace(/[^a-z0-9]/g, '')
  const keyMap = {
    'betonline': 'BetOnline', 'betonlineag': 'BetOnline',
    'bovada': 'Bovada', 'betway': 'Betway',
    'draftkings': 'DraftKings', 'fanduel': 'FanDuel',
    'betmgm': 'BetMGM', 'caesars': 'Caesars Sportsbook',
    'pinnacle': 'Pinnacle', 'bet365': 'bet365',
    'williamhill': 'William Hill', 'unibet': 'Unibet',
    'skybet': 'Sky Bet', 'betsson': 'Betsson', 'bwin': 'bwin',
  }
  const bookName = keyMap[key]
  if (!bookName) return null
  const match = books.find(b => b.name === bookName)
  return match ? { affiliateUrl: match.affiliateUrl, bookName: match.name } : null
}

const gameOdds = computed(() => {
  if (!props.oddsMap) return []
  const home = (
    props.game.home_team?.abbreviation ??
    props.game.home_team?.name ??
    props.game.home_team_name ?? ''
  ).toLowerCase().replace(/[^a-z]/g, '')

  const away = (
    props.game.visitor_team?.abbreviation ??
    props.game.away_team?.name ??
    props.game.away_team_name ?? ''
  ).toLowerCase().replace(/[^a-z]/g, '')

  const matchedKey = Object.keys(props.oddsMap).find(k => {
    const kClean = k.replace(/[^a-z]/g, '')
    return kClean.includes(home) || kClean.includes(away)
  })

  if (!matchedKey) return []
  const byBook = props.oddsMap[matchedKey]

  const result = []
  for (const [bookKey, markets] of Object.entries(byBook)) {
    if (!markets.moneyline && !markets.spread && !markets.total) continue
    const info = getAffiliateUrl(bookKey)
    if (!info) continue
    result.push({
      book: bookKey,
      bookName: info.bookName,
      affiliateUrl: info.affiliateUrl,
      moneyline: markets.moneyline,
      spread: markets.spread,
      total: markets.total
    })
  }
  return result.slice(0, 3)
})
</script>

<style scoped>
.score-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.score-card:hover { border-color: #4a4d5a; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sport-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status.live { background: #1a3a1a; color: #4ade80; }
.status.final { background: #1a1a2e; color: #6b7280; }
.status.scheduled { background: #1a2a3a; color: #60a5fa; }

.teams { display: flex; flex-direction: column; gap: 0.4rem; }

.team {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-name { font-size: 0.95rem; font-weight: 500; color: #e5e7eb; }
.team-score { font-size: 1.2rem; font-weight: 700; color: #ffffff; min-width: 2rem; text-align: right; }
.divider { font-size: 0.7rem; color: #4a4d5a; text-align: center; }

.card-footer {
  font-size: 0.75rem;
  color: #6b7280;
  border-top: 1px solid #2a2d3a;
  padding-top: 0.5rem;
}

.odds-section {
  border-top: 1px solid #2a2d3a;
  padding-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.odds-header {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #4a4d5a;
  text-transform: uppercase;
}

.odds-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.odds-book {
  font-size: 0.78rem;
  font-weight: 600;
  color: #e63946;
  text-decoration: none;
  min-width: 80px;
  flex-shrink: 0;
}

.odds-book:hover { opacity: 0.8; }

.odds-markets {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.odds-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #1e2130;
  color: #e5e7eb;
  white-space: nowrap;
}

.odds-pill.spread { background: #1a2a1a; color: #4ade80; }
.odds-pill.total { background: #1a1a2e; color: #60a5fa; }
</style>