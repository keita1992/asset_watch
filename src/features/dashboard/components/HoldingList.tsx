import { formatMan } from "../portfolio";

export type HoldingRow = {
  key: string;
  name: string;
  value: number;
  color: string;
  // 金融資産内の構成比
  investPct: string;
  // キャッシュ込みの構成比
  totalPct: string;
};

// 銘柄を大きい順の横棒で並べ、構成比を 2 つの分母で示す。最大の項目がトラックいっぱいになる
export const HoldingList = ({ rows }: { rows: HoldingRow[] }) => {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="aw-bars aw-bars--dual">
      <span />
      <span className="aw-bars__head aw-bars__head--track" />
      <span className="aw-bars__head aw-bars__head--track">評価額</span>
      <span className="aw-bars__head">金融資産</span>
      <span className="aw-bars__head">キャッシュ込み</span>
      {rows.map((r) => (
        <HoldingListRow key={r.key} row={r} max={max} />
      ))}
    </div>
  );
};

const HoldingListRow = ({ row: r, max }: { row: HoldingRow; max: number }) => (
  <>
    <span className="aw-bars__name" title={r.name}>
      <span className="aw-dot aw-bars__dot" style={{ background: r.color }} />
      {r.name}
    </span>
    <div className="aw-bars__track">
      <div className="aw-bars__bar" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
    </div>
    <span className="aw-bars__val">{formatMan(r.value)}</span>
    <span className="aw-bars__pct">{r.investPct}</span>
    <span className="aw-bars__pct">{r.totalPct}</span>
  </>
);

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
