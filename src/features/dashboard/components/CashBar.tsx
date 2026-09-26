import { cashSummary, formatMan, Holding } from "../portfolio";

import { BarRow } from "./BarList";

type Props = {
  holdings: Holding[];
  emergencyFund: number;
  // 構成比の分母（総資産）
  total: number;
};

// 円現金と外貨現金。円現金のうち生活防衛資金の分は斜線、足りない分は負債色の枠線で示す
export const CashBar = ({ holdings, emergencyFund, total }: Props) => {
  const cash = cashSummary(holdings, emergencyFund);
  const max = Math.max(cash.jpy + cash.shortfall, cash.foreign, 1);
  const w = (x: number) => `${(x / max) * 100}%`;

  return (
    <>
      <div className="aw-bars aw-bars--short">
        <BarRow name="円" value={cash.jpy} total={total}>
          {cash.reserved > 0 && (
            <div
              className="aw-bars__bar aw-hatch"
              style={{ width: w(cash.reserved), backgroundColor: "var(--class-cash)" }}
              title={`生活防衛資金 ${formatMan(cash.reserved)}`}
            />
          )}
          {cash.free > 0 && (
            <div
              className="aw-bars__bar"
              style={{ width: w(cash.free), background: "var(--class-cash)" }}
              title={`生活防衛資金以外 ${formatMan(cash.free)}`}
            />
          )}
          {cash.shortfall > 0 && (
            <div
              className="aw-bars__bar aw-shortfall"
              style={{ width: w(cash.shortfall) }}
              title={`生活防衛資金の不足 ${formatMan(cash.shortfall)}`}
            />
          )}
        </BarRow>
        <BarRow name="外貨" value={cash.foreign} total={total}>
          <div className="aw-bars__bar" style={{ width: w(cash.foreign), background: "var(--class-cash)" }} />
        </BarRow>
      </div>
      <ul className="aw-legend">
        <li>
          <span className="aw-dot aw-hatch" style={{ backgroundColor: "var(--class-cash)" }} />
          生活防衛資金 <b>{formatMan(emergencyFund)}</b>
        </li>
        {cash.shortfall > 0 && (
          <li>
            <span className="aw-dot aw-shortfall" />
            不足 <b>{formatMan(cash.shortfall)}</b>
          </li>
        )}
      </ul>
    </>
  );
};
