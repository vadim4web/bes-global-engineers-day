<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { getNextEngineerDay } from '../utils/engineerDayDateRules.js'

const props = defineProps({
  engineerDays: {
    type: Object,
    required: true
  }
})

const today = computed(() => dayjs())
const nextEngineerDay = computed(() =>
  getNextEngineerDay(props.engineerDays, today.value)
)

const relativeLead = computed(() => {
  const event = nextEngineerDay.value
  if (!event) {
    return 'the next reliable recurring date is still being reviewed'
  }

  if (event.isOngoing) {
    return 'right now'
  }

  if (event.daysUntilStart === 0) {
    return 'today'
  }

  if (event.daysUntilStart === 1) {
    return 'tomorrow'
  }

  if (event.daysUntilStart <= 6) {
    return `this ${event.occurrence.start.format('dddd')}`
  }

  return event.occurrence.start.format('dddd')
})

const primaryMessage = computed(() => {
  const event = nextEngineerDay.value
  if (!event) {
    return 'BES congratulates all engineers while the remaining variable-date entries wait for a human with a calendar and strong coffee.'
  }

  if (event.isOngoing) {
    return `Engineer’s Day is happening now in ${event.country}, running ${event.displayLabel}.`
  }

  return `The nearest Engineer’s Day is ${relativeLead.value}, ${event.displayLabel}, in ${event.country}.`
})

const supportingMessage = computed(() => {
  const event = nextEngineerDay.value
  if (!event) {
    return 'Happy Engineer’s Day to the people who keep reality, code, and conduit routing from having an argument.'
  }

  if (event.note) {
    return event.note
  }

  return 'Happy Engineer’s Day to the people who somehow make impossible look coordinated.'
})
</script>

<template>
  <article class="engineer-message">
    <p class="engineer-message__eyebrow">Engineer’s Day radar</p>
    <h2>BES congratulates all engineers!</h2>
    <p class="engineer-message__primary">
      {{ primaryMessage }}
    </p>
    <p class="engineer-message__secondary">
      {{ supportingMessage }}
    </p>
  </article>
</template>

<style scoped>
.engineer-message {
  display: grid;
  gap: 10px;
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(6, 16, 23, 0.88), rgba(8, 24, 28, 0.72));
  border: 1px solid rgba(119, 255, 231, 0.14);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
}

.engineer-message__eyebrow {
  margin: 0;
  color: var(--accent-bright);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.engineer-message h2,
.engineer-message__primary,
.engineer-message__secondary {
  margin: 0;
}

.engineer-message h2 {
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: 1.55rem;
}

.engineer-message__primary {
  color: #f1fffb;
  line-height: 1.55;
}

.engineer-message__secondary {
  color: rgba(231, 249, 245, 0.7);
  line-height: 1.6;
}
</style>
