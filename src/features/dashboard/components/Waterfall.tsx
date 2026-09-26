import { byCategory, formatMan, Holding, sum } from "../portfolio";

type Props = {
  holdings: Holding[];
  liabilities: number;
};

// 総資産 − 負債 ＝ 純資産 を 1 本の横軸で示す。総資産は資産クラスで積み上げる
export const Waterfall = ({ holdings, liabilities }: Props) => {
  const total = sum(holdings);
  const net = total - liabilities;
  const scale = Math.max(total, liabilities, 1);
  const pct = (x: number) => `${(Math.max(0, x) / scale) * 100}%`;
  const categories = byCategory(holdings).filter((c) => c.value > 0);

  return (
    <div className="aw-wf" role="img" aria-label="総資産から負債を引いて純資産">
      <span className="aw-wf__name">総資産</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: 0, width: pct(total) }}>
          {categories.map((c) => (
            <div
              key={c.name}
              style={{ flex: `${c.value} 1 0`, background: c.color }}
              title={`${c.name} ${formatMan(c.value)}円`}
            />
          ))}
        </div>
      </div>
      <span className="aw-wf__val">{formatMan(total)}</span>

      <span className="aw-wf__name">負債</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: pct(net), width: pct(Math.min(liabilities, total)) }}>
          <div style={{ width: "100%", background: "var(--liability)", borderRadius: 2 }} />
        </div>
      </div>
      <span className="aw-wf__val" style={{ color: "var(--liability)" }}>−{formatMan(liabilities)}</span>

      <span className="aw-wf__name">純資産</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: 0, width: pct(net) }}>
          <div style={{ width: "100%", background: "var(--ink-3)", borderRadius: 2 }} />
        </div>
      </div>
      <span className="aw-wf__val">{formatMan(net)}</span>
    </div>
  );
};
