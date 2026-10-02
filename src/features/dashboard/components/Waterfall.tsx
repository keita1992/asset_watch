import { byCategory, formatMan, Holding, ON_CHART, sum } from "../portfolio";

import { AllocationBar } from "./AllocationBar";

type Props = {
  holdings: Holding[];
  liabilities: number;
};

// 総資産 − 負債 ＝ 純資産 を 1 本の横軸で示す。総資産は資産クラスで積み上げる
export const Waterfall = ({ holdings, liabilities }: Props) => {
  const net = sum(holdings);
  const total = net + liabilities;
  const scale = Math.max(total, liabilities, 1);
  const pct = (x: number) => `${(Math.max(0, x) / scale) * 100}%`;
  // 円現金は負債控除済みなので、総資産の説明に限って負債分を戻す。
  const grossHoldings = holdings.map((h) => h.isJpyCash ? { ...h, value: h.value + liabilities } : h);
  const categories = byCategory(grossHoldings).filter((c) => c.value !== 0);

  return (
    <div className="aw-wf" role="group" aria-label="総資産から負債を引いて純資産">
      <span className="aw-wf__name">総資産</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: 0, width: pct(total) }}>
          <AllocationBar
            label="総資産の内訳"
            segments={categories.map((c) => ({ key: c.name, ...c }))}
            total={total}
            legend="none"
          />
        </div>
      </div>
      <span className="aw-wf__val">{formatMan(total)}</span>

      <span className="aw-wf__name">負債</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: pct(net), width: pct(Math.min(liabilities, total)) }}>
          <AllocationBar
            label="負債の詳細"
            segments={[{ key: "liabilities", name: "負債", value: liabilities, color: "var(--liability)", onColor: ON_CHART }]}
            total={total}
            legend="none"
          />
        </div>
      </div>
      <span className="aw-wf__val" style={{ color: "var(--liability)" }}>−{formatMan(liabilities)}</span>

      <span className="aw-wf__name">純資産</span>
      <div className="aw-wf__track">
        <div className="aw-wf__bar" style={{ left: 0, width: pct(net) }}>
          <AllocationBar
            label="純資産の詳細"
            segments={[{ key: "net", name: "純資産", value: net, color: "var(--ink-3)", onColor: ON_CHART }]}
            total={total}
            legend="none"
          />
        </div>
      </div>
      <span className="aw-wf__val">{formatMan(net)}</span>
    </div>
  );
};
