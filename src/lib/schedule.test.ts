import { describe, expect, it } from 'vitest';
import { seedVehicles } from '../data/seed';
import { scheduleFor } from '../data/schedules';
import type { Occurrence, Vehicle } from '../types';
import { buildGroups, buildLog, buildTimeline } from './plan';
import { bucketByStatus, groupStatus, nextMilestone, occurrencesFor, occurrencesFrom, statusOf, sumCost } from './schedule';

const HORIZON = 200000;
const WINDOW = 3000;

const accord = () => seedVehicles()[0];

describe('occurrence generation', () => {
  it('emits every interval up to and including the horizon', () => {
    const occ = occurrencesFrom(
      [{ id: 'oil', name: 'Engine oil & filter', every: 7500, cost: [45, 95], diy: 'Easy' }],
      HORIZON,
    );
    expect(occ).toHaveLength(26);
    expect(occ[0].mileage).toBe(7500);
    expect(occ.at(-1)!.mileage).toBe(195000);
    expect(occ[0].key).toBe('oil@7500');
  });

  it('honours `first` when it differs from the interval', () => {
    const occ = occurrencesFrom(
      [{ id: 'cool', name: 'Engine coolant', first: 100000, every: 50000, cost: [110, 180], diy: 'Medium' }],
      HORIZON,
    );
    expect(occ.map((o) => o.mileage)).toEqual([100000, 150000, 200000]);
  });

  it('sorts by mileage, then name', () => {
    const occ = occurrencesFor(accord(), HORIZON);
    for (let i = 1; i < occ.length; i++) {
      const prev = occ[i - 1];
      const cur = occ[i];
      expect(prev.mileage <= cur.mileage).toBe(true);
      if (prev.mileage === cur.mileage) expect(prev.name.localeCompare(cur.name)).toBeLessThanOrEqual(0);
    }
  });

  it('generates the full Accord plan: 117 occurrences over 29 mileage points', () => {
    const occ = occurrencesFor(accord(), HORIZON);
    expect(occ.length).toBe(
      scheduleFor(accord()).reduce((n, d) => {
        const first = d.first || d.every;
        return n + Math.max(0, Math.floor((HORIZON - first) / d.every) + 1);
      }, 0),
    );
    expect(occ).toHaveLength(117);
    expect(new Set(occ.map((o) => o.mileage)).size).toBe(29);
  });
});

describe('statusOf', () => {
  const v = accord(); // 80,000 mi
  const at = (mileage: number, key = `x@${mileage}`): Occurrence => ({
    key,
    defId: 'x',
    name: 'Test',
    mileage,
    cost: [0, 0],
    diy: 'Easy',
  });

  it('reports completion first, whatever the mileage', () => {
    expect(statusOf(at(30000, 'cvt@30000'), v, WINDOW)).toBe('done');
  });

  it('reports passed-and-unchecked as overdue, including exactly at the odometer', () => {
    expect(statusOf(at(60000), v, WINDOW)).toBe('over');
    expect(statusOf(at(80000), v, WINDOW)).toBe('over');
  });

  it('reports the due window inclusively', () => {
    expect(statusOf(at(82500), v, WINDOW)).toBe('due');
    expect(statusOf(at(83000), v, WINDOW)).toBe('due');
    expect(statusOf(at(83001), v, WINDOW)).toBe('up');
  });
});

describe('the demo vehicle shows all four states', () => {
  const v = accord();
  const occ = occurrencesFor(v, HORIZON);
  const buckets = bucketByStatus(occ, v, WINDOW);

  it('leaves CVT fluid @60,000 and A/C @75,000 overdue', () => {
    expect(buckets.over.map((o) => o.key).sort()).toEqual(['ac@75000', 'cvt@60000']);
  });

  it('has oil and rotation due at 82,500', () => {
    expect(buckets.due.map((o) => o.key).sort()).toEqual(['oil@82500', 'rot@82500']);
  });

  it('has completed and upcoming work too', () => {
    expect(buckets.done.length).toBeGreaterThan(0);
    expect(buckets.up.length).toBeGreaterThan(0);
  });

  it('puts the next milestone at 82,500', () => {
    expect(nextMilestone(occ, v.miles)!.mileage).toBe(82500);
  });

  it('sums cost ranges across a bucket', () => {
    // CVT fluid $120–200 + A/C service $120–250
    expect(sumCost(buckets.over)).toEqual([240, 450]);
  });
});

describe('groupStatus', () => {
  it('takes the most urgent status present, and "done" only when all are', () => {
    expect(groupStatus(['done', 'done'])).toBe('done');
    expect(groupStatus(['done', 'over', 'due'])).toBe('over');
    expect(groupStatus(['done', 'due', 'up'])).toBe('due');
    expect(groupStatus(['up', 'up'])).toBe('up');
  });
});

describe('buildGroups', () => {
  const v = accord();
  const occ = occurrencesFor(v, HORIZON);

  it('groups by mileage point and defaults completed groups closed', () => {
    const groups = buildGroups(occ, v, WINDOW, 'all', {});
    const g60 = groups.find((g) => g.mileage === 60000)!;
    expect(g60.status).toBe('over');
    expect(g60.open).toBe(true);
    expect(g60.markLabel).toBe('Mark 1');

    const g7500 = groups.find((g) => g.mileage === 7500)!;
    expect(g7500.isDone).toBe(true);
    expect(g7500.open).toBe(false);
    expect(g7500.markLabel).toBe('Done');
    expect(g7500.mileColor).toBe('var(--color-accent-300)');
    expect(g7500.mark).toBe('var(--color-accent-700)');
  });

  it('lets a user override the default expansion', () => {
    const groups = buildGroups(occ, v, WINDOW, 'all', { 7500: true, 60000: false });
    expect(groups.find((g) => g.mileage === 7500)!.open).toBe(true);
    expect(groups.find((g) => g.mileage === 60000)!.open).toBe(false);
  });

  it('filters before grouping, so only matching items survive', () => {
    const groups = buildGroups(occ, v, WINDOW, 'over', {});
    expect(groups.map((g) => g.mileage)).toEqual([60000, 75000]);
    expect(groups.every((g) => g.items.every((i) => i.status === 'over'))).toBe(true);
  });

  it('summarises counts and completion', () => {
    const g75 = buildGroups(occ, v, WINDOW, 'all', {}).find((g) => g.mileage === 75000)!;
    expect(g75.summary).toBe(`${g75.items.length} services · ${g75.items.length - 1} done`);
  });
});

describe('buildTimeline', () => {
  it('injects a "you are here" node before the first group past the odometer', () => {
    const v = accord();
    const groups = buildGroups(occurrencesFor(v, HORIZON), v, WINDOW, 'all', {});
    const nodes = buildTimeline(groups, v.miles);
    const idx = nodes.findIndex((n) => n.kind === 'now');
    expect(idx).toBeGreaterThan(0);
    const before = nodes[idx - 1];
    const after = nodes[idx + 1];
    expect(before.kind === 'group' && before.mileage <= v.miles).toBe(true);
    expect(after.kind === 'group' && after.mileage > v.miles).toBe(true);
    expect(nodes.filter((n) => n.kind === 'now')).toHaveLength(1);
  });
});

describe('buildLog', () => {
  const v = accord();
  const rows = buildLog(occurrencesFor(v, HORIZON), v, WINDOW);

  it('sorts descending by the mileage work was actually done at', () => {
    const miles = rows.map((r) => Number(r.mileLabel.replace(/[^0-9]/g, '')));
    expect([...miles].sort((a, b) => b - a)).toEqual(miles);
  });

  it('places a service done late by its actual mileage, not its scheduled one', () => {
    // Brake fluid scheduled at 45,000 was done at 46,100.
    const bf = rows.find((r) => r.name === 'Brake fluid')!;
    expect(bf.mileLabel).toBe('46,100 mi');
  });

  it('includes custom entries, tagged as custom', () => {
    const custom = rows.filter((r) => r.src === 'Custom');
    expect(custom.map((r) => r.name)).toEqual([
      'Rear brake caliper rebuild',
      'Transmission drain & fill (early)',
    ]);
    expect(custom[0].costLabel).toBe('$180');
  });
});

describe('an unlisted vehicle falls back to the generic schedule', () => {
  it('still produces a plan', () => {
    const v: Vehicle = {
      id: 'x',
      year: 2015,
      make: 'Ford',
      model: 'F-150',
      engine: '5.0L V8 (gas)',
      nickname: '',
      miles: 42000,
      done: {},
      custom: [],
    };
    expect(occurrencesFor(v, HORIZON).length).toBeGreaterThan(0);
  });
});
