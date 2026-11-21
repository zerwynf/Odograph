/**
 * Vehicle catalog: make → model → generations, each with the US-market engines
 * offered across a span of model years.
 *
 * Coverage: model years 2017–2026. The five best-selling US brands of 2025
 * (Toyota, Ford, Chevrolet, Honda, Hyundai), each with its top-selling sedans
 * and SUVs, plus a few named additions (Ford Focus, F-150, Honda Odyssey,
 * Toyota Sienna, Hyundai Sonata), plus Subaru and Mazda from the original
 * prototype.
 *
 * Engine lists are simplified to the main powertrains a buyer would recognize;
 * low-volume performance trims are left out. Placeholder data — production
 * should source this from a VIN decode or a licensed catalog (NHTSA vPIC is
 * free for decode).
 *
 * Engine strings are part of the schedule key (`make|model|engine` in
 * schedules.ts), so renaming one silently drops that vehicle to the generic
 * schedule.
 */

export interface Generation {
  /** First model year, inclusive. */
  from: number;
  /** Last model year, inclusive. */
  to: number;
  engines: string[];
}

export const FIRST_YEAR = 2017;
export const LAST_YEAR = 2026;

export const CATALOG: Record<string, Record<string, Generation[]>> = {
  Chevrolet: {
    Equinox: [
      { from: 2017, to: 2017, engines: ['2.4L (gas)', '3.6L V6 (gas)'] },
      { from: 2018, to: 2020, engines: ['1.5L Turbo (gas)', '2.0L Turbo (gas)'] },
      { from: 2021, to: 2026, engines: ['1.5L Turbo (gas)'] },
    ],
    Malibu: [
      { from: 2017, to: 2018, engines: ['1.5L Turbo (gas)', '2.0L Turbo (gas)', '1.8L Hybrid'] },
      { from: 2019, to: 2022, engines: ['1.5L Turbo (gas)', '2.0L Turbo (gas)'] },
      { from: 2023, to: 2025, engines: ['1.5L Turbo (gas)'] },
    ],
    Tahoe: [
      { from: 2017, to: 2020, engines: ['5.3L V8 (gas)', '6.2L V8 (gas)'] },
      { from: 2021, to: 2026, engines: ['5.3L V8 (gas)', '6.2L V8 (gas)', '3.0L Turbo Diesel'] },
    ],
    Traverse: [
      { from: 2017, to: 2023, engines: ['3.6L V6 (gas)'] },
      { from: 2024, to: 2026, engines: ['2.5L Turbo (gas)'] },
    ],
    Trax: [
      // No 2023 model year in the US: the first generation ended with 2022,
      // the second began with 2024.
      { from: 2017, to: 2022, engines: ['1.4L Turbo (gas)'] },
      { from: 2024, to: 2026, engines: ['1.2L Turbo (gas)'] },
    ],
  },
  Ford: {
    Bronco: [{ from: 2021, to: 2026, engines: ['2.3L EcoBoost (gas)', '2.7L EcoBoost V6 (gas)'] }],
    'Bronco Sport': [{ from: 2021, to: 2026, engines: ['1.5L EcoBoost (gas)', '2.0L EcoBoost (gas)'] }],
    Escape: [
      { from: 2017, to: 2019, engines: ['1.5L EcoBoost (gas)', '2.0L EcoBoost (gas)', '2.5L (gas)'] },
      { from: 2020, to: 2026, engines: ['1.5L EcoBoost (gas)', '2.0L EcoBoost (gas)', '2.5L Hybrid'] },
    ],
    Expedition: [{ from: 2017, to: 2026, engines: ['3.5L EcoBoost V6 (gas)'] }],
    Explorer: [
      { from: 2017, to: 2019, engines: ['2.3L EcoBoost (gas)', '3.5L V6 (gas)', '3.5L EcoBoost V6 (gas)'] },
      { from: 2020, to: 2024, engines: ['2.3L EcoBoost (gas)', '3.0L EcoBoost V6 (gas)', '3.3L Hybrid'] },
      { from: 2025, to: 2026, engines: ['2.3L EcoBoost (gas)', '3.0L EcoBoost V6 (gas)'] },
    ],
    'F-150': [
      { from: 2017, to: 2020, engines: ['5.0L V8 (gas)', '2.7L EcoBoost (gas)', '3.5L EcoBoost (gas)', '3.3L V6 (gas)'] },
      { from: 2021, to: 2026, engines: ['5.0L V8 (gas)', '2.7L EcoBoost (gas)', '3.5L EcoBoost (gas)', '3.5L PowerBoost Hybrid'] },
    ],
    // Sold in the US through the 2018 model year.
    Focus: [{ from: 2017, to: 2018, engines: ['2.0L (gas)', '1.0L EcoBoost (gas)', '2.0L EcoBoost (gas)'] }],
  },
  Honda: {
    Accord: [
      { from: 2017, to: 2017, engines: ['2.4L (gas)', '3.5L V6 (gas)', '2.0L Hybrid'] },
      { from: 2018, to: 2022, engines: ['1.5L Turbo (gas)', '2.0L Turbo (gas)', '2.0L Hybrid'] },
      { from: 2023, to: 2026, engines: ['1.5L Turbo (gas)', '2.0L Hybrid'] },
    ],
    Civic: [
      { from: 2017, to: 2024, engines: ['2.0L (gas)', '1.5L Turbo (gas)'] },
      { from: 2025, to: 2026, engines: ['2.0L (gas)', '1.5L Turbo (gas)', '2.0L Hybrid'] },
    ],
    'CR-V': [
      { from: 2017, to: 2019, engines: ['1.5L Turbo (gas)', '2.4L (gas)'] },
      { from: 2020, to: 2026, engines: ['1.5L Turbo (gas)', '2.0L Hybrid'] },
    ],
    'HR-V': [
      { from: 2017, to: 2022, engines: ['1.8L (gas)'] },
      { from: 2023, to: 2026, engines: ['2.0L (gas)'] },
    ],
    Odyssey: [{ from: 2017, to: 2026, engines: ['3.5L V6 (gas)'] }],
    Pilot: [{ from: 2017, to: 2026, engines: ['3.5L V6 (gas)'] }],
  },
  Hyundai: {
    Elantra: [
      { from: 2017, to: 2020, engines: ['2.0L (gas)', '1.6L Turbo (gas)'] },
      { from: 2021, to: 2026, engines: ['2.0L (gas)', '1.6L Turbo (gas)', '1.6L Hybrid'] },
    ],
    Kona: [{ from: 2018, to: 2026, engines: ['2.0L (gas)', '1.6L Turbo (gas)'] }],
    Palisade: [
      { from: 2020, to: 2025, engines: ['3.8L V6 (gas)'] },
      { from: 2026, to: 2026, engines: ['3.5L V6 (gas)', '2.5L Turbo Hybrid'] },
    ],
    'Santa Fe': [
      { from: 2017, to: 2018, engines: ['2.4L (gas)', '2.0L Turbo (gas)', '3.3L V6 (gas)'] },
      { from: 2019, to: 2020, engines: ['2.4L (gas)', '2.0L Turbo (gas)'] },
      { from: 2021, to: 2023, engines: ['2.5L (gas)', '2.5L Turbo (gas)', '1.6L Turbo Hybrid'] },
      { from: 2024, to: 2026, engines: ['2.5L Turbo (gas)', '1.6L Turbo Hybrid'] },
    ],
    Sonata: [
      { from: 2017, to: 2019, engines: ['2.4L (gas)', '1.6L Turbo (gas)', '2.0L Turbo (gas)', '2.0L Hybrid'] },
      { from: 2020, to: 2026, engines: ['2.5L (gas)', '1.6L Turbo (gas)', '2.5L Turbo (gas)', '2.0L Hybrid'] },
    ],
    Tucson: [
      { from: 2017, to: 2018, engines: ['2.0L (gas)', '1.6L Turbo (gas)'] },
      { from: 2019, to: 2021, engines: ['2.0L (gas)', '2.4L (gas)'] },
      { from: 2022, to: 2026, engines: ['2.5L (gas)', '1.6L Turbo Hybrid', '1.6L Turbo Plug-in Hybrid'] },
    ],
  },
  Mazda: {
    'CX-5': [
      { from: 2017, to: 2018, engines: ['2.5L (gas)'] },
      { from: 2019, to: 2025, engines: ['2.5L (gas)', '2.5L Turbo (gas)'] },
      { from: 2026, to: 2026, engines: ['2.5L (gas)'] },
    ],
    Mazda3: [
      { from: 2017, to: 2018, engines: ['2.0L (gas)', '2.5L (gas)'] },
      { from: 2019, to: 2020, engines: ['2.5L (gas)'] },
      { from: 2021, to: 2026, engines: ['2.5L (gas)', '2.5L Turbo (gas)'] },
    ],
  },
  Subaru: {
    Forester: [
      { from: 2017, to: 2018, engines: ['2.5L (gas)', '2.0L Turbo (gas)'] },
      { from: 2019, to: 2026, engines: ['2.5L (gas)'] },
    ],
    Outback: [
      { from: 2017, to: 2019, engines: ['2.5L (gas)', '3.6L H6 (gas)'] },
      { from: 2020, to: 2026, engines: ['2.5L (gas)', '2.4L Turbo (gas)'] },
    ],
  },
  Toyota: {
    Camry: [
      { from: 2017, to: 2024, engines: ['2.5L (gas)', '3.5L V6 (gas)', '2.5L Hybrid'] },
      // Hybrid-only from the 2025 redesign.
      { from: 2025, to: 2026, engines: ['2.5L Hybrid'] },
    ],
    Corolla: [
      { from: 2017, to: 2018, engines: ['1.8L (gas)'] },
      { from: 2019, to: 2019, engines: ['1.8L (gas)', '2.0L (gas)'] },
      { from: 2020, to: 2022, engines: ['1.8L (gas)', '2.0L (gas)', '1.8L Hybrid'] },
      { from: 2023, to: 2026, engines: ['2.0L (gas)', '1.8L Hybrid'] },
    ],
    'Corolla Cross': [
      { from: 2022, to: 2022, engines: ['2.0L (gas)'] },
      { from: 2023, to: 2026, engines: ['2.0L (gas)', '2.0L Hybrid'] },
    ],
    Highlander: [
      { from: 2017, to: 2019, engines: ['2.7L (gas)', '3.5L V6 (gas)', '3.5L V6 Hybrid'] },
      { from: 2020, to: 2022, engines: ['3.5L V6 (gas)', '2.5L Hybrid'] },
      { from: 2023, to: 2026, engines: ['2.4L Turbo (gas)', '2.5L Hybrid'] },
    ],
    RAV4: [
      { from: 2017, to: 2025, engines: ['2.5L (gas)', '2.5L Hybrid'] },
      // Hybrid-only from the 2026 redesign.
      { from: 2026, to: 2026, engines: ['2.5L Hybrid'] },
    ],
    Sienna: [
      { from: 2017, to: 2020, engines: ['3.5L V6 (gas)'] },
      // Hybrid-only from the 2021 redesign.
      { from: 2021, to: 2026, engines: ['2.5L Hybrid'] },
    ],
  },
};

/** Newest first, as the year picker shows them. */
export const YEARS: number[] = (() => {
  const out: number[] = [];
  for (let y = LAST_YEAR; y >= FIRST_YEAR; y--) out.push(y);
  return out;
})();

const sortAlpha = (a: string, b: string) => a.localeCompare(b);

function generationFor(make: string, model: string, year: number): Generation | undefined {
  return CATALOG[make]?.[model]?.find((g) => year >= g.from && year <= g.to);
}

/** Makes with at least one model sold in that year. */
export function makesFor(year: number): string[] {
  return Object.keys(CATALOG)
    .filter((make) => modelsFor(make, year).length > 0)
    .sort(sortAlpha);
}

/** Models of a make sold in that year — the Focus is gone after 2018, etc. */
export function modelsFor(make: string, year: number): string[] {
  return Object.keys(CATALOG[make] ?? {})
    .filter((model) => generationFor(make, model, year))
    .sort(sortAlpha);
}

/** Engines offered for a model in that year. */
export function enginesFor(make: string, model: string, year: number): string[] {
  return generationFor(make, model, year)?.engines ?? [];
}
