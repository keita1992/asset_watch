import { formatMan, formatPct } from "../portfolio";

export type BarItem = {
  key: string;
  name: string;
  value: number;
  color: string;
  tooltip?: string;
};

type Props = {
  items: BarItem[];
  // 構成比の分母
  total: number;
  short?: boolean;
  outlined?: boolean;
};

// 共通の尺度の横棒で金額を比べる。最大の項目がトラックいっぱいになる
export const BarList = ({ items, total, short, outlined }: Props) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className={`aw-bars${short ? " aw-bars--short" : ""}`}>
      {items.map((i) => (
        <BarRow key={i.key} name={i.name} value={i.value} total={total} title={i.tooltip}>
          <div
            className="aw-bars__bar"
            style={{
              width: `${(i.value / max) * 100}%`,
              background: i.color,
              boxShadow: outlined ? "inset 0 0 0 1px var(--line)" : undefined,
            }}
          />
        </BarRow>
      ))}
    </div>
  );
};

type RowProps = {
  name: string;
  value: number;
  total: number;
  title?: string;
  children: React.ReactNode;
};

export const BarRow = ({ name, value, total, title, children }: RowProps) => (
  <>
    <span className="aw-bars__name" title={name}>{name}</span>
    <div className="aw-bars__track" title={title}>{children}</div>
    <span className="aw-bars__val">{formatMan(value)}</span>
    <span className="aw-bars__pct">{formatPct(value, total)}</span>
  </>
);
