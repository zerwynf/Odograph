import { GitCommit, ListChecks, SquaresFour } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import type { FilterId, ViewId } from '../types';

interface ViewControlsProps {
  view: ViewId;
  onView: (v: ViewId) => void;
  filter: FilterId;
  onFilter: (f: FilterId) => void;
  counts: { over: number; due: number; done: number };
}

const VIEWS: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: 'dash', label: 'Dashboard', icon: <SquaresFour /> },
  { id: 'timeline', label: 'Timeline', icon: <GitCommit /> },
  { id: 'log', label: 'Service log', icon: <ListChecks /> },
];

export function ViewControls({ view, onView, filter, onFilter, counts }: ViewControlsProps) {
  const filters: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'over', label: `Overdue ${counts.over}` },
    { id: 'due', label: `Due soon ${counts.due}` },
    { id: 'up', label: 'Upcoming' },
    { id: 'done', label: `Complete ${counts.done}` },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        alignItems: 'center',
        margin: 'var(--space-6) 0 var(--space-4)',
      }}
    >
      <div className="seg">
        {VIEWS.map((v) => (
          <label className="seg-opt" key={v.id}>
            <input type="radio" name="view" checked={view === v.id} onChange={() => onView(v.id)} />
            {v.icon}
            {v.label}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 'auto' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            // Unselected chips are filled neutral, not outlined — outlines failed
            // legibility on the dark ground.
            className={`tag tag-btn ${filter === f.id ? 'tag-accent' : 'tag-neutral'}`}
            aria-pressed={filter === f.id}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
