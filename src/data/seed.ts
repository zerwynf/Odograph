import type { DoneRecord, Vehicle } from '../types';

/**
 * Demo garage: a 2018 Accord at 80,000 mi that deliberately leaves CVT fluid
 * @60,000 and A/C service @75,000 overdue, with oil and rotation due at 82,500 —
 * so the dashboard shows all four states on load. The RAV4 exists to demonstrate
 * the garage.
 */
export function seedVehicles(): Vehicle[] {
  const done: Record<string, DoneRecord> = {};
  const mark = (id: string, from: number, to: number, step: number) => {
    for (let m = from; m <= to; m += step) done[`${id}@${m}`] = { at: m };
  };
  mark('oil', 7500, 75000, 7500);
  mark('rot', 7500, 75000, 7500);
  mark('insp', 15000, 75000, 15000);
  mark('cab', 15000, 75000, 15000);
  mark('air', 30000, 60000, 30000);
  done['cvt@30000'] = { at: 31200 };
  done['bf@45000'] = { at: 46100 };
  done['pads@50000'] = { at: 51800 };
  done['tire@50000'] = { at: 52000 };
  done['belt@60000'] = { at: 60400 };
  done['batt@60000'] = { at: 61900 };

  const accord: Vehicle = {
    id: 'v1',
    year: 2018,
    make: 'Honda',
    model: 'Accord',
    engine: '1.5L Turbo (gas)',
    nickname: 'Daily',
    miles: 80000,
    done,
    custom: [
      { id: 'c1', name: 'Rear brake caliper rebuild', mileage: 68432, cost: 180, note: 'Seized slide pins, new seals + fluid flush' },
      { id: 'c2', name: 'Transmission drain & fill (early)', mileage: 55100, cost: 145, note: 'Extra HCF-2 change ahead of schedule' },
    ],
  };

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

  return [accord, rav4];
}
