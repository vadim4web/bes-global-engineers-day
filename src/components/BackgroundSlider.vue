<script setup>
import { VueperSlide, VueperSlides } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

import { backgroundSlides as slides } from '@/assets/backgroundSlides.js'
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
      :transition-speed="1600"
      fixed-height="100%"
    >
      <vueper-slide
        v-for="slide in slides"
        :key="slide.id"
      >
        <template #content>
          <div class="slide-visual">
            <img
              class="slide-image"
              :src="slide.image"
              :alt="slide.label"
            />

            <span class="slide-label">
              {{ slide.label }}
            </span>
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

.slide-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-visual {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-label {
  position: absolute;
  right: 0;
  width: 100%;
  text-align: center;
  bottom: var(--slide-label-bottom, clamp(42px, 3.5vw, 84px));
  color: rgba(231, 249, 245, 0.38);
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: clamp(2rem, 3vw, 2.75rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow:
    0 0 1px hsl(171, 100%, 50%),
    0 0 2px hsl(171, 100%, 10%),
    0 0 4px hsl(171, 100%, 10%),
    0 0 6px hsl(171, 100%, 10%),
    0 0 8px hsl(171, 100%, 10%),
    0 0 12px hsl(171, 100%, 100%),
    0 0 16px hsl(171, 100%, 100%),
    0 0 24px hsl(171, 100%, 100%),
    0 0 36px hsl(171, 100%, 100%);
  filter: drop-shadow(0 0 0.125rem white);
}

.background-slider__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(2, 8, 12, 0.55), rgba(2, 8, 12, 0.62) 45%, rgba(2, 8, 12, 0.88)),
    radial-gradient(circle at center, transparent 0%, rgba(2, 8, 12, 0.44) 58%);
}
</style>
