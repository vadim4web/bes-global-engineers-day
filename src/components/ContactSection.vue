<script setup>
import { reactive, ref } from 'vue'
import { besContacts } from '../data/besProfile.js'

defineProps({
  id: {
    type: String,
    default: undefined
  }
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  comment: '',
  consent: false
})

const submitted = ref(false)

function submitForm() {
  if (!form.consent) {
    return
  }

  submitted.value = true
}
</script>

<template>
  <section :id="id" class="content-section section-card contact-section">
    <div class="section-heading">
      <span class="section-kicker">Contacts</span>
      <h2>Let's line up the next electrical coordination sprint.</h2>
    </div>

    <div class="contact-grid">
      <div class="contact-copy">
        <p>
          BES provides BIM services in the United States with a client-oriented
          approach and a practical eye on electrical design support.
        </p>

        <a :href="besContacts.phoneHref" class="contact-line">
          {{ besContacts.phoneLabel }}
        </a>
        <a :href="besContacts.emailHref" class="contact-line">
          {{ besContacts.emailLabel }}
        </a>
        <a
          :href="besContacts.siteHref"
          class="contact-line"
          target="_blank"
          rel="noreferrer"
        >
          {{ besContacts.siteLabel }}
        </a>

        <p class="contact-note">
          Short version: we like accurate models, clear redlines, and projects
          that stay calmer because someone handled the details early.
        </p>
      </div>

      <form class="contact-form" @submit.prevent="submitForm">
        <label>
          <span>Name</span>
          <input v-model="form.name" type="text" name="name" required />
        </label>

        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" name="email" required />
        </label>

        <label>
          <span>Phone</span>
          <input v-model="form.phone" type="tel" name="phone" />
        </label>

        <label>
          <span>Comment</span>
          <textarea
            v-model="form.comment"
            name="comment"
            rows="5"
            required
          ></textarea>
        </label>

        <label class="contact-consent">
          <input v-model="form.consent" type="checkbox" required />
          <span>I agree to the privacy policy and consent to being contacted.</span>
        </label>

        <button type="submit">
          Send inquiry
        </button>

        <p v-if="submitted" class="contact-success">
          Thanks. BES has your note and will follow up soon.
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
}

.contact-copy {
  display: grid;
  align-content: start;
  gap: 16px;
}

.contact-copy p,
.contact-note,
.contact-consent span {
  margin: 0;
  color: var(--text-dim);
  line-height: 1.7;
}

.contact-line {
  width: fit-content;
  color: var(--accent-bright);
  font-family: var(--font-round);
  font-size: 1.22rem;
}

.contact-form {
  display: grid;
  gap: 16px;
}

.contact-form label {
  display: grid;
  gap: 8px;
}

.contact-form span {
  color: rgba(231, 249, 245, 0.86);
  font-size: 0.92rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(119, 255, 231, 0.14);
  border-radius: 16px;
  background: rgba(2, 8, 12, 0.58);
  color: var(--text-main);
  outline: none;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: rgba(119, 255, 231, 0.42);
  box-shadow: 0 0 0 3px rgba(0, 197, 167, 0.14);
}

.contact-consent {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contact-consent input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
}

.contact-form button {
  min-height: 52px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #00c5a7, #54ffe2);
  color: #03231e;
  font-weight: 800;
  cursor: pointer;
}

.contact-success {
  margin: 0;
  color: var(--accent-bright);
}

@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
