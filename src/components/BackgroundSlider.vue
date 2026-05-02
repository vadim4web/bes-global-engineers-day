<script setup>
import { VueperSlide, VueperSlides } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

import redlinesImg from '@/assets/redlines.png'
import electricalOnlyImg from '@/assets/electrical-only.png'
import electricalImg from '@/assets/electrical.png'
import commercialImg from '@/assets/commercial.png'
import modelingImg from '@/assets/modeling.png'
import constructabilityImg from '@/assets/constructability.png'
import telecomImg from '@/assets/telecom.png'
import industrialImg from '@/assets/industrial.png'
import prefabImg from '@/assets/prefab_and_shopdrawings.png'
import pluginsImg from '@/assets/plugins-development.png'
import fireAlarmImg from '@/assets/fire-alarm.png'
import missionCriticalImg from '@/assets/mission-critical.png'
import designImg from '@/assets/design.png'
import nfpaImg from '@/assets/nfpa-code-compliance.png'
import bmsImg from '@/assets/bms.png'
import healthcareImg from '@/assets/health-care.png'
import securityAvImg from '@/assets/security_and_av.png'
import residentialImg from '@/assets/high-rise_residential.png'
import instrumentationImg from '@/assets/instrumentation_and_control.png'
import educationImg from '@/assets/education.png'

const slides = [
  { id: 'redlines', label: 'Pre-construction redlines that prevent costly mistakes', image: redlinesImg },
  { id: 'electrical-only', label: 'We do electrical only — full focus', image: electricalOnlyImg },
  { id: 'electrical', label: 'Electrical systems engineered for execution', image: electricalImg },
  { id: 'commercial', label: 'Commercial projects delivered with precision', image: commercialImg },

  { id: 'bim', label: 'BIM modeling and coordination without clashes', image: modelingImg },
  { id: 'constructability', label: 'Constructability thinking built into every model', image: constructabilityImg },
  { id: 'telecom', label: 'Telecom and low-voltage systems integrated', image: telecomImg },
  { id: 'industrial', label: 'Industrial environments demand accuracy', image: industrialImg },

  { id: 'prefab', label: 'Prefab and shop drawings ready for the field', image: prefabImg },
  { id: 'revit-addins', label: 'Custom Revit add-ins for faster workflows', image: pluginsImg },
  { id: 'fire-alarm', label: 'Fire alarm systems designed to code', image: fireAlarmImg },
  { id: 'mission-critical', label: 'Mission-critical facilities require zero compromise', image: missionCriticalImg },

  { id: 'design-assist', label: 'Design-assistance with real field awareness', image: designImg },
  { id: 'nfpa', label: 'NFPA code compliance in every detail', image: nfpaImg },
  { id: 'bms', label: 'BMS systems modeled with precision', image: bmsImg },
  { id: 'healthcare', label: 'Healthcare projects where reliability matters', image: healthcareImg },

  { id: 'coordination', label: 'Coordination that keeps trades aligned', image: instrumentationImg },
  { id: 'precision', label: 'Precision in every drawing and model', image: educationImg },
  { id: 'security-av', label: 'Security and AV systems coordinated seamlessly', image: securityAvImg },
  { id: 'residential', label: 'High-rise residential projects at scale', image: residentialImg }
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
      :duration="5200"
      :transition-speed="1400"
      fixed-height="100%"
    >
      <vueper-slide
        v-for="slide in slides"
        :key="slide.id"
      >
        <template #content>
          <div class="slide-visual">

            <!-- 🔥 ОЦЕ ВСЯ СУТЬ -->
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

/* 🔥 КАРТИНКА */
.slide-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* старий контейнер не чіпаємо */
.slide-visual {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* label без змін */
.slide-label {
  position: absolute;
  right: clamp(20px, 4vw, 56px);
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
    0 0 36px hsl(171, 100%, 100%)
  ;
  filter: drop-shadow(0 0 0.125rem white);
}

/* overlay залишаємо */
.background-slider__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(2, 8, 12, 0.55), rgba(2, 8, 12, 0.62) 45%, rgba(2, 8, 12, 0.88)),
    radial-gradient(circle at center, transparent 0%, rgba(2, 8, 12, 0.44) 58%);
}
</style>
