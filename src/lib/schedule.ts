import { scheduleFor } from '../data/schedules';
import type { Occurrence, ServiceDef, Status, Vehicle } from '../types';

/**
 * Expands every schedule definition into its occurrences up to and including
 * the horizon: `first, first + every, first + 2·every, …` where `first`
 * defaults to `every`. Sorted by mileage, then name.
 */
export function occurrencesFrom(defs: ServiceDef[], horizon: number): Occurrence[] {
  const out: Occurrence[] = [];
  for (const d of defs) {
    const first = d.first || d.every;
    const push = (mileage: number) =>
      out.push({
        key: `${d.id}@${mileage}`,
        defId: d.id,
        name: d.name,
        mileage,
        cost: d.cost,
        diy: d.diy,
        note: d.note,
      });
    if (!d.every) {
      push(first);
      continue;
    }
    for (let m = first; m <= horizon; m += d.every) push(m);
  }
  return out.sort((a, b) => a.mileage - b.mileage || a.name.localeCompare(b.name));
}

export function occurrencesFor(v: Vehicle, horizon: number): Occurrence[] {
  return occurrencesFrom(scheduleFor(v), horizon);
}

/** Completion beats everything; then passed, then inside the due window. */
export function statusOf(o: Occurrence, v: Vehicle, dueWindow: number): Status {
  if (v.done && v.done[o.key]) return 'done';
  if (o.mileage <= v.miles) return 'over';
  if (o.mileage <= v.miles + dueWindow) return 'due';
  return 'up';
}

/** A mileage group takes the most urgent status present in it. */
export function groupStatus(statuses: Status[]): Status {
  if (statuses.every((s) => s === 'done')) return 'done';
  if (statuses.includes('over')) return 'over';
  if (statuses.includes('due')) return 'due';
  return 'up';
}

export function sumCost(list: Occurrence[]): [number, number] {
  return list.reduce<[number, number]>((a, o) => [a[0] + o.cost[0], a[1] + o.cost[1]], [0, 0]);
}

export type CountsByStatus = Record<Status, Occurrence[]>;

export function bucketByStatus(occ: Occurrence[], v: Vehicle, dueWindow: number): CountsByStatus {
  const counts: CountsByStatus = { over: [], due: [], done: [], up: [] };
  for (const o of occ) counts[statusOf(o, v, dueWindow)].push(o);
  return counts;
}

/** The first occurrence past the odometer — the "next milestone". */
export function nextMilestone(occ: Occurrence[], miles: number): Occurrence | undefined {
  return occ.find((o) => o.mileage > miles);
}
