<script setup>
import { defineAsyncComponent } from 'vue'
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

const servicePills = [
  'Electrical BIM',
  'VDC Coordination',
  'Engineering Services'
]
</script>

<template>
  <section class="portrait-ad-view">
    <BackgroundSlider />

    <div class="portrait-ad-layout">
      <header class="portrait-ad-marquee" aria-label="BES capabilities">
        <span class="portrait-ad-marquee__pill">BES Global Radar</span>
        <span class="portrait-ad-marquee__pill portrait-ad-marquee__pill--ghost">
          Electrical BIM / VDC / Engineering
        </span>
      </header>

      <div class="portrait-ad-message">
        <EngineerDayMessage :engineer-days="engineerDays" :date="props.date" variant="portrait" />
      </div>

      <div class="portrait-ad-stage">
        <div class="portrait-ad-stage__beam portrait-ad-stage__beam--left" aria-hidden="true"></div>
        <div class="portrait-ad-stage__beam portrait-ad-stage__beam--right" aria-hidden="true"></div>
        <div class="portrait-ad-stage__glow" aria-hidden="true"></div>

        <BesThreeLogo variant="portrait" />
      </div>

      <div class="portrait-ad-services" aria-label="Service focus areas">
        <span
          v-for="service in servicePills"
          :key="service"
          class="portrait-ad-services__pill"
        >
          {{ service }}
        </span>
      </div>

      <footer class="portrait-ad-footer" aria-label="Main contacts">
        <a :href="besContacts.phoneHref">{{ besContacts.phoneLabel }}</a>
        <a :href="besContacts.emailHref">{{ besContacts.emailLabel }}</a>
        <a :href="besContacts.siteHref" target="_blank" rel="noreferrer">
          {{ besContacts.siteLabel }}
        </a>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.portrait-ad-view {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  --slide-label-bottom: clamp(170px, 18svh, 240px);
  --slide-label-font-size: clamp(1.05rem, 1.9vh, 1.6rem);
  --slide-label-padding-inline: clamp(18px, 4vw, 28px);
  --slide-label-max-width: 28rem;
}

.portrait-ad-view::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at top, rgba(0, 197, 167, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(2, 8, 12, 0.1), rgba(2, 8, 12, 0.18));
  pointer-events: none;
}

.portrait-ad-layout {
  position: relative;
  z-index: 2;
  width: min(100%, 760px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding:
    clamp(20px, 2.4vh, 30px)
    clamp(16px, 4vw, 30px)
    clamp(18px, 2.4vh, 28px);
  display: grid;
  grid-template-rows: auto auto minmax(280px, 1fr) auto auto;
  gap: clamp(14px, 2vh, 24px);
}

.portrait-ad-marquee {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.portrait-ad-marquee__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 11px 18px;
  border-radius: 999px;
  background: rgba(4, 13, 19, 0.62);
  border: 1px solid rgba(119, 255, 231, 0.14);
  backdrop-filter: blur(14px);
  color: var(--accent-bright);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
}

.portrait-ad-marquee__pill--ghost {
  color: rgba(231, 249, 245, 0.82);
}

.portrait-ad-message,
.portrait-ad-stage,
.portrait-ad-footer {
  min-width: 0;
}

.portrait-ad-stage {
  position: relative;
  min-height: clamp(280px, 38svh, 520px);
  padding: clamp(8px, 1.6vh, 18px);
  border-radius: 36px;
  background:
    radial-gradient(circle at top, rgba(0, 197, 167, 0.12), transparent 45%),
    linear-gradient(160deg, rgba(8, 21, 27, 0.88), rgba(4, 13, 19, 0.82));
  border: 1px solid rgba(119, 255, 231, 0.1);
  box-shadow:
    0 26px 90px rgba(0, 0, 0, 0.34),
    inset 0 0 0 1px rgba(119, 255, 231, 0.04);
  overflow: hidden;
}

.portrait-ad-stage__beam,
.portrait-ad-stage__glow {
  position: absolute;
  pointer-events: none;
}

.portrait-ad-stage__beam {
  top: 9%;
  bottom: 12%;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(119, 255, 231, 0.32), transparent);
  opacity: 0.7;
}

.portrait-ad-stage__beam--left {
  left: clamp(18px, 4vw, 32px);
}

.portrait-ad-stage__beam--right {
  right: clamp(18px, 4vw, 32px);
}

.portrait-ad-stage__glow {
  left: 50%;
  bottom: -28%;
  width: 78%;
  height: 52%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 197, 167, 0.22), rgba(0, 197, 167, 0));
  filter: blur(18px);
}

.portrait-ad-stage :deep(.three-logo-shell) {
  height: 100%;
}

.portrait-ad-stage :deep(.three-logo) {
  min-height: 100%;
}

.portrait-ad-services {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.portrait-ad-services__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(4, 13, 19, 0.56);
  border: 1px solid rgba(119, 255, 231, 0.12);
  color: rgba(231, 249, 245, 0.82);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.portrait-ad-footer {
  display: grid;
  gap: 10px;
}

.portrait-ad-footer a {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 14px 18px;
  border-radius: 22px;
  background: rgba(4, 13, 19, 0.7);
  border: 1px solid rgba(119, 255, 231, 0.14);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 46px rgba(0, 0, 0, 0.22);
  color: var(--accent-bright);
  font-family: var(--font-round);
  font-size: clamp(1rem, 1.5vh, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}

@media (min-width: 620px) {
  .portrait-ad-footer {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-height: 820px) {
  .portrait-ad-view {
    --slide-label-bottom: clamp(138px, 15svh, 180px);
    --slide-label-font-size: clamp(0.92rem, 1.5vh, 1.3rem);
  }

  .portrait-ad-layout {
    gap: 12px;
  }

  .portrait-ad-marquee__pill {
    min-height: 38px;
    padding: 9px 14px;
    font-size: 0.72rem;
  }

  .portrait-ad-services__pill {
    padding: 8px 13px;
    font-size: 0.76rem;
  }

  .portrait-ad-footer a {
    min-height: 52px;
    font-size: 0.94rem;
  }
}
</style>
