import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface FieldProps {
  label: string;
  /** Receives the id to hang off the control, so the label points at it. */
  children: (id: string) => ReactNode;
  style?: CSSProperties;
}

export function Field({ label, children, style }: FieldProps) {
  const id = useId();
  return (
    <div className="field" style={style}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  options: readonly (string | number)[];
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <Field label={label}>
      {(id) => (
        <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  numeric?: boolean;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

export function TextField({ label, value, onChange, placeholder, numeric, style, inputStyle }: TextFieldProps) {
  return (
    <Field label={label} style={style}>
      {(id) => (
        <input
          id={id}
          className="input"
          inputMode={numeric ? 'numeric' : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </Field>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextAreaField({ label, value, onChange, placeholder }: TextAreaFieldProps) {
  return (
    <Field label={label}>
      {(id) => (
        <textarea
          id={id}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}
