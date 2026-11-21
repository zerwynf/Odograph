import type { Vehicle } from '../types';

/**
 * Demo garage: one 2020 RAV4 at 34,120 mi. It leaves the engine air filter
 * @30,000 overdue, with tire rotation due at 35,000, so the dashboard shows all
 * four states on load.
 */
export function seedVehicles(): Vehicle[] {
  const rav4: Vehicle = {
    id: 'v2',
    year: 2020,
    make: 'Toyota',
    model: 'RAV4',
    engine: '2.5L (gas)',
    nickname: 'Weekend',
    miles: 34120,
    custom: [],
    done: {
      'oil@10000': { at: 10000 }, 'oil@20000': { at: 20500 }, 'oil@30000': { at: 30200 },
      'rot@5000': { at: 5000 }, 'rot@10000': { at: 10000 }, 'rot@15000': { at: 15300 },
      'rot@20000': { at: 20500 }, 'rot@25000': { at: 25100 }, 'rot@30000': { at: 30200 },
      'insp@15000': { at: 15300 }, 'insp@30000': { at: 30200 },
      'cab@15000': { at: 15300 }, 'cab@30000': { at: 30200 },
    },
  };

  return [rav4];
}
