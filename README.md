# BES Engineer's Day Promo

Vue + Vite landing page for BES, an electrical BIM/VDC and engineering services company. The site celebrates the nearest upcoming Engineer’s Day from a locally normalized dataset and never scrapes Wikipedia at runtime.

## Stack

- Vue.js
- Vite
- dayjs
- three.js
- vueperslides

## Install

```bash
npm install
```

## Commands

```bash
npm run sync:engineer-days
npm run dev
npm run build
```

## Data Flow

The Engineer’s Day data pipeline is intentionally build-time oriented:

1. `scripts/syncEngineerDays.js` fetches the Wikipedia Engineer’s Day page.
2. The country-wise table is parsed once during development.
3. Original fields such as `country`, `rawDateText`, `note`, and `sourceUrl` are preserved.
4. A normalized rule object is generated for each row.
5. The result is written to `src/data/engineerDays.normalized.json`.
6. The Vue app imports that JSON directly.

Wikipedia is not fetched at runtime.

## Manual Review Cases

Some source rows cannot be safely normalized into a recurring annual rule automatically. These are marked with:

- `parseStatus: "manual_review"`
- a `reviewReason` such as `movable_date`, `variable_date`, or `calendar_based`

Examples include movable observances, calendar-system-based dates, and variable dates where the source does not provide a stable annual rule.

## Fallback Behavior

If Wikipedia cannot be fetched during sync, the script will fall back to:

- a cached raw HTML snapshot in `scripts/cache/engineers-day.wikipedia.html`, or
- a cached normalized JSON snapshot in `scripts/cache/engineerDays.normalized.cache.json`

The application itself still runs entirely from the normalized local JSON file in `src/data`.
