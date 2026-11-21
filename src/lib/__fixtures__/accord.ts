import type { DoneRecord, Vehicle } from '../../types';

/**
 * Test fixture — not part of the app. A 2018 Accord at 80,000 mi, formerly in
 * the demo garage, kept because it exercises the most: overdue CVT fluid @60,000
 * and A/C service @75,000, oil and rotation due at 82,500, services done late
 * (brake fluid @45,000 done at 46,100), and custom log entries.
 */
export function accordFixture(): Vehicle {
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

  return {
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
}
