# BES Engineer's Day Promo

Vue + Vite wide-screen promo site for BES, an electrical BIM/VDC and engineering services company. The site celebrates the nearest upcoming Engineer's Day from a locally normalized dataset and never scrapes Wikipedia at runtime.

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
npm run build:gh-pages
npm run deploy
```

## Routing

- `/` opens the wide-screen advertising-first home screen.
- You can override the radar date with the `d` route value or query string.
- Legacy `/draft` and `/wide-screen-ad` URLs redirect back to `/` while preserving the date override.

Examples:

- `/2026-09-15`
- `/?d=2026-09-15`
- `/draft/2026-09-15`

## GitHub Pages

Deployment is wired through the `gh-pages` package.

- `npm run build:gh-pages` builds the app with the correct GitHub Pages base path.
- `npm run deploy` builds and publishes `dist` to the `gh-pages` branch.

For this repository, GitHub Pages builds with the base path `/bes-global-engineers-day/`.

The GitHub Pages build also writes `404.html` and `.nojekyll` so Vue Router history-mode routes such as `/<date>` and legacy redirect paths continue to work on refresh.

## Data Flow

The Engineer's Day data pipeline is intentionally build-time oriented:

1. `scripts/syncEngineerDays.js` fetches the Wikipedia Engineer's Day page.
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
