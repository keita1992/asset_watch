type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const SegmentedControl = <T extends string>({ label, options, value, onChange }: Props<T>) => (
  <div className="aw-seg" role="group" aria-label={label}>
    {options.map((o) => (
      <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
        {o.label}
      </button>
    ))}
  </div>
);
