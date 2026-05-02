<script setup>
import { defineAsyncComponent } from 'vue'
import BackgroundSlider from './BackgroundSlider.vue'
import EngineerDayMessage from './EngineerDayMessage.vue'

const BesThreeLogo = defineAsyncComponent(() => import('./BesThreeLogo.vue'))

defineProps({
  engineerDays: {
    type: Object,
    required: true
  }
})

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Systems', href: '#systems' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contacts', href: '#contacts' }
]
</script>

<template>
  <section id="hero" class="hero-section">
    <BackgroundSlider />

    <div class="hero-surface">
      <header class="hero-nav">
        <a href="#hero" class="hero-brand">
          <span class="hero-brand__mark">BES</span>
          <span class="hero-brand__text">Engineer’s Day Edition</span>
        </a>

        <nav class="hero-links" aria-label="Primary">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
          >
            {{ item.label }}
          </a>
        </nav>
      </header>

      <div class="hero-layout">
        <div class="hero-copy">
          <span class="hero-eyebrow">
            Electrical BIM · VDC · Design Support for US Builders
          </span>
          <h1>
            Precision coordination for electrical teams that would rather solve
            clashes now than explain them later.
          </h1>
          <p class="hero-intro">
            BES delivers electrical redlines, BIM coordination, shop drawings,
            prefab support, and design-assistance with a practical eye on
            constructability, code, and client communication.
          </p>

          <EngineerDayMessage :engineer-days="engineerDays" />

          <div class="hero-actions">
            <a href="#capabilities" class="button button--primary">
              Explore capabilities
            </a>
            <a href="#contacts" class="button button--secondary">
              Talk to BES
            </a>
          </div>

          <div class="hero-tags">
            <span>US client experience</span>
            <span>Prefab-aware detailing</span>
            <span>Code-conscious modeling</span>
          </div>
        </div>

        <BesThreeLogo />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
}

.hero-surface {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 32px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 28px 0 42px;
  display: flex;
  flex-direction: column;
}

.hero-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 8px;
}

.hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-weight: 700;
}

.hero-brand__mark {
  display: inline-grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(0, 197, 167, 0.2), rgba(119, 255, 231, 0.08));
  border: 1px solid rgba(119, 255, 231, 0.18);
  color: var(--accent-bright);
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  letter-spacing: 0.08em;
}

.hero-brand__text {
  color: rgba(231, 249, 245, 0.88);
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 18px;
}

.hero-links a {
  color: rgba(231, 249, 245, 0.76);
  font-size: 0.94rem;
}

.hero-layout {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
  align-items: center;
  gap: 32px;
}

.hero-copy {
  display: grid;
  gap: 18px;
}

.hero-eyebrow {
  display: inline-flex;
  width: fit-content;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(119, 255, 231, 0.18);
  background: rgba(0, 0, 0, 0.16);
  color: var(--accent-bright);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: clamp(3rem, 6vw, 5.8rem);
  line-height: 0.94;
  letter-spacing: -0.03em;
  max-width: 10ch;
}

.hero-intro {
  margin: 0;
  max-width: 58ch;
  color: rgba(231, 249, 245, 0.78);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 22px;
  border-radius: 999px;
  font-weight: 700;
  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button--primary {
  background: linear-gradient(135deg, #00c5a7, #4df5de);
  color: #03231e;
}

.button--secondary {
  border: 1px solid rgba(119, 255, 231, 0.24);
  background: rgba(0, 0, 0, 0.22);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-tags span {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(158, 255, 238, 0.1);
  color: rgba(231, 249, 245, 0.78);
  font-size: 0.92rem;
}

@media (max-width: 980px) {
  .hero-layout {
    grid-template-columns: 1fr;
    padding: 48px 0 16px;
  }

  .hero-copy h1 {
    max-width: none;
  }
}

@media (max-width: 760px) {
  .hero-surface {
    width: min(100% - 20px, 1180px);
    padding-top: 20px;
  }

  .hero-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-links {
    gap: 14px;
  }

  .hero-copy h1 {
    font-size: clamp(2.4rem, 14vw, 4rem);
  }
}
</style>
