import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AttentionCard } from './components/AttentionCard';
import { CustomEntryDialog } from './components/CustomEntryDialog';
import { EmptyState } from './components/EmptyState';
import { GarageDialog } from './components/GarageDialog';
import { MileagePlan } from './components/MileagePlan';
import { ServiceLogView } from './components/ServiceLogView';
import { StatStrip } from './components/StatStrip';
import { TimelineView } from './components/TimelineView';
import { TopNav } from './components/TopNav';
import { VehicleHeader } from './components/VehicleHeader';
import { ViewControls } from './components/ViewControls';
import { DEFAULT_DUE_WINDOW, DEFAULT_HORIZON } from './config';
import { fmtCost, fmtMi } from './lib/format';
import { buildGroups, buildLog, buildTimeline, itemVM } from './lib/plan';
import { bucketByStatus, nextMilestone, occurrencesFor, sumCost } from './lib/schedule';
import { useGarage } from './lib/useGarage';
import { useVehicleForm } from './lib/useVehicleForm';
import type { DialogId, FilterId, ViewId } from './types';

export interface AppProps {
  /** How far ahead of the odometer a service counts as "due soon". */
  dueWindow?: number;
  /** How far the plan runs. */
  horizon?: number;
}

export default function App({ dueWindow = DEFAULT_DUE_WINDOW, horizon = DEFAULT_HORIZON }: AppProps) {
  const garage = useGarage();
  const form = useVehicleForm();

  const [view, setView] = useState<ViewId>('dash');
  const [filter, setFilter] = useState<FilterId>('all');
  const [dialog, setDialog] = useState<DialogId | null>(null);
  // Group expansion overrides. Keyed by mileage, session-only.
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | undefined>(undefined);

  const { active } = garage;

  useEffect(() => () => window.clearTimeout(savedTimer.current), []);

  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDialog(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog]);

  const createVehicle = useCallback(() => {
    garage.addVehicle({
      year: form.form.year,
      make: form.form.make,
      model: form.form.model,
      engine: form.form.engine,
      nickname: form.form.nickname,
      miles: Number(form.form.miles || 0),
    });
    setDialog(null);
    form.reset();
  }, [garage, form]);

  const onSave = useCallback(() => {
    garage.saveNow();
    setSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1600);
  }, [garage]);

  // Everything below is derived per render — none of it is stored.
  const occurrences = useMemo(
    () => (active ? occurrencesFor(active, horizon) : []),
    [active, horizon],
  );
  const buckets = useMemo(
    () => (active ? bucketByStatus(occurrences, active, dueWindow) : null),
    [occurrences, active, dueWindow],
  );
  const groups = useMemo(
    () => (active ? buildGroups(occurrences, active, dueWindow, filter, open) : []),
    [occurrences, active, dueWindow, filter, open],
  );
  const attention = useMemo(
    () => (active && buckets ? [...buckets.over, ...buckets.due].map((o) => itemVM(o, active, dueWindow)) : []),
    [buckets, active, dueWindow],
  );
  const timeline = useMemo(
    () => (active ? buildTimeline(groups, active.miles) : []),
    [groups, active],
  );
  const logRows = useMemo(
    () => (active ? buildLog(occurrences, active, dueWindow) : []),
    [occurrences, active, dueWindow],
  );

  const anyClosed = groups.some((g) => !g.open);
  const toggleAll = useCallback(() => {
    const next: Record<number, boolean> = {};
    for (const g of groups) next[g.mileage] = anyClosed;
    setOpen(next);
  }, [groups, anyClosed]);

  const toggleOpen = useCallback(
    (mileage: number) =>
      setOpen((prev) => {
        const current = groups.find((g) => g.mileage === mileage)?.open ?? true;
        return { ...prev, [mileage]: !current };
      }),
    [groups],
  );

  // Not yet hydrated.
  if (!garage.vehicles) return <div className="page" />;

  const formProps = {
    form: form.form,
    setField: form.setField,
    setMiles: form.setMiles,
    years: form.years,
    makes: form.makes,
    models: form.models,
    engines: form.engines,
  };

  if (!active) {
    return (
      <div className="page">
        <EmptyState form={formProps} onCreate={createVehicle} onLoadDemo={garage.loadDemo} />
      </div>
    );
  }

  const over = buckets!.over;
  const due = buckets!.due;
  const overCost = sumCost(over);
  const dueCost = sumCost(due);
  const next = nextMilestone(occurrences, active.miles);

  return (
    <div className="page">
      <TopNav
        vehicleLabel={active.nickname || active.model}
        saveLabel={saved ? 'Saved' : 'Save'}
        onOpenGarage={() => setDialog('garage')}
        onOpenCustom={() => setDialog('custom')}
        onSave={onSave}
      />

      <div className="col">
        <VehicleHeader vehicle={active} horizon={horizon} onMilesChange={garage.setMiles} />

        <StatStrip
          overCount={over.length}
          overCost={fmtCost(overCost[0], overCost[1])}
          dueCount={due.length}
          dueCost={fmtCost(dueCost[0], dueCost[1])}
          dueWindowLabel={fmtMi(dueWindow)}
          nextMile={next ? fmtMi(next.mileage) : '—'}
          nextIn={next ? `${fmtMi(next.mileage - active.miles)} mi away` : 'Plan complete'}
        />

        <ViewControls
          view={view}
          onView={setView}
          filter={filter}
          onFilter={setFilter}
          counts={{ over: over.length, due: due.length, done: buckets!.done.length }}
        />

        {view === 'dash' && (
          <div>
            {attention.length > 0 && (
              <AttentionCard
                items={attention}
                overCount={over.length}
                dueCount={due.length}
                onToggle={garage.toggleItem}
                onMarkAll={() => garage.markKeys([...over, ...due].map((o) => o.key))}
              />
            )}
            <MileagePlan
              groups={groups}
              horizonLabel={fmtMi(horizon)}
              expandLabel={anyClosed ? 'Expand all' : 'Collapse all'}
              onToggleAll={toggleAll}
              onToggleOpen={toggleOpen}
              onToggleItem={garage.toggleItem}
              onMarkGroup={garage.markKeys}
            />
          </div>
        )}

        {view === 'timeline' && (
          <TimelineView nodes={timeline} milesLabel={fmtMi(active.miles)} onToggleItem={garage.toggleItem} />
        )}

        {view === 'log' && (
          <ServiceLogView rows={logRows} onUndo={garage.toggleItem} onRemoveCustom={garage.removeCustom} />
        )}
      </div>

      {dialog === 'custom' && (
        <CustomEntryDialog
          initialMileage={String(active.miles)}
          onCancel={() => setDialog(null)}
          onAdd={(entry) => {
            garage.addCustom(entry);
            setDialog(null);
          }}
        />
      )}

      {dialog === 'garage' && (
        <GarageDialog
          vehicles={garage.vehicles}
          activeId={garage.activeId}
          form={formProps}
          onPick={garage.selectVehicle}
          onRemove={garage.removeVehicle}
          onAdd={createVehicle}
          onClose={() => setDialog(null)}
          onResetAll={() => {
            garage.resetAll();
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
