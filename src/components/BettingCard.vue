<template>
  <div class="betting-card">
    <div class="card-top">
      <div class="name-row">
        <span class="book-name">{{ book.name }}</span>
        <span v-if="book.badge" class="badge">{{ book.badge }}</span>
      </div>
      <div class="stars">
        <span v-for="n in 5" :key="n" :class="['star', { filled: n <= Math.round(book.rating) }]">★</span>
        <span class="rating-num">{{ book.rating }}</span>
      </div>
    </div>

    <div class="offer">{{ book.offer }}</div>
<div v-if="odds" class="odds-row">
  <span class="odds-label">Today's line</span>
  <span class="odds-values">
    <span class="odds-val">{{ formatOdds(odds.home) }}</span>
    <span class="odds-sep">/</span>
    <span class="odds-val">{{ formatOdds(odds.away) }}</span>
  </span>
</div>

    <div class="sports-tags">
      <span v-for="sport in book.sports" :key="sport" class="sport-tag">{{ sport }}</span>
    </div>

    <a :href="book.url" target="_blank" rel="noopener" class="cta-btn">
      Claim Offer →
    </a>

    <p class="disclaimer">18+ only. Gamble responsibly. T&Cs apply.</p>
  </div>
</template>

<script setup>
defineProps({ book: Object, odds: Object })

function formatOdds(val) {
  if (val === undefined || val === null) return '-'
  const n = Number(val)
  return n > 0 ? '+' + n : String(n)
}
</script>

<style scoped>
.betting-card {
  background: #13161e;
  border: 1px solid #2a2d3a;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.betting-card:hover {
  border-color: #4a4d5a;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.book-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
}

.badge {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  background: #e63946;
  color: #ffffff;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.stars {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.star {
  font-size: 0.9rem;
  color: #2a2d3a;
}

.star.filled {
  color: #f59e0b;
}

.rating-num {
  font-size: 0.8rem;
  color: #6b7280;
  margin-left: 0.3rem;
}

.offer {
  font-size: 0.9rem;
  color: #e5e7eb;
  font-weight: 500;
  background: #1e2130;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border-left: 3px solid #e63946;
}

.odds-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0d1017;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
}

.odds-label {
  font-size: 0.72rem;
  color: #6b7280;
}

.odds-values {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.odds-val {
  font-size: 0.85rem;
  font-weight: 700;
  color: #4ade80;
}

.odds-sep {
  font-size: 0.72rem;
  color: #4a4d5a;
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

.cta-btn {
  display: block;
  text-align: center;
  background: #e63946;
  color: #ffffff;
  text-decoration: none;
  padding: 0.7rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 0.2s;
  margin-top: 0.25rem;
}

.cta-btn:hover {
  opacity: 0.88;
}

.disclaimer {
  font-size: 0.68rem;
  color: #4a4d5a;
  text-align: center;
}
</style>