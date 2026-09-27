import { useState } from "react";

import { formatMan } from "../portfolio";

export type HoldingRow = {
  key: string;
  name: string;
  value: number;
  color: string;
  // キャッシュ込みの構成比
  totalPct: string;
};

// 銘柄を大きい順の横棒で並べ、キャッシュ込みの構成比を示す。最大の項目がトラックいっぱいになる
export const HoldingList = ({ rows }: { rows: HoldingRow[] }) => {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="aw-holdings">
      {rows.map((r) => (
        <HoldingListRow key={r.key} row={r} max={max} />
      ))}
    </div>
  );
};

const HoldingListRow = ({ row: r, max }: { row: HoldingRow; max: number }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      type="button"
      className="aw-holding"
      aria-label={`${r.name} ${r.totalPct}、金額を表示`}
      aria-expanded={expanded}
      onClick={() => setExpanded((value) => !value)}
      onBlur={() => setExpanded(false)}
      onKeyDown={(e) => e.key === "Escape" && setExpanded(false)}
    >
      <span className="aw-bars__name">
        <span className="aw-dot aw-bars__dot" style={{ background: r.color }} />
        {r.name}
      </span>
      <span className="aw-bars__track">
        <span className="aw-bars__bar" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
      </span>
      <span className="aw-bars__pct">{r.totalPct}</span>
      <span className="aw-tip aw-holding__detail">
        <span className="aw-tip__name">{r.name}</span>
        <span className="aw-tip__row">{formatMan(r.value)}円</span>
      </span>
    </button>
  );
};

type Stat = { label: string; value: string };

// 主要な比率をタイルで並べる
export const Stats = ({ items }: { items: Stat[] }) => (
  <div className="aw-stats">
    {items.map((s) => (
      <div key={s.label} className="aw-stat">
        <div className="aw-stat__label">{s.label}</div>
        <div className="aw-stat__value">{s.value}</div>
      </div>
    ))}
  </div>
);
