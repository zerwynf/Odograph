import type { ServiceDef, Vehicle } from '../types';

/**
 * Maintenance schedules keyed `make|model|engine`, with a `generic` fallback.
 *
 * These intervals are plausible approximations, NOT verified factory data.
 * Replace them with a licensed schedule source before shipping, and surface
 * that source to the user. Real schedules also branch on severe- vs normal-duty
 * service and run on time as well as mileage ("brake fluid or 3 years"); this
 * model is mileage-only. Cost ranges are US-market ballparks.
 */
export const SCHEDULES: Record<string, ServiceDef[]> = {
  'Honda|Accord|1.5L Turbo (gas)': [
    { id: 'oil', name: 'Engine oil & filter', every: 7500, cost: [45, 95], diy: 'Easy', note: '0W-20 full synthetic, 3.7 qt' },
    { id: 'rot', name: 'Tire rotation', every: 7500, cost: [0, 30], diy: 'Easy', note: 'Torque to 80 lb-ft' },
    { id: 'insp', name: 'Multi-point inspection', every: 15000, cost: [0, 40], diy: 'Easy', note: 'Brakes, hoses, suspension, fluid levels' },
    { id: 'cab', name: 'Dust & pollen filter', every: 15000, cost: [18, 45], diy: 'Easy', note: 'Behind the glovebox, 5 minutes' },
    { id: 'air', name: 'Engine air cleaner element', every: 30000, cost: [25, 60], diy: 'Easy' },
    { id: 'cvt', name: 'CVT fluid', every: 30000, cost: [120, 200], diy: 'Medium', note: 'Honda HCF-2 only — no substitutes' },
    { id: 'bf', name: 'Brake fluid', every: 45000, cost: [90, 150], diy: 'Medium', note: 'Or every 3 years, whichever comes first' },
    { id: 'pads', name: 'Brake pads & rotors', every: 50000, cost: [300, 650], diy: 'Medium', note: 'Interval varies with driving style' },
    { id: 'tire', name: 'Tires — replace set', every: 50000, cost: [600, 900], diy: 'Hard' },
    { id: 'belt', name: 'Drive belt inspection', every: 60000, cost: [0, 40], diy: 'Medium' },
    { id: 'batt', name: '12V battery', every: 60000, cost: [150, 250], diy: 'Easy' },
    { id: 'ac', name: 'A/C system service', every: 75000, cost: [120, 250], diy: 'Medium', note: 'Refrigerant charge and cabin airflow check' },
    { id: 'cool', name: 'Engine coolant', first: 100000, every: 50000, cost: [110, 180], diy: 'Medium', note: 'Honda Type 2, pre-mixed' },
    { id: 'plug', name: 'Spark plugs', every: 100000, cost: [180, 320], diy: 'Hard', note: 'Iridium, 1.5L turbo' },
    { id: 'valve', name: 'Valve clearance inspection', every: 100000, cost: [250, 450], diy: 'Hard', note: 'Adjust if noisy' },
  ],
  'Toyota|RAV4|2.5L (gas)': [
    { id: 'oil', name: 'Engine oil & filter', every: 10000, cost: [50, 100], diy: 'Easy', note: '0W-16 or 0W-20, 4.8 qt' },
    { id: 'rot', name: 'Tire rotation', every: 5000, cost: [0, 30], diy: 'Easy' },
    { id: 'insp', name: 'Multi-point inspection', every: 15000, cost: [0, 40], diy: 'Easy' },
    { id: 'cab', name: 'Cabin air filter', every: 15000, cost: [18, 45], diy: 'Easy' },
    { id: 'air', name: 'Engine air filter', every: 30000, cost: [25, 60], diy: 'Easy' },
    { id: 'bf', name: 'Brake fluid', every: 60000, cost: [90, 150], diy: 'Medium' },
    { id: 'atf', name: 'Automatic transmission fluid', every: 60000, cost: [180, 320], diy: 'Hard', note: 'Toyota WS' },
    { id: 'pads', name: 'Brake pads & rotors', every: 50000, cost: [300, 650], diy: 'Medium' },
    { id: 'tire', name: 'Tires — replace set', every: 50000, cost: [650, 1000], diy: 'Hard' },
    { id: 'batt', name: '12V battery', every: 60000, cost: [150, 250], diy: 'Easy' },
    { id: 'cool', name: 'Engine coolant', first: 100000, every: 50000, cost: [110, 180], diy: 'Medium' },
    { id: 'plug', name: 'Spark plugs', every: 120000, cost: [160, 300], diy: 'Medium' },
  ],
  generic: [
    { id: 'oil', name: 'Engine oil & filter', every: 7500, cost: [45, 95], diy: 'Easy' },
    { id: 'rot', name: 'Tire rotation', every: 7500, cost: [0, 30], diy: 'Easy' },
    { id: 'insp', name: 'Multi-point inspection', every: 15000, cost: [0, 40], diy: 'Easy' },
    { id: 'cab', name: 'Cabin air filter', every: 20000, cost: [18, 45], diy: 'Easy' },
    { id: 'air', name: 'Engine air filter', every: 30000, cost: [25, 60], diy: 'Easy' },
    { id: 'bf', name: 'Brake fluid', every: 45000, cost: [90, 150], diy: 'Medium' },
    { id: 'trans', name: 'Transmission fluid', every: 60000, cost: [150, 320], diy: 'Hard' },
    { id: 'pads', name: 'Brake pads & rotors', every: 50000, cost: [300, 650], diy: 'Medium' },
    { id: 'tire', name: 'Tires — replace set', every: 50000, cost: [600, 950], diy: 'Hard' },
    { id: 'batt', name: '12V battery', every: 60000, cost: [150, 250], diy: 'Easy' },
    { id: 'cool', name: 'Engine coolant', every: 60000, cost: [110, 180], diy: 'Medium' },
    { id: 'plug', name: 'Spark plugs', every: 100000, cost: [160, 320], diy: 'Hard' },
  ],
};

/** The schedule for a vehicle, falling back to the generic plan. */
export function scheduleFor(v: Pick<Vehicle, 'make' | 'model' | 'engine'>): ServiceDef[] {
  return SCHEDULES[`${v.make}|${v.model}|${v.engine}`] ?? SCHEDULES.generic;
}
