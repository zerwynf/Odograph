/**
 * Vehicle catalog: make → model → engine[].
 *
 * Placeholder data. Production should source this from a VIN decode or a
 * licensed catalog — NHTSA vPIC is free for decode.
 */
export const CATALOG: Record<string, Record<string, string[]>> = {
  Honda: {
    Accord: ['1.5L Turbo (gas)', '2.0L Turbo (gas)', '2.0L Hybrid'],
    Civic: ['2.0L (gas)', '1.5L Turbo (gas)'],
    'CR-V': ['1.5L Turbo (gas)', '2.0L Hybrid'],
  },
  Toyota: {
    Camry: ['2.5L (gas)', '2.5L Hybrid'],
    Corolla: ['1.8L (gas)', '2.0L (gas)'],
    RAV4: ['2.5L (gas)', '2.5L Hybrid'],
  },
  Ford: {
    'F-150': ['5.0L V8 (gas)', '2.7L EcoBoost (gas)'],
    Escape: ['1.5L EcoBoost (gas)'],
  },
  Subaru: {
    Outback: ['2.5L (gas)', '2.4L Turbo (gas)'],
    Forester: ['2.5L (gas)'],
  },
  Mazda: {
    Mazda3: ['2.5L (gas)'],
    'CX-5': ['2.5L (gas)', '2.5L Turbo (gas)'],
  },
};

export const MAKES = Object.keys(CATALOG);

export const YEARS: number[] = (() => {
  const out: number[] = [];
  for (let y = 2026; y >= 2000; y--) out.push(y);
  return out;
})();

export function modelsFor(make: string): string[] {
  return Object.keys(CATALOG[make] ?? {});
}

export function enginesFor(make: string, model: string): string[] {
  return CATALOG[make]?.[model] ?? ['Gas'];
}
