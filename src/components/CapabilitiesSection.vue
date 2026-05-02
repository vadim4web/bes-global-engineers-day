<script setup>
defineProps({
  capabilityCards: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="capabilities" class="content-section section-card capabilities-section">
    <div class="section-heading">
      <span class="section-kicker">Capabilities</span>
      <h2>Focused electrical services that fit real construction schedules.</h2>
    </div>

    <div class="capabilities-lead">
      <p>
        BES specializes in electrical construction design support, redlines,
        BIM modeling and coordination, shop drawings, prefab drawings, and
        design-assistance for clients that need dependable throughput without
        losing detail.
      </p>
      <p>
        We bring BIM/VDC experience, code knowledge, and collaborative delivery
        habits that work well with US contractors, detailers, and project
        managers.
      </p>
    </div>

    <div class="capabilities-grid">
      <article
        v-for="card in capabilityCards"
        :key="card.title"
        class="capability-card"
      >
        <h3>{{ card.title }}</h3>
        <p>{{ card.body }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.capabilities-section {
  overflow: hidden;
}

.capabilities-lead {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.capabilities-lead p,
.capability-card p {
  margin: 0;
  color: var(--text-dim);
  line-height: 1.7;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.capability-card {
  padding: 24px;
  border-radius: 24px;
  background:
    linear-gradient(150deg, rgba(8, 20, 26, 0.98), rgba(10, 28, 34, 0.75));
  border: 1px solid rgba(119, 255, 231, 0.1);
}

.capability-card h3 {
  margin: 0 0 12px;
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: 1.2rem;
}

@media (max-width: 820px) {
  .capabilities-lead,
  .capabilities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
