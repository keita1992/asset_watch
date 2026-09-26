import { byCategory, formatMan, formatPct, Holding, sum } from "../portfolio";

// 7% を超える区画には名前・構成比・金額を直接書き、残りは凡例に出す
const LABEL_THRESHOLD = 0.07;

export const AllocationBar = ({ holdings }: { holdings: Holding[] }) => {
  const total = sum(holdings);
  const rows = byCategory(holdings).filter((c) => c.value > 0);
  const small = rows.filter((c) => c.value / total <= LABEL_THRESHOLD);

  return (
    <>
      <div className="aw-alloc" role="img" aria-label="資産クラス配分">
        {rows.map((c) => (
          <div
            key={c.name}
            className="aw-alloc__seg"
            style={{ flex: `${c.value} 1 0`, background: c.color, color: c.onColor }}
            title={`${c.name} ${formatMan(c.value)}円 ${formatPct(c.value, total)}`}
          >
            {c.value / total > LABEL_THRESHOLD && (
              <>
                <span>{c.name} {formatPct(c.value, total)}</span>
                <span>{formatMan(c.value)}</span>
              </>
            )}
          </div>
        ))}
      </div>
      {small.length > 0 && (
        <ul className="aw-legend">
          {small.map((c) => (
            <li key={c.name}>
              <span className="aw-dot" style={{ background: c.color }} />
              {c.name} <b>{formatPct(c.value, total)}</b> {formatMan(c.value)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
