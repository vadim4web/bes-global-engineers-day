<script setup>
import { VueperSlide, VueperSlides } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

const slides = [
  {
    id: 'coordination',
    label: 'Trade coordination under control',
    className: 'slide-visual--grid'
  },
  {
    id: 'prefab',
    label: 'Prefab-friendly drawing packages',
    className: 'slide-visual--signal'
  },
  {
    id: 'design',
    label: 'Design-assistance with field awareness',
    className: 'slide-visual--rings'
  }
]
</script>

<template>
  <div class="background-slider">
    <vueper-slides
      class="hero-slides"
      :arrows="false"
      :autoplay="true"
      :bullets="false"
      :pause-on-hover="false"
      :touchable="false"
      :duration="6400"
      :transition-speed="1800"
      fixed-height="100%"
    >
      <vueper-slide
        v-for="slide in slides"
        :key="slide.id"
      >
        <template #content>
          <div :class="['slide-visual', slide.className]">
            <span class="slide-label">{{ slide.label }}</span>
          </div>
        </template>
      </vueper-slide>
    </vueper-slides>

    <div class="background-slider__overlay"></div>
  </div>
</template>

<style scoped>
.background-slider {
  position: absolute;
  inset: 0;
}

.hero-slides,
:deep(.vueperslides),
:deep(.vueperslides__inner),
:deep(.vueperslides__parallax-wrapper) {
  height: 100%;
}

:deep(.vueperslides__bullet .default) {
  background: rgba(255, 255, 255, 0.28);
}

.slide-visual {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-visual::before,
.slide-visual::after {
  content: "";
  position: absolute;
  inset: auto;
  border-radius: 50%;
  filter: blur(2px);
  animation: drift 16s ease-in-out infinite alternate;
}

.slide-visual::before {
  width: 40vw;
  height: 40vw;
  top: 8%;
  left: -8%;
  background: radial-gradient(circle, rgba(0, 197, 167, 0.24), transparent 70%);
}

.slide-visual::after {
  width: 34vw;
  height: 34vw;
  right: -6%;
  bottom: -10%;
  background: radial-gradient(circle, rgba(120, 255, 233, 0.16), transparent 70%);
}

.slide-label {
  position: absolute;
  right: clamp(20px, 4vw, 56px);
  bottom: clamp(24px, 4vw, 48px);
  color: rgba(231, 249, 245, 0.38);
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: clamp(1rem, 2vw, 1.4rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.slide-visual--grid {
  background:
    linear-gradient(135deg, rgba(0, 197, 167, 0.16), transparent 35%),
    radial-gradient(circle at 70% 10%, rgba(255, 255, 255, 0.08), transparent 22%),
    linear-gradient(180deg, #0a1922, #051017 54%, #03070b);
}

.slide-visual--grid::before {
  box-shadow:
    0 0 0 1px rgba(119, 255, 231, 0.12),
    90px 90px 0 1px rgba(119, 255, 231, 0.1),
    180px 180px 0 1px rgba(119, 255, 231, 0.08);
}

.slide-visual--signal {
  background:
    linear-gradient(160deg, rgba(16, 59, 58, 0.45), rgba(2, 8, 12, 0.9)),
    linear-gradient(90deg, rgba(119, 255, 231, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(119, 255, 231, 0.03) 1px, transparent 1px),
    #041017;
  background-size: auto, 48px 48px, 48px 48px, auto;
}

.slide-visual--signal::before,
.slide-visual--signal::after {
  border-radius: 999px;
  transform: rotate(-26deg);
}

.slide-visual--rings {
  background:
    radial-gradient(circle at center, rgba(0, 197, 167, 0.12), transparent 30%),
    linear-gradient(160deg, rgba(5, 22, 28, 0.95), rgba(3, 8, 12, 0.98));
}

.slide-visual--rings::before,
.slide-visual--rings::after {
  border: 1px solid rgba(119, 255, 231, 0.1);
  background: transparent;
}

.background-slider__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(2, 8, 12, 0.55), rgba(2, 8, 12, 0.62) 45%, rgba(2, 8, 12, 0.88)),
    radial-gradient(circle at center, transparent 0%, rgba(2, 8, 12, 0.44) 58%);
}

@keyframes drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(3%, -3%, 0) scale(1.08);
  }
}
</style>
