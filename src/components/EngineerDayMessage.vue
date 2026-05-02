<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { getNextEngineerDay } from '../utils/engineerDayDateRules.js'

const props = defineProps({
  engineerDays: {
    type: Object,
    required: true
  },
  time: {
    type: [Date, String, Number, Object],
    default: () => new Date()
  },
  variant: {
    type: String,
    default: 'default'
  }
})

const today = computed(() => dayjs(props.time))
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
    return `Engineer's Day is happening now in ${event.country}, running ${event.displayLabel}.`
  }

  return `The nearest Engineer's Day is ${relativeLead.value}, ${event.displayLabel}, in ${event.country}.`
})

const supportingMessage = computed(() => {
  const event = nextEngineerDay.value
  if (!event) {
    return "Happy Engineer's Day to the people who keep reality, code, and conduit routing from having an argument."
  }

  if (event.note) {
    return event.note
  }

  return "Happy Engineer's Day to the people who somehow make impossible look coordinated."
})
</script>

<template>
  <article :class="['engineer-message', `engineer-message--${props.variant}`]">
    <p class="engineer-message__eyebrow">Engineer's Day radar</p>
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
  font-family: var(--font-round);
  font-weight: 700;
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

.engineer-message--banner {
  gap: 8px;
  padding: 18px 22px;
  background: linear-gradient(150deg, rgba(5, 16, 22, 0.92), rgba(8, 24, 28, 0.68));
}

.engineer-message--banner h2 {
  font-size: clamp(1.1rem, 1.6vw, 1.5rem);
}

.engineer-message--banner .engineer-message__primary,
.engineer-message--banner .engineer-message__secondary {
  font-size: 0.96rem;
}

.engineer-message--widescreen {
  gap: clamp(14px, 2.6vh, 26px);
  padding: clamp(24px, 3.2vh, 42px) clamp(28px, 3vw, 54px);
  border-radius: 34px;
  background:
    radial-gradient(circle at top left, rgba(0, 197, 167, 0.14), transparent 34%),
    linear-gradient(148deg, rgba(4, 15, 20, 0.96), rgba(7, 23, 29, 0.82));
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(119, 255, 231, 0.06);
  align-content: center;
}

.engineer-message--widescreen .engineer-message__eyebrow {
  font-size: clamp(1rem, 1.3vw, 1.45rem);
  letter-spacing: 0.18em;
}

.engineer-message--widescreen h2 {
  font-size: clamp(2.7rem, 4vw, 4.8rem);
  line-height: 0.98;
}

.engineer-message--widescreen .engineer-message__primary {
  max-width: 34ch;
  font-size: clamp(1.45rem, 2.2vw, 2.5rem);
  line-height: 1.24;
}

.engineer-message--widescreen .engineer-message__secondary {
  max-width: 48ch;
  font-size: clamp(1.05rem, 1.32vw, 1.42rem);
  line-height: 1.45;
}
</style>
