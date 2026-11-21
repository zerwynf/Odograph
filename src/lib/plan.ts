import type { CustomEntry, FilterId, Occurrence, Status, Vehicle } from '../types';
import { fmtCost, fmtMi } from './format';
import { groupStatus, statusOf, sumCost } from './schedule';

/** Status -> label and tag class. Deliberately the only place these are decided. */
export const STATUS_META: Record<Status, { label: string; tag: string; mark: string }> = {
  done: { label: 'Complete', tag: 'tag-neutral', mark: 'var(--color-neutral-800)' },
  over: { label: 'Overdue', tag: 'tag-accent', mark: 'var(--color-accent)' },
  due: { label: 'Due soon', tag: 'tag-outline', mark: 'var(--color-accent-700)' },
  up: { label: 'Upcoming', tag: 'tag-neutral', mark: 'transparent' },
};

export interface ItemVM {
  key: string;
  name: string;
  note: string;
  diy: string;
  mileage: number;
  status: Status;
  done: boolean;
  statusLabel: string;
  tagCls: string;
  mileLabel: string;
  costLabel: string;
  opacity: number;
  deco: 'line-through' | 'none';
  /** Overdue rows carry a faint accent wash; everything else is transparent. */
  rowBg: string;
}

export function itemVM(o: Occurrence, v: Vehicle, dueWindow: number): ItemVM {
  const status = statusOf(o, v, dueWindow);
  const m = STATUS_META[status];
  return {
    key: o.key,
    name: o.name,
    note: o.note ?? '',
    diy: o.diy ?? '—',
    mileage: o.mileage,
    status,
    done: status === 'done',
    statusLabel: m.label,
    tagCls: m.tag,
    mileLabel: `${fmtMi(o.mileage)} mi`,
    costLabel: fmtCost(o.cost[0], o.cost[1]),
    opacity: status === 'done' ? 0.5 : 1,
    deco: status === 'done' ? 'line-through' : 'none',
    rowBg: status === 'over' ? 'color-mix(in srgb, var(--color-accent) 8%, transparent)' : 'transparent',
  };
}

export interface GroupVM {
  mileage: number;
  mileLabel: string;
  status: Status;
  statusLabel: string;
  tagCls: string;
  /** The 2px left mark on the card, and the timeline dot. */
  mark: string;
  dotColor: string;
  bg: string;
  mileColor: string;
  isDone: boolean;
  summary: string;
  costLabel: string;
  open: boolean;
  items: ItemVM[];
  /** Keys of the incomplete items — what "Mark n" marks. */
  remainingKeys: string[];
  markLabel: string;
}

/**
 * Filters, then groups by mileage point. Filtering happens before grouping, so
 * a filter shows only the mileage points that contain matching items, with only
 * those items inside.
 */
export function buildGroups(
  occ: Occurrence[],
  v: Vehicle,
  dueWindow: number,
  filter: FilterId,
  openOverrides: Record<number, boolean>,
): GroupVM[] {
  const byMile = new Map<number, Occurrence[]>();
  for (const o of occ) {
    if (filter !== 'all' && filter !== statusOf(o, v, dueWindow)) continue;
    const list = byMile.get(o.mileage);
    if (list) list.push(o);
    else byMile.set(o.mileage, [o]);
  }

  return [...byMile.keys()]
    .sort((a, b) => a - b)
    .map((mi) => {
      const list = byMile.get(mi)!;
      const items = list.map((o) => itemVM(o, v, dueWindow));
      const gst = groupStatus(items.map((i) => i.status));
      const m = STATUS_META[gst];
      const [lo, hi] = sumCost(list);
      const remaining = items.filter((i) => !i.done);
      const doneCount = items.length - remaining.length;
      // Completed groups collapse by default; a user toggle overrides that.
      const open = openOverrides[mi] === undefined ? gst !== 'done' : openOverrides[mi];
      const mark = gst === 'done' ? 'var(--color-accent-700)' : m.mark;
      return {
        mileage: mi,
        mileLabel: `${fmtMi(mi)} mi`,
        status: gst,
        statusLabel: m.label,
        tagCls: m.tag,
        mark,
        dotColor: mark === 'transparent' ? 'var(--color-neutral-800)' : mark,
        // The completed tint is lighter than overdue (5% vs 6%) with a deeper
        // mark, so completion reads as resolved rather than urgent.
        bg:
          gst === 'over'
            ? 'color-mix(in srgb, var(--color-accent) 6%, var(--color-surface))'
            : gst === 'done'
              ? 'color-mix(in srgb, var(--color-accent) 5%, var(--color-surface))'
              : 'var(--color-surface)',
        mileColor: gst === 'done' ? 'var(--color-accent-300)' : 'var(--color-text)',
        isDone: gst === 'done',
        summary: `${items.length} ${items.length === 1 ? 'service' : 'services'} · ${doneCount} done`,
        costLabel: fmtCost(lo, hi),
        open,
        items,
        remainingKeys: remaining.map((i) => i.key),
        markLabel: remaining.length ? `Mark ${remaining.length}` : 'Done',
      };
    });
}

export type TimelineNode =
  | { kind: 'now' }
  | {
      kind: 'group';
      mileage: number;
      mileLabel: string;
      statusLabel: string;
      tagCls: string;
      costLabel: string;
      dotColor: string;
      labelColor: string;
      items: ItemVM[];
    };

/** The odometer track: groups in order, with a "you are here" node injected. */
export function buildTimeline(groups: GroupVM[], miles: number): TimelineNode[] {
  const nodes: TimelineNode[] = [];
  let placed = false;
  for (const g of groups) {
    if (!placed && g.mileage > miles) {
      nodes.push({ kind: 'now' });
      placed = true;
    }
    nodes.push({
      kind: 'group',
      mileage: g.mileage,
      mileLabel: g.mileLabel,
      statusLabel: g.statusLabel,
      tagCls: g.tagCls,
      costLabel: g.costLabel,
      dotColor: g.dotColor,
      labelColor:
        g.status === 'up' ? 'color-mix(in srgb, var(--color-text) 55%, transparent)' : 'var(--color-text)',
      items: g.items,
    });
  }
  return nodes;
}

export type LogRow = {
  id: string;
  mileLabel: string;
  name: string;
  note: string;
  src: 'Schedule' | 'Custom';
  srcCls: string;
  costLabel: string;
  actionLabel: 'Undo' | 'Remove';
} & ({ kind: 'scheduled'; key: string } | { kind: 'custom'; customId: string });

/**
 * Everything actually done, newest first — completed scheduled occurrences
 * sorted by the mileage at which they were marked done (not the scheduled
 * mileage), plus custom entries.
 */
export function buildLog(occ: Occurrence[], v: Vehicle, dueWindow: number): LogRow[] {
  const scheduled = occ
    .filter((o) => statusOf(o, v, dueWindow) === 'done')
    .map((o) => {
      const at = v.done[o.key]?.at ?? o.mileage;
      return {
        row: {
          id: `s:${o.key}`,
          kind: 'scheduled' as const,
          key: o.key,
          mileLabel: `${fmtMi(at)} mi`,
          name: o.name,
          note: o.note ?? '',
          src: 'Schedule' as const,
          srcCls: 'tag-neutral',
          costLabel: fmtCost(o.cost[0], o.cost[1]),
          actionLabel: 'Undo' as const,
        },
        sort: at,
      };
    });

  const custom = (v.custom ?? []).map((c: CustomEntry) => ({
    row: {
      id: `c:${c.id}`,
      kind: 'custom' as const,
      customId: c.id,
      mileLabel: `${fmtMi(c.mileage)} mi`,
      name: c.name,
      note: c.note ?? '',
      src: 'Custom' as const,
      srcCls: 'tag-outline',
      costLabel: c.cost ? `$${c.cost.toLocaleString('en-US')}` : '—',
      actionLabel: 'Remove' as const,
    },
    sort: c.mileage,
  }));

  return [...scheduled, ...custom].sort((a, b) => b.sort - a.sort).map((x) => x.row);
}
