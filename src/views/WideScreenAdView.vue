<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BackgroundSlider from '../components/BackgroundSlider.vue'
import EngineerDayMessage from '../components/EngineerDayMessage.vue'
import engineerDays from '../data/engineerDays.normalized.json'
import { besContacts } from '../data/besProfile.js'

const BesThreeLogo = defineAsyncComponent(() => import('../components/BesThreeLogo.vue'))

const props = defineProps({
  date: {
    type: [Date, String, Number, Object],
    default: undefined
  }
})

const route = useRoute()

const portraitRoute = computed(() => ({
  name: 'portrait',
  params: route.params?.d ? { d: route.params.d } : {},
  query: route.query
}))
</script>

<template>
  <section class="wide-ad-view">
    <BackgroundSlider />

    <div class="wide-ad-layout">
      <header class="wide-ad-radar">
        <EngineerDayMessage :engineer-days="engineerDays" :date="props.date" variant="widescreen" />
      </header>

      <div class="wide-ad-logo">
        <BesThreeLogo variant="ad" />
      </div>

      <footer class="wide-ad-footer" aria-label="Main contacts">
        <a :href="besContacts.phoneHref">{{ besContacts.phoneLabel }}</a>
        <a :href="besContacts.emailHref">{{ besContacts.emailLabel }}</a>
        <a :href="besContacts.siteHref" target="_blank" rel="noreferrer">
          {{ besContacts.siteLabel }}
        </a>
      </footer>
    </div>

    <div class="wide-ad-blocked">
      <div class="wide-ad-blocked__card">
        <p class="wide-ad-blocked__eyebrow">Wide-Screen Home</p>
        <h1>This main screen is designed for large displays only.</h1>
        <p>
          This root page is tuned for wide screens so the BES logo, moving
          background, Engineer's Day radar, and contact dock can all breathe.
        </p>
        <RouterLink class="wide-ad-blocked__switch" :to="portraitRoute">
          Open portrait version
        </RouterLink>
        <div class="wide-ad-blocked__links" aria-label="Main contacts">
          <a :href="besContacts.phoneHref">{{ besContacts.phoneLabel }}</a>
          <a :href="besContacts.emailHref">{{ besContacts.emailLabel }}</a>
          <a :href="besContacts.siteHref" target="_blank" rel="noreferrer">
            {{ besContacts.siteLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wide-ad-view {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  --wide-ad-middle-row: 55fr;
  --wide-ad-footer-row: 12fr;
  --wide-ad-footer-band: 12svh;
  --wide-ad-footer-height: calc(var(--wide-ad-footer-band) - 12px);
  --wide-ad-slide-label-gap: 6px;
  --slide-label-bottom: calc(var(--wide-ad-footer-height) + var(--wide-ad-slide-label-gap));
}

.wide-ad-layout,
.wide-ad-blocked {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  min-height: 100svh;
}

.wide-ad-layout {
  display: grid;
  grid-template-rows: 33fr var(--wide-ad-middle-row) var(--wide-ad-footer-row);
  height: 100vh;
  height: 100svh;
  padding: 0 32px;
}

.wide-ad-radar {
  width: min(100%, 1780px);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: stretch;
  padding: 18px 0 8px;
}

.wide-ad-radar :deep(.engineer-message) {
  width: 100%;
  height: 100%;
}

.wide-ad-logo {
  display: grid;
  align-items: center;
  justify-items: center;
  min-height: 0;
  padding: 0;
}

.wide-ad-logo :deep(.three-logo-shell) {
  width: min(100%, 1860px);
  height: 100%;
}

.wide-ad-footer {
  width: min(100%, 1780px);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: var(--wide-ad-footer-height);
  align-self: end;
  padding: 0 34px;
  border-radius: 999px;
  background: rgba(4, 13, 19, 0.62);
  border: 1px solid rgba(119, 255, 231, 0.14);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
}

.wide-ad-footer a {
  color: var(--accent-bright);
  font-family: var(--font-round);
  font-size: clamp(1.15rem, 1.75vw, 1.7rem);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.wide-ad-blocked {
  display: none;
  place-items: center;
  padding: 24px;
}

.wide-ad-blocked__card {
  width: min(640px, 100%);
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(155deg, rgba(11, 23, 29, 0.94), rgba(5, 15, 20, 0.9));
  border: 1px solid rgba(119, 255, 231, 0.12);
  box-shadow: var(--shadow-glow);
  text-align: center;
}

.wide-ad-blocked__eyebrow {
  margin: 0 0 10px;
  color: var(--accent-bright);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.wide-ad-blocked__card h1 {
  margin: 0 0 14px;
  font-family: var(--font-round);
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.02;
}

.wide-ad-blocked__card p {
  margin: 0;
  color: var(--text-dim);
  line-height: 1.7;
}

.wide-ad-blocked__links {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.wide-ad-blocked__switch {
  display: inline-flex;
  justify-content: center;
  margin-top: 20px;
  padding: 14px 20px;
  border-radius: 999px;
  background: rgba(4, 13, 19, 0.7);
  border: 1px solid rgba(119, 255, 231, 0.16);
  color: var(--accent-bright);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.wide-ad-blocked__links a {
  display: inline-flex;
  justify-content: center;
  padding: 14px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, #00c5a7, #4df5de);
  color: #03231e;
  font-weight: 700;
}

@media (max-width: 1199px) {
  .wide-ad-layout {
    display: none;
  }

  .wide-ad-blocked {
    display: grid;
  }
}

@media (min-width: 1600px) {
  .wide-ad-view {
    --wide-ad-middle-row: 56fr;
    --wide-ad-footer-row: 11fr;
    --wide-ad-footer-band: 11svh;
  }
}
</style>
