import { byCategory, formatMan, Holding, ON_CHART, sum } from "../portfolio";

import { AllocationBar } from "./AllocationBar";

type Props = {
  holdings: Holding[];
  liabilities: number;
  grossLabel: string;
  netLabel: string;
};

// 総資産 − 負債 ＝ 純資産 を 1 本の横軸で示す。総資産は資産クラスで積み上げる
export const Waterfall = ({ holdings, liabilities, grossLabel, netLabel }: Props) => {
  const net = sum(holdings);
  const total = net + liabilities;
  const scale = Math.max(total, liabilities, 1);
  const pct = (x: number) => `${(Math.max(0, x) / scale) * 100}%`;
  // 円現金は負債控除済みなので、総資産の説明に限って負債分を戻す。
  const grossHoldings = holdings.map((h) => h.isJpyCash ? { ...h, value: h.value + liabilities } : h);
  const categories = byCategory(grossHoldings).filter((c) => c.value !== 0);
  const showBars = total > 0 && net >= 0 && categories.every((c) => c.value >= 0);

  return (
    <div className="aw-wf" role="group" aria-label={`${grossLabel}から負債を引いて${netLabel}`}>
      <span className="aw-wf__name">{grossLabel}</span>
      <div className="aw-wf__track">
        {showBars && <div className="aw-wf__bar" style={{ left: 0, width: pct(total) }}>
          <AllocationBar
            label={`${grossLabel}の内訳`}
            segments={categories.map((c) => ({ key: c.name, ...c }))}
            total={total}
            legend="none"
          />
        </div>}
      </div>
      <span className="aw-wf__val">{formatMan(total)}</span>

      <span className="aw-wf__name">負債</span>
      <div className="aw-wf__track">
        {showBars && <div className="aw-wf__bar" style={{ left: pct(net), width: pct(liabilities) }}>
          <AllocationBar
            label="負債の詳細"
            segments={[{ key: "liabilities", name: "負債", value: liabilities, color: "var(--liability)", onColor: ON_CHART }]}
            total={total}
            legend="none"
          />
        </div>}
      </div>
      <span className="aw-wf__val" style={{ color: "var(--liability)" }}>−{formatMan(liabilities)}</span>

      <span className="aw-wf__name">{netLabel}</span>
      <div className="aw-wf__track">
        {showBars && <div className="aw-wf__bar" style={{ left: 0, width: pct(net) }}>
          <AllocationBar
            label={`${netLabel}の詳細`}
            segments={[{ key: "net", name: netLabel, value: net, color: "var(--ink-3)", onColor: ON_CHART }]}
            total={total}
            legend="none"
          />
        </div>}
      </div>
      <span className="aw-wf__val">{formatMan(net)}</span>
    </div>
  );
};
