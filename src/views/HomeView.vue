<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import HeroSection from '../components/HeroSection.vue'
import CapabilitiesSection from '../components/CapabilitiesSection.vue'
import ContactSection from '../components/ContactSection.vue'
import DataHealthPanel from '../components/DataHealthPanel.vue'
import engineerDays from '../data/engineerDays.normalized.json'
import { getUpcomingEngineerDays } from '../utils/engineerDayDateRules.js'

const capabilityCards = [
  {
    title: 'Pre-Construction Redlines',
    body:
      'We turn markups into coordinated electrical intent quickly, keeping design changes traceable before they become field friction.'
  },
  {
    title: 'BIM Modeling and Coordination',
    body:
      'BES builds clean electrical BIM models that help trade partners align faster, spot clashes earlier, and move with confidence.'
  },
  {
    title: 'Prefab and Shop Drawings',
    body:
      'From spool-ready details to install-ready sheets, we support prefab workflows that reduce guesswork on the floor.'
  },
  {
    title: 'Design-Assistance',
    body:
      'Our team blends VDC depth, constructability awareness, and US electrical code knowledge to support practical design decisions.'
  }
]

const systems = [
  'Power distribution',
  'Lighting and controls',
  'Fire alarm infrastructure',
  'Low-voltage coordination',
  'Underground and feeder routing',
  'Prefab-oriented install packages'
]

const industries = [
  'Commercial interiors',
  'Healthcare and life science',
  'Data-driven campus environments',
  'Mixed-use developments',
  'Industrial and advanced manufacturing',
  'Education and civic facilities'
]

const projects = [
  {
    title: 'California',
    body: 'High-tempo BIM support for teams that need quick, accurate electrical coordination.'
  },
  {
    title: 'Washington',
    body: 'Coordination packages shaped around tight trade sequencing and field-ready clarity.'
  },
  {
    title: 'North Carolina',
    body: 'Steady redline execution and practical modeling support for evolving project sets.'
  },
  {
    title: 'Texas',
    body: 'Scalable electrical detailing capacity for fast-moving builders and prefab-minded teams.'
  }
]

const upcomingEngineerDays = computed(() =>
  getUpcomingEngineerDays(engineerDays, dayjs(), 6)
)

const dataHealth = computed(() => {
  const rows = engineerDays.rows ?? []
  const automaticallyParsedRows = rows.filter(
    (entry) => entry.normalizedRule?.parseStatus === 'parsed'
  ).length
  const manualReviewRows = rows.filter(
    (entry) => entry.normalizedRule?.parseStatus === 'manual_review'
  ).length
  const unsupportedMovableOrCalendarRows = rows.filter((entry) =>
    ['movable_date', 'calendar_based', 'variable_date'].includes(
      entry.normalizedRule?.reviewReason
    )
  ).length
  const excludedOneTimeEvents = rows.filter(
    (entry) => entry.normalizedRule?.isOneTime
  ).length

  return {
    totalRows: rows.length,
    automaticallyParsedRows,
    manualReviewRows,
    unsupportedMovableOrCalendarRows,
    excludedOneTimeEvents
  }
})
</script>

<template>
  <div class="app-shell">
    <HeroSection :engineer-days="engineerDays" />

    <main class="page-content">
      <section id="about" class="content-section section-card about-section">
        <div class="section-heading">
          <span class="section-kicker">About Us</span>
          <h2>Electrical BIM support built for crews that need clarity, not extra meetings.</h2>
        </div>
        <div class="about-grid">
          <p>
            BES is a client-oriented engineering services company focused on
            electrical construction design support across the United States.
            We help project teams move from redlines to coordinated models,
            shop drawings, and prefab-ready documentation with steady,
            practical execution.
          </p>
          <p>
            Our team combines BIM/VDC experience, electrical code awareness,
            and day-to-day familiarity with US project expectations. We support
            clients in California, Washington, North Carolina, and Texas with
            the kind of detail that keeps install teams from inventing answers
            in the field.
          </p>
        </div>
      </section>

      <CapabilitiesSection :capability-cards="capabilityCards" />

      <section id="systems" class="content-section section-card">
        <div class="section-heading">
          <span class="section-kicker">Systems</span>
          <h2>Electrical systems coordination across the packages that matter most.</h2>
        </div>
        <div class="pill-grid">
          <span v-for="system in systems" :key="system" class="pill-card">
            {{ system }}
          </span>
        </div>
      </section>

      <section id="industries" class="content-section section-card">
        <div class="section-heading">
          <span class="section-kicker">Industries</span>
          <h2>Support for fast-moving construction teams across diverse project types.</h2>
        </div>
        <div class="pill-grid">
          <span v-for="industry in industries" :key="industry" class="pill-card">
            {{ industry }}
          </span>
        </div>
      </section>

      <section id="projects" class="content-section section-card">
        <div class="section-heading">
          <span class="section-kicker">Projects</span>
          <h2>US-focused delivery with regional familiarity and remote execution discipline.</h2>
        </div>
        <div class="project-list">
          <article
            v-for="project in projects"
            :key="project.title"
            class="project-card"
          >
            <h3>{{ project.title }}</h3>
            <p>{{ project.body }}</p>
          </article>
        </div>
      </section>

      <section id="calendar" class="content-section section-card">
        <div class="section-heading">
          <span class="section-kicker">Engineer's Day Feed</span>
          <h2>Upcoming recurring celebrations from the locally normalized dataset.</h2>
        </div>

        <div class="calendar-grid">
          <article
            v-for="entry in upcomingEngineerDays"
            :key="`${entry.country}-${entry.occurrence.start.format('YYYY-MM-DD')}`"
            class="calendar-card"
          >
            <div class="calendar-date">{{ entry.displayLabel }}</div>
            <h3>{{ entry.country }}</h3>
            <p>{{ entry.note || "Recurring annual Engineer's Day entry." }}</p>
          </article>
        </div>

        <p class="source-note">
          Engineer's Day data is derived from
          <a
            href="https://en.wikipedia.org/wiki/Engineer%27s_Day"
            target="_blank"
            rel="noreferrer"
          >
            Wikipedia
          </a>
          and normalized locally during development. The app imports JSON only
          at runtime, and some source rows still require manual review before
          they can be used in recurring date calculations.
        </p>

        <DataHealthPanel :stats="dataHealth" />
      </section>

      <ContactSection id="contacts" />
    </main>
  </div>
</template>
