# Odograph — implementation notes

The design handoff is [README.md](README.md). This file covers the build that
implements it.

## Stack

React 19 + TypeScript, built with Vite. No router (single screen with three
views), no state library — the vehicle store is one hook over `localStorage`.
Icons are `@phosphor-icons/react` (regular weight), installed rather than
hotlinked. Tests are Vitest, over the derivation layer only.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 50 unit tests: schedule/plan logic, catalog, form cascade
npm run build    # tsc -b && vite build
```

## Layout

| Path | What it is |
| --- | --- |
| `styles.css` | The Nocturne token sheet, unchanged and imported as-is. Source of truth for every color, font, spacing, radius, and shadow. |
| `src/app.css` | The only app-level CSS: the page gradient, two column widths, and the hover states the prototype expressed inline. No media queries. |
| `src/data/` | Catalog, schedules, demo seed — the two things a real app needs to source properly. The catalog is year-aware: 2017–2026, models and engines per generation. |
| `src/lib/schedule.ts` | Pure derivation: occurrence generation, `statusOf`, grouping status, cost sums. |
| `src/lib/plan.ts` | Pure view-model builders: mileage groups, timeline nodes, log rows, and the status → tag/mark/tint treatment table. |
| `src/lib/useGarage.ts` | The vehicle store. Every mutation persists; the Save button re-persists and flips its label for 1600 ms. |
| `src/lib/useVehicleForm.ts` | The shared create-a-vehicle form, including the year → make → model → engine cascade. |
| `src/components/` | One file per region of the design. |

State that is derived — occurrences, statuses, counts, cost sums, groups,
timeline nodes, log rows, progress — is computed per render and never stored,
so editing the odometer recomputes everything.

## Where this build differs from the handoff, and why

- **Mileage points.** The handoff says the Accord schedule generates "~120
  occurrences across ~40 distinct mileage points". It is 117 occurrences across
  **29** mileage points — the intervals overlap more than the estimate assumed.
  The counts are asserted in `src/lib/schedule.test.ts`; the UI reads "29 mileage
  points to 200,000".
- **Hit targets.** The handoff says targets stay ≥ 40 px via the `.btn` and
  `.input` min-heights. `styles.css` gives `.input` a 36 px min-height and `.btn`
  none at all, so buttons land at ~30 px. Left as the token sheet defines it,
  since the sheet is the stated source of truth and the screenshots match it —
  worth a decision from the design side before shipping.
- **Derived labels.** The prototype hard-codes "Due within 3,000 mi" and "200k"
  in the progress row. Both are derived from the `dueWindow` and `horizon` props
  here, so changing them stays consistent.
- **First visits start empty.** The handoff seeds the demo garage when nothing
  is saved; this build opens on the vehicle picker instead, with the demo one
  click away ("Load the demo 2020 RAV4"). The storage key moved to
  `odograph.v2`, and `v1` data is deleted on load — it was almost all
  auto-seeded demo.
- **Catalog.** Expanded from the prototype's 13 models to 34: the five
  best-selling US brands of 2025 (Toyota, Ford, Chevrolet, Honda, Hyundai)
  with their top sedans and SUVs, plus the Focus, F-150, Odyssey, Sienna and
  Sonata, plus the original Subaru and Mazda models. Years are 2017–2026, and
  each model only offers the years and engines it was actually sold with.
  Only the Accord 1.5L Turbo and the RAV4 2.5L (gas) have detailed schedules;
  everything else uses the generic one.
- **Escape closes a dialog**, and clicking the backdrop does too. Not in the
  handoff; standard dialog behavior.

`dueWindow` (3,000 mi) and `horizon` (200,000 mi) are props on `<App />`,
defaulted in `src/config.ts`.

## Still open (from the handoff, unchanged here)

- No loading, network-error, or schedule-not-found states — an unlisted vehicle
  silently falls back to the generic schedule with no notice to the user.
- Validation is the silent empty-name guard on the custom-entry dialog only.
- Schedule data is approximate, mileage-only, and US-market. A time axis
  ("brake fluid or 3 years") and severe- vs normal-duty branching are the
  largest modelling gaps.
- Persistence is per-browser. `src/lib/storage.ts` is the seam to replace with a
  user-scoped API; the stored shape is `{ vehicles, activeId }`.
