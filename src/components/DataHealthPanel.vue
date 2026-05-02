<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const labels = [
  { key: 'totalRows', label: 'total rows' },
  { key: 'automaticallyParsedRows', label: 'automatically parsed rows' },
  { key: 'manualReviewRows', label: 'rows needing manual review' },
  {
    key: 'unsupportedMovableOrCalendarRows',
    label: 'unsupported movable/calendar-based rows'
  },
  { key: 'excludedOneTimeEvents', label: 'excluded one-time events' }
]
</script>

<template>
  <section class="health-panel" aria-label="Data health">
    <article
      v-for="item in labels"
      :key="item.key"
      class="health-card"
    >
      <span class="health-card__value">{{ stats[item.key] }}</span>
      <span class="health-card__label">{{ item.label }}</span>
    </article>
  </section>
</template>

<style scoped>
.health-panel {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.health-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(158, 255, 238, 0.08);
  display: grid;
  gap: 8px;
}

.health-card__value {
  color: var(--accent-bright);
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: 1.9rem;
}

.health-card__label {
  color: var(--text-dim);
  line-height: 1.5;
}

@media (max-width: 1080px) {
  .health-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .health-panel {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .health-panel {
    grid-template-columns: 1fr;
  }
}
</style>
