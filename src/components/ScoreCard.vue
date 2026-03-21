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
      <div class="team away">
        <span class="team-name">{{ awayTeam }}</span>
        <span class="team-score">{{ awayScore }}</span>
      </div>
    </div>
    <div class="card-footer">{{ gameTime }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ game: Object, sport: String })

const homeTeam = computed(() => props.game.home_team?.full_name ?? props.game.home_team?.name ?? 'Home')
const awayTeam = computed(() => props.game.visitor_team?.full_name ?? props.game.visitor_team?.name ?? 'Away')
const homeScore = computed(() => props.game.home_team_score ?? '-')
const awayScore = computed(() => props.game.visitor_team_score ?? '-')

const statusText = computed(() => {
  const s = props.game.status
  if (!s) return 'Scheduled'
  if (s === 'Final') return 'Final'
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

.score-card:hover {
  border-color: #4a4d5a;
}

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

.status.live {
  background: #1a3a1a;
  color: #4ade80;
}

.status.final {
  background: #1a1a2e;
  color: #6b7280;
}

.status.scheduled {
  background: #1a2a3a;
  color: #60a5fa;
}

.teams {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.team {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e5e7eb;
}

.team-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  min-width: 2rem;
  text-align: right;
}

.divider {
  font-size: 0.7rem;
  color: #4a4d5a;
  text-align: center;
}

.card-footer {
  font-size: 0.75rem;
  color: #6b7280;
  border-top: 1px solid #2a2d3a;
  padding-top: 0.5rem;
}
</style>