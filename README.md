# Handoff: Vehicle Service Tracker

## Overview

A web app that shows a vehicle owner every factory-scheduled service from 0 to 200,000 miles, positioned against their current odometer reading. The user selects a vehicle (year / make / model / engine), enters mileage, and the app derives:

- what is **overdue** (scheduled mileage already passed, not marked complete)
- what is **due soon** (within a configurable window, default 3,000 mi)
- what is **upcoming** (the rest of the plan to 200k)
- what is **complete** (checked off, or logged as a custom entry)

The user checks off services individually or in bulk per mileage point, logs custom (non-scheduled) work at any mileage, keeps multiple vehicles in a garage, and persists everything locally.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype showing intended look and behavior, **not production code to copy directly**. `Service Tracker.dc.html` is authored in a proprietary streaming-component format (a template + a logic class assembled at load time by `support.js`); it is not a React/Vue component and should not be ported line-by-line.

The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, Svelte, SwiftUI, native, etc.) using its established patterns, component library, routing, and state management. If no environment exists yet, choose the most appropriate framework and implement there.

`styles.css` (the Nocturne design system token sheet + component layer) **is** directly reusable: the CSS custom properties and class names in it are the source of truth for every color, font, spacing, radius, and shadow value listed below.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, interaction states, and copy. The developer should recreate the UI pixel-accurately using the codebase's existing libraries and patterns, taking values from `styles.css` tokens rather than hard-coding hexes.

The **data** is not final: the maintenance intervals in the prototype are plausible approximations of factory schedules for a handful of vehicles, hardcoded as a lookup table. Production needs a real schedule data source (see *Data Model → Schedule source*).

---

## Screens / Views

### 1. First run / empty state

**Purpose:** onboard a user with no saved vehicle; capture vehicle identity and odometer.

**Layout:** single centered column, `max-width: 620px`, `margin: 0 auto`, padding `clamp(28px, 8vh, 90px) clamp(16px, 4vw, 32px)`. Page background is a radial gradient: `radial-gradient(120% 80% at 15% -10%, #1d2033 0%, var(--color-bg) 55%)` — same background on every screen.

**Components, top to bottom:**

1. **Eyebrow** — Phosphor `ph-gauge` icon (18px, `--color-accent`) + text "ODOGRAPH". 13px, `letter-spacing: .12em`, `text-transform: uppercase`, color `--color-accent`, `gap: 10px`.
2. **H1** — "Every service your car is owed, mapped to 200,000 miles." `font-size: clamp(30px, 6vw, 44px)`, margin `14px 0 8px`. Heading font, weight 500 (never bolder — Nocturne rule).
3. **Sub-paragraph** — `.text-muted`, 15px, `max-width: 44ch`. Copy: "Pick your vehicle, tell us the odometer, and we build the manufacturer schedule around where you actually are — what you've missed, what's due, and what's next."
4. **Form card** — `.card .elev-sm`, `padding: var(--space-6)`, `gap: var(--space-4)`, `margin-top: 26px`. Contains:
   - Row A: 4 × `.field` (Year, Make, Model, Engine) in `display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4)`. Each is a `<select class="input">`.
   - Row B: 2 × `.field` (Current odometer — `inputmode="numeric"`, placeholder `80,000`; Nickname (optional) — placeholder `Daily driver`) at `minmax(160px, 1fr)`.
   - Actions: `.btn.btn-primary` "Build my schedule" with `ph-arrow-right`; `.btn.btn-ghost` "Load the demo 2018 Accord". `display: flex; flex-wrap: wrap; gap: var(--space-3)`.

**Cascade rule:** changing Make resets Model to that make's first model and Engine to that model's first engine. Changing Model resets Engine. Odometer input strips all non-digits on change.

---

### 2. Dashboard (primary view)

The main screen. Content column `max-width: 1180px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 32px)`.

#### 2a. Header bar

`.nav` class, same max-width column, `padding: var(--space-4) clamp(16px,4vw,32px)`, `flex-wrap: wrap; row-gap: var(--space-3)`.

- **Brand** (left, `margin-right: auto`): `ph-gauge` in `--color-accent` + "Odograph", `.nav-brand`.
- **Vehicle switcher**: `.btn.btn-secondary` — `ph-car-profile` + vehicle nickname (or model) + `ph-caret-down` at `opacity: .6`. Opens the Garage dialog.
- **`.btn.btn-secondary`** "Log a service" with `ph-plus`. Opens the Custom entry dialog.
- **`.btn.btn-primary`** "Save" with `ph-check-circle`. Label swaps to "Saved" for 1600ms after click, then reverts.

#### 2b. Vehicle header row

`display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--space-6) var(--space-8); margin: var(--space-4) 0 var(--space-8)`.

- **Identity block** (`min-width: 260px`): kicker line = engine + ` · ` + nickname, 12px, `letter-spacing: .1em`, uppercase, `.text-muted`. Below it H1 = `{year} {make} {model}`, `font-size: clamp(26px, 4.4vw, 40px)`, `margin: 6px 0 0`.
- **Odometer field** (`width: 180px`): `.field` labelled "Odometer (mi)", `.input` at `font-size: 18px; min-height: 42px`, `inputmode="numeric"`. **Editing this recomputes every status live.**
- **Progress bar** (`flex: 1 1 220px; min-width: 200px`): label row `0` / `{pct}% of the 200k plan` / `200k` at 12px `.text-muted`, `justify-content: space-between`. Track: `height: 6px; border-radius: 99px; background: var(--color-neutral-900); overflow: hidden`. Fill: `linear-gradient(90deg, var(--color-accent-700), var(--color-accent))`, width = `min(100, round(miles / horizon * 100))%`.

#### 2c. Stat strip

`display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: var(--space-3)`. Three compact cards, each `.card .elev-sm` with `padding: var(--space-3) var(--space-4); gap: var(--space-1)`:

| Card | Kicker (`.card-kicker`) | Value line |
| --- | --- | --- |
| 1 | Overdue | `{count}` at 22px heading font + `{count} services · ${lo}–{hi}` at 12px muted |
| 2 | Due within 3,000 mi | same shape |
| 3 | Next milestone | `{mileage}` at 22px + `mi · {delta} mi away` at 12px muted |

Card 1 only carries `border-left: 2px solid var(--color-accent)`. Value/meta line is `display: flex; align-items: baseline; gap: 6px`. Deliberately single-line and short — an earlier taller 4-card version was rejected for pushing content down.

#### 2d. View switcher + filters

`display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; margin: var(--space-6) 0 var(--space-4)`.

- **Segmented control** — `.seg` with three `.seg-opt` radio labels: `ph-squares-four` Dashboard, `ph-git-commit` Timeline, `ph-list-checks` Service log.
- **Filter chips** (`margin-left: auto`, `gap: 6px`): All / `Overdue {n}` / `Due soon {n}` / Upcoming / `Complete {n}`. Rendered as `.tag` buttons with `border: 1px solid transparent; cursor: pointer; font-family: var(--font-body)`. Selected chip = `.tag-accent`; unselected = `.tag-neutral`. **Contrast note:** unselected chips were originally `.tag-outline` and failed legibility on the dark ground — filled neutral is required.

#### 2e. "Needs attention now" card

Shown only when overdue + due-soon count > 0. `.card .elev-md`, `padding: var(--space-6)`, `gap: var(--space-4)`, `margin-bottom: var(--space-8)`.

Header row (`flex-wrap: wrap; gap: var(--space-3); align-items: center`): `h4` "Needs attention now" with a leading `ph-warning-circle` in `--color-accent` (`margin-right: 6px`); then `{n} overdue, {m} coming up` at 13px muted; then `.btn.btn-primary` "Mark all complete" with `ph-checks` at `margin-left: auto`.

**Service row** (used here and inside mileage groups): a `<label>` at `display: grid; grid-template-columns: auto 1fr; gap: var(--space-4); align-items: start; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer`. Hover `background: color-mix(in srgb, var(--color-text) 6%, transparent)`. Overdue rows get `background: color-mix(in srgb, var(--color-accent) 8%, transparent)`.

- Checkbox: `width: 18px; height: 18px; margin-top: 3px`, `accent-color: #9184d9`.
- Right side (`flex-wrap: wrap; gap: 4px var(--space-4); align-items: baseline`):
  - Text block (`flex: 1 1 240px`): service name at 14.5–15px in heading font; note at 12px muted (e.g. "0W-20 full synthetic, 3.7 qt").
  - Meta cluster (`gap: 6px`): status `.tag`, mileage `.tag-neutral` (`"60,000 mi"`), then `{cost estimate} · {DIY difficulty}` at 12px muted.

#### 2f. Mileage plan

Section header: `h4` "Mileage plan" + `{n} mileage points to 200,000` at 12px muted + `.btn.btn-ghost` "Expand all" / "Collapse all" at `margin-left: auto`. Row is `display: flex; align-items: baseline; gap: var(--space-4); margin-bottom: var(--space-3)`.

List: `display: flex; flex-direction: column; gap: var(--space-2)`. One card per distinct mileage point, `padding: 0; gap: 0; box-shadow: var(--shadow-sm); overflow: hidden`.

**Group header** — `flex-wrap: wrap; gap: var(--space-3); align-items: center; padding: var(--space-4) var(--space-6); cursor: pointer; border-left: 2px solid {mark}`. Hover `background: color-mix(in srgb, var(--color-text) 4%, transparent)`. Contents:

1. Caret icon (`ph-caret-down` open / `ph-caret-right` closed) at `opacity: .55`.
2. Mileage label, heading font 19px, `min-width: 92px`.
3. Status indicator (see status treatment table).
4. Summary at 13px muted: `"4 services · 2 done"`.
5. Right cluster (`margin-left: auto; gap: var(--space-3)`): cost range at 13px muted, then `.btn.btn-secondary` with `ph-checks` labelled `"Mark {n}"` (n = incomplete in group) or `"Done"`. **This button must `stopPropagation`** so it doesn't collapse the group.

**Group body** (when open) — `padding: 0 var(--space-6) var(--space-4) 40px; gap: 2px`. Service rows as in 2e, minus the mileage tag (redundant), checkbox 17px, `padding: var(--space-2) var(--space-3)`. Complete rows render at `opacity: .5` with `text-decoration: line-through` on the name.

**Group status treatment** (this was iterated on specifically — get it right):

| Group state | Left mark | Card background | Mileage number color | Status indicator |
| --- | --- | --- | --- | --- |
| Any item overdue | `var(--color-accent)` | `color-mix(in srgb, var(--color-accent) 6%, var(--color-surface))` | `var(--color-text)` | `.tag.tag-accent` "Overdue" |
| Any item due soon (none overdue) | `var(--color-accent-700)` | `var(--color-surface)` | `var(--color-text)` | `.tag.tag-outline` "Due soon" |
| All upcoming | `transparent` | `var(--color-surface)` | `var(--color-text)` | `.tag.tag-neutral` "Upcoming" |
| **All items complete** | `var(--color-accent-700)` | `color-mix(in srgb, var(--color-accent) 5%, var(--color-surface))` | `var(--color-accent-300)` | **Replaces the tag:** `ph-check-circle` (16px, `--color-accent`) + "All done" at 12px in `--color-accent-300`, inline-flex, `gap: 5px` |

The completed treatment is intentionally a *lighter* tint than overdue (5% vs 6%) with a *deeper* accent mark, so completion reads as resolved rather than urgent.

**Default expansion:** a group is open unless every item in it is complete. User toggles override the default and persist for the session.

---

### 3. Timeline view

An odometer track. Per node: `display: grid; grid-template-columns: 96px 1fr; gap: var(--space-6); align-items: start`.

- Left rail: mileage label, right-aligned, heading font 15px, `padding-top: 10px`. Color is `--color-text`, or `color-mix(in srgb, var(--color-text) 55%, transparent)` for upcoming groups.
- Right: `border-left: 1px solid var(--color-divider); padding: 0 0 var(--space-6) var(--space-6); position: relative`. A dot at `position: absolute; left: -5px; top: 14px; width: 9px; height: 9px; border-radius: 50%; background: {group mark}; box-shadow: 0 0 0 3px var(--color-bg)`.
- Items render as clickable `.tag.tag-neutral` pills (`flex-wrap: wrap; gap: 6px`) that toggle completion; complete pills get `opacity: .5` + line-through.
- **"You are here" marker**: injected as its own node before the first group whose mileage exceeds the odometer. `.tag.tag-outline` reading `"You are here — 80,000 mi"`, followed by a 1px `linear-gradient(to right, var(--color-accent), transparent)` rule filling the remaining width.

---

### 4. Service log view

`.card .elev-sm` with `padding: var(--space-4) 0; overflow-x: auto`, containing a `.table` at `min-width: 620px`.

Columns: **Mileage** (heading font, `white-space: nowrap`) · **Service** (name + 12px muted note beneath) · **Source** (`.tag-neutral` "Schedule" or `.tag-outline` "Custom") · **Cost est.** (muted, nowrap) · action (`.btn.btn-ghost` "Undo" for scheduled, "Remove" for custom, right-aligned).

Rows = all completed scheduled occurrences (sorted by the mileage at which they were actually marked done, not the scheduled mileage) plus all custom entries, **descending by mileage**.

---

### 5. Custom entry dialog

`.dialog-backdrop` > `.dialog`.

- `.dialog-title` "Log a custom service"
- `.dialog-body` "Anything you did that isn't on the factory schedule — a repair, an upgrade, an early fluid change."
- `.field` "What did you do?" — placeholder `Rear caliper rebuild`
- Grid `repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-3)`: "At mileage" (numeric, **prefilled with current odometer**), "Cost" (numeric, placeholder `180`)
- `.field` "Notes" — `<textarea class="input">`, placeholder `Parts, fluids, who did the work`
- `.dialog-actions`: `.btn-secondary` Cancel, `.btn-primary` "Add to log" with `ph-plus`. Submit is a no-op if the name is empty.

---

### 6. Garage dialog

`.dialog` at `width: min(520px, 100%)`, title "Your garage".

**Vehicle list** — one row per saved vehicle: `display: flex; gap: var(--space-3); align-items: center; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer; box-shadow: inset 0 0 0 1px {ring}`. Hover `color-mix(in srgb, var(--color-text) 6%, transparent)`.

- `ph-car-profile` at 22px — `--color-accent` if active, `--color-neutral-600` otherwise.
- Title `{year} {make} {model}` heading font 15px; sub `{engine} · {miles} mi` at 12px muted.
- `.tag.tag-accent` "Active" for the current vehicle, else `.tag.tag-neutral` showing the nickname or "Saved".
- `.btn.btn-icon.btn-secondary` with `ph-trash`. **Must `stopPropagation`.** Deleting the active vehicle falls back to the first remaining; deleting the last one returns to the empty state.

Then `.hr`, then the same vehicle-creation fields as the empty state in two `repeat(auto-fit, minmax(120px,1fr))` grids (Year/Make/Model, then Engine/Odometer).

`.dialog-actions`: `.btn-ghost` "Clear all data" (wipes persistence, returns to empty state), `.btn-secondary` "Close", `.btn-primary` "Add vehicle" with `ph-plus`.

---

## Interactions & Behavior

**Status derivation** — for each scheduled occurrence, in order:
1. present in the completed map → `done`
2. `occurrence.mileage <= vehicle.miles` → `over`
3. `occurrence.mileage <= vehicle.miles + dueWindow` → `due`
4. otherwise → `up`

**Occurrence generation** — for each schedule definition with interval `every` and optional `first` (defaults to `every`), emit an occurrence at `first, first + every, first + 2·every, …` up to and including the horizon (200,000). Sort by mileage, then name. For a 7,500 mi oil change to 200k that is 26 occurrences; the full Accord schedule generates ~120 occurrences across ~40 distinct mileage points. Note some items (coolant) use `first: 100000, every: 50000`.

**Toggling** — clicking a checkbox or timeline pill toggles that occurrence. Marking complete records `{ at: currentOdometer }` so the log can show *when* it was actually done vs. when it was scheduled. Unchecking deletes the record.

**Bulk marking** — "Mark all complete" (attention card) marks every overdue + due-soon occurrence. "Mark {n}" (group header) marks every incomplete occurrence at that mileage point. Both skip already-complete items rather than re-stamping them.

**Odometer editing** — strips non-digits, coerces to number, writes to the vehicle, persists. Every status, count, cost total, progress percentage, group treatment, and the timeline "you are here" position recomputes from it.

**Filtering** — filters the occurrence list before grouping, so a filter of "Overdue" shows only mileage points containing overdue items, with only those items inside.

**Save** — persistence is already automatic on every mutation; the explicit Save button is reassurance. It re-persists and flips its label to "Saved" for 1600ms.

**Responsive** — no media queries; every layout is `flex-wrap` or `grid` `auto-fit` with `minmax()`, and type uses `clamp()`. The nav wraps to multiple rows, the stat strip collapses to one column, the header row stacks, and the log table scrolls horizontally inside its card (`min-width: 620px`). Hit targets stay ≥ 40px via the `.btn` and `.input` min-heights. **Keep this approach** — the design was validated by resizing, not at breakpoints.

**States not yet designed** (call these out to the product owner): loading, network error, schedule-not-found for an unlisted vehicle, and validation messaging beyond the silent empty-name guard.

---

## State Management

```
{
  vehicles: Vehicle[] | null,   // null = not yet hydrated; [] = empty state
  activeId: string | null,
  view: 'dash' | 'timeline' | 'log',
  filter: 'all' | 'over' | 'due' | 'up' | 'done',
  dialog: null | 'custom' | 'garage',
  open: { [mileage: number]: boolean },   // group expansion overrides
  saveTick: 0 | 1,                        // drives the "Saved" label
  f: VehicleForm,                          // the shared create-vehicle form
  c: CustomEntryForm
}
```

`Vehicle`:

```
{
  id: string,
  year: number, make: string, model: string, engine: string,
  nickname: string,
  miles: number,
  done: { [occurrenceKey: string]: { at: number } },   // key = `${defId}@${scheduledMileage}`
  custom: { id, name, mileage, cost, note }[]
}
```

**Persistence:** `localStorage` key `odograph.v1` holding `{ vehicles, activeId }`, written on every mutation, read once on mount. On hydration failure or absence, seed with demo data. In production this should be a user-scoped API; keep the same shape.

**Derived per render** (never stored): occurrences, statuses, counts, cost sums, groups, timeline nodes, log rows, progress percentage.

**Tunable parameters** exposed as props in the prototype: `dueWindow` (default 3000, range 500–10000 step 500) and `horizon` (default 200000, options 100000 / 150000 / 200000 / 250000).

---

## Data Model — Schedule source

The prototype hardcodes two things a real app needs to source properly:

**1. Vehicle catalog** — nested `make → model → engine[]`. Prototype covers Honda (Accord, Civic, CR-V), Toyota (Camry, Corolla, RAV4), Ford (F-150, Escape), Subaru (Outback, Forester), Mazda (Mazda3, CX-5). Years 2000–2026 as a plain descending list. Production wants a VIN decode or a licensed catalog (NHTSA vPIC is free for decode).

**2. Maintenance schedules** — keyed `make|model|engine`, with a `generic` fallback. Each definition:

```
{ id, name, every, first?, cost: [lo, hi], diy: 'Easy'|'Medium'|'Hard', note? }
```

The 2018 Honda Accord 1.5L Turbo (gas) schedule used in the demo, in full:

| id | Name | Interval | Cost est. | DIY | Note |
| --- | --- | --- | --- | --- | --- |
| oil | Engine oil & filter | 7,500 | $45–95 | Easy | 0W-20 full synthetic, 3.7 qt |
| rot | Tire rotation | 7,500 | $0–30 | Easy | Torque to 80 lb-ft |
| insp | Multi-point inspection | 15,000 | $0–40 | Easy | Brakes, hoses, suspension, fluid levels |
| cab | Dust & pollen filter | 15,000 | $18–45 | Easy | Behind the glovebox, 5 minutes |
| air | Engine air cleaner element | 30,000 | $25–60 | Easy | |
| cvt | CVT fluid | 30,000 | $120–200 | Medium | Honda HCF-2 only — no substitutes |
| bf | Brake fluid | 45,000 | $90–150 | Medium | Or every 3 years, whichever comes first |
| pads | Brake pads & rotors | 50,000 | $300–650 | Medium | Interval varies with driving style |
| tire | Tires — replace set | 50,000 | $600–900 | Hard | |
| belt | Drive belt inspection | 60,000 | $0–40 | Medium | |
| batt | 12V battery | 60,000 | $150–250 | Easy | |
| ac | A/C system service | 75,000 | $120–250 | Medium | Refrigerant charge and cabin airflow check |
| cool | Engine coolant | first 100,000 then 50,000 | $110–180 | Medium | Honda Type 2, pre-mixed |
| plug | Spark plugs | 100,000 | $180–320 | Hard | Iridium, 1.5L turbo |
| valve | Valve clearance inspection | 100,000 | $250–450 | Hard | Adjust if noisy |

**These intervals are approximations, not verified factory data.** Replace them with a licensed schedule source before shipping, and surface the source to the user. Real schedules also branch on severe-duty vs. normal-duty service and on time as well as mileage (brake fluid "or 3 years") — the prototype models mileage only. Adding a time axis is the single largest modelling gap.

Cost ranges are US-market ballparks and should be regionalised or removed.

**Demo seed data** (2018 Accord at 80,000 mi): oil + rotation marked done every 7,500 to 75,000; inspection + cabin filter every 15,000 to 75,000; air filter at 30k and 60k; CVT fluid @30k done at 31,200; brake fluid @45k done at 46,100; pads @50k at 51,800; tires @50k at 52,000; drive belt @60k at 60,400; battery @60k at 61,900. Custom entries: "Rear brake caliper rebuild" @68,432 / $180 / "Seized slide pins, new seals + fluid flush", and "Transmission drain & fill (early)" @55,100 / $145. This deliberately leaves **CVT fluid @60,000 and A/C service @75,000 overdue**, with oil + rotation due at 82,500 — so the dashboard demonstrates all four states on load. A second vehicle (2020 Toyota RAV4 2.5L, 34,120 mi) exists to demonstrate the garage.

---

## Design Tokens

All values come from the **Nocturne** design system (`styles.css`, included in this bundle). Read them from the CSS custom properties — do not hard-code.

**Core colors**

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#161826` | Page ground |
| `--color-text` | `#e9e9ed` | Body text |
| `--color-accent` | `#9184d9` | The single accent — lines, marks, icons, glows |
| `--color-surface` | see sheet | Card fill |
| `--color-divider` | see sheet | 1px rules |

Plus 100–900 OKLCH tonal ramps: `--color-neutral-*`, `--color-accent-*`, `--color-accent-2-*` (mono scheme — accent-2 is a stand-in, treat as one role). Used here: `accent-300` (accent-colored text — the accent itself is only 3:1 and fails for body-size copy), `accent-400`, `accent-700` (progress fill start, completed group mark), `neutral-600`, `neutral-700`, `neutral-800`, `neutral-900` (progress track).

One non-token value appears intentionally: `#1d2033` as the origin stop of the page radial gradient.

**Spacing** — `--space-1` … `--space-8`, a compact 0.70× density scale. Used throughout; never raw px for layout gaps.

**Type** — `--font-heading` and `--font-body` are both Inter. Headings stay at weight 500 — hierarchy comes from size and space, never from bolding. Sizes in use: `clamp(30px,6vw,44px)` and `clamp(26px,4.4vw,40px)` (H1s), 22px (stat values), 19px (mileage labels), 15px / 14.5px (row titles), 13px (secondary), 12px (meta, kickers).

**Radius** — `--radius-md` (8px base) for rows and cards; `99px` only for the pill progress track.

**Shadow** — `--shadow-sm` / `--shadow-md` via `.elev-sm` / `.elev-md`. Never stack shadows; on a dark ground elevation is an edge plus ambient darkness.

**Nocturne rules honored here** (keep them): primary buttons are accent *outlines*, never fills; the accent is never flooded across a large area; keyboard focus is `outline: 2px solid var(--color-accent); outline-offset: 2px` — never the browser default; hover and pressed states come from the accent ramp; no pure black or pure white; layouts are flush-left and asymmetric.

---

## Assets

- **Icons:** [Phosphor Icons](https://phosphoricons.com) regular weight, loaded in the prototype from `https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css`. Icons used: `gauge`, `car-profile`, `caret-down`, `caret-right`, `plus`, `check-circle`, `checks`, `warning-circle`, `squares-four`, `git-commit`, `list-checks`, `arrow-right`, `trash`. Swap for the codebase's existing icon package if it has one; otherwise install `@phosphor-icons/react` or equivalent rather than hotlinking a CDN.
- **Fonts:** Inter (heading and body). Self-host or use the codebase's existing loader.
- **Images:** none. No photography, no illustration.
- **Checkbox accent:** native inputs with `accent-color: #9184d9`.

---

## Files

| File | What it is |
| --- | --- |
| `Service Tracker.dc.html` | The design prototype. Proprietary streaming-component format (template markup + a `class Component extends DCLogic` logic class). **Reference only** — read it for exact markup, styles, and the derivation logic; do not port it directly. All schedule data and seed data live in the logic class near the top. |
| `styles.css` | Nocturne design system: token sheet + component layer (`.btn`, `.card`, `.tag`, `.field`, `.input`, `.seg`, `.nav`, `.table`, `.dialog`, `.elev-*`, `.text-muted`). **Directly reusable.** |
| `README.md` | This document. |
| `screenshots/` | Rendered captures of the prototype for visual reference: `01-dashboard-top.png`, `02-dashboard-mileage-plan.png`, `03-timeline-view.png`, `04-service-log-view.png`, `05-custom-entry-dialog.png`, `06-garage-dialog.png`. All show the demo 2018 Honda Accord 1.5T at 80,000 mi. |

`support.js` (the prototype's runtime) is deliberately not included — it is environment-specific and irrelevant to the rebuild.

## Suggested build order

1. Token layer — import `styles.css` or map its variables into the codebase's theme.
2. Data layer — the catalog + schedule tables and the `occurrences()` / `statusOf()` derivation, as pure functions with unit tests. This is where the logic actually lives; get it right before any UI.
3. Vehicle store + persistence.
4. Dashboard: header, vehicle row, stat strip, attention card, mileage plan. This is the whole product; ship it first.
5. Custom entry and garage dialogs.
6. Timeline and log views.
