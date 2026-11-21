import { ArrowRight, Gauge } from '@phosphor-icons/react';
import {
  EngineField,
  MakeField,
  ModelField,
  NicknameField,
  OdometerField,
  YearField,
  type VehicleFormProps,
} from './VehicleFormFields';

interface EmptyStateProps {
  form: VehicleFormProps;
  onCreate: () => void;
  onLoadDemo: () => void;
}

/** First run: capture vehicle identity and odometer, or load the demo garage. */
export function EmptyState({ form, onCreate, onLoadDemo }: EmptyStateProps) {
  return (
    <div className="col-narrow">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--color-accent)',
          fontSize: 13,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
        }}
      >
        <Gauge size={18} />
        ODOGRAPH
      </div>

      <h1 style={{ margin: '14px 0 8px', fontSize: 'clamp(30px,6vw,44px)' }}>
        Every service your car is owed, mapped to 200,000 miles.
      </h1>
      <p className="text-muted" style={{ fontSize: 15, maxWidth: '44ch' }}>
        Pick your vehicle, tell us the odometer, and we build the manufacturer schedule around where you
        actually are — what you&rsquo;ve missed, what&rsquo;s due, and what&rsquo;s next.
      </p>

      <div className="card elev-sm" style={{ marginTop: 26, gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <YearField {...form} />
          <MakeField {...form} />
          <ModelField {...form} />
          <EngineField {...form} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <OdometerField {...form} label="Current odometer" />
          <NicknameField {...form} />
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            alignItems: 'center',
            marginTop: 'var(--space-2)',
          }}
        >
          <button className="btn btn-primary" onClick={onCreate}>
            <ArrowRight />
            Build my schedule
          </button>
          <button className="btn btn-ghost" onClick={onLoadDemo}>
            Load the demo 2020 RAV4
          </button>
        </div>
      </div>
    </div>
  );
}
