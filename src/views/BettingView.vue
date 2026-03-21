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

const activeRegion = ref('All')

const regions = ['All', 'US', 'UK', 'Global']

const books = [
  {
    name: 'FanDuel',
    region: 'US',
    rating: 4.8,
    offer: 'Bet $5, Get $150 in Bonus Bets',
    sports: ['NFL', 'NBA', 'MLB', 'NHL', 'MMA'],
    url: 'https://fanduel.com',
    badge: 'Most Popular'
  },
  {
    name: 'DraftKings',
    region: 'US',
    rating: 4.7,
    offer: 'Bet $5, Get $200 in Bonus Bets',
    sports: ['NFL', 'NBA', 'MLB', 'NHL', 'Golf'],
    url: 'https://draftkings.com',
    badge: ''
  },
  {
    name: 'BetMGM',
    region: 'US',
    rating: 4.6,
    offer: 'First Bet Offer up to $1,500',
    sports: ['NFL', 'NBA', 'MLB', 'NHL', 'Boxing'],
    url: 'https://betmgm.com',
    badge: ''
  },
  {
    name: 'Caesars Sportsbook',
    region: 'US',
    rating: 4.5,
    offer: 'First Bet on Caesars up to $1,000',
    sports: ['NFL', 'NBA', 'MLB', 'NHL', 'F1'],
    url: 'https://caesars.com/sportsbook',
    badge: ''
  },
  {
    name: 'ESPN Bet',
    region: 'US',
    rating: 4.4,
    offer: 'Earn up to $1,000 in Bonus Bets',
    sports: ['NFL', 'NBA', 'MLB', 'NHL', 'MMA'],
    url: 'https://espnbet.com',
    badge: ''
  },
  {
    name: 'bet365',
    region: 'UK',
    rating: 4.8,
    offer: 'Bet £10, Get £30 in Free Bets',
    sports: ['EPL', 'Champions League', 'F1', 'Tennis', 'Boxing'],
    url: 'https://bet365.com',
    badge: 'Most Popular'
  },
  {
    name: 'Sky Bet',
    region: 'UK',
    rating: 4.5,
    offer: 'New Customer Offer — Bet £10 Get £40',
    sports: ['EPL', 'Horse Racing', 'Tennis', 'Golf'],
    url: 'https://skybet.com',
    badge: ''
  },
  {
    name: 'William Hill',
    region: 'UK',
    rating: 4.4,
    offer: 'Bet £10 Get £30 in Free Bets',
    sports: ['EPL', 'Horse Racing', 'Boxing', 'Rugby'],
    url: 'https://williamhill.com',
    badge: ''
  },
  {
    name: 'Betway',
    region: 'UK',
    rating: 4.3,
    offer: 'Up to £30 in Free Bets',
    sports: ['EPL', 'Tennis', 'Cricket', 'Basketball'],
    url: 'https://betway.com',
    badge: ''
  },
  {
    name: 'DAZN Bet',
    region: 'Global',
    rating: 4.3,
    offer: 'Welcome Bonus up to €100',
    sports: ['Boxing', 'MMA', 'Football', 'Basketball'],
    url: 'https://daznbet.com',
    badge: ''
  },
  {
    name: 'Pinnacle',
    region: 'Global',
    rating: 4.6,
    offer: 'Best Odds — No Bonus, Just Value',
    sports: ['NFL', 'EPL', 'NBA', 'Tennis', 'Esports'],
    url: 'https://pinnacle.com',
    badge: 'Best Odds'
  },
  {
    name: '1xBet',
    region: 'Global',
    rating: 4.1,
    offer: '100% Welcome Bonus up to €100',
    sports: ['Football', 'Basketball', 'Tennis', 'Esports'],
    url: 'https://1xbet.com',
    badge: ''
  }
]

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