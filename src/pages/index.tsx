import { useEffect, useMemo, useState } from "react";

import { AllocationBar } from "@/features/dashboard/components/AllocationBar";
import { BarList } from "@/features/dashboard/components/BarList";
import { CashBar } from "@/features/dashboard/components/CashBar";
import { Panel } from "@/features/dashboard/components/Panel";
import { SegmentedControl } from "@/features/dashboard/components/SegmentedControl";
import { Waterfall } from "@/features/dashboard/components/Waterfall";
import {
  applyBase,
  Base,
  byCurrency,
  cashSummary,
  categoryColor,
  formatPct,
  formatYen,
  Holding,
  sum,
  toHoldings,
} from "@/features/dashboard/portfolio";

import { axios } from "@/libs/axios";
import { AssetsDataResponse } from "@/store/asset/type";
import { User } from "@/store/user/type";
import { USER_ID } from "@/utils/constants";

const BASE_OPTIONS: { value: Base; label: string }[] = [
  { value: "total", label: "総資産" },
  { value: "invest", label: "投資資産" },
];

export const Dashboard = () => {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const [base, setBase] = useState<Base>("total");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, userRes] = await Promise.all([
          axios.get<AssetsDataResponse>("/api/assets/all"),
          axios.get<User>(`/api/users/${USER_ID}`),
        ]);
        setUser(userRes.data);
        setHoldings(toHoldings(assetsRes.data.assets ?? [], userRes.data));
      } catch (e) {
        console.error(e);
        setError(true);
      }
    };
    fetchData();
  }, []);

  const view = useMemo(() => {
    if (!holdings || !user) return null;
    const scoped = applyBase(holdings, base, user.emergencyFund);
    const scopedTotal = sum(scoped);
    const currencies = byCurrency(scoped);
    const foreign = currencies.filter((c) => c.name !== "JPY").reduce((s, c) => s + c.value, 0);
    const cash = cashSummary(holdings, user.emergencyFund);
    return {
      total: sum(holdings),
      net: sum(holdings) - user.liabilities,
      cashTotal: cash.jpy + cash.foreign,
      scoped,
      scopedTotal,
      foreign,
      bars: [...scoped]
        .filter((h) => h.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((h) => ({
          key: `${h.name}-${h.category}-${h.currency}`,
          name: h.name,
          value: h.value,
          color: categoryColor(h.category),
          tooltip: `${h.name}（${h.category}・${h.currency}） ${formatYen(h.value)}`,
        })),
      currencies: currencies.map((c) => ({ key: c.name, name: c.name, value: c.value, color: c.color, tooltip: `${c.name} ${formatYen(c.value)}` })),
    };
  }, [holdings, user, base]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 18, lineHeight: "26px", fontWeight: 600 }}>ダッシュボード</h1>
        <SegmentedControl label="構成比の分母" options={BASE_OPTIONS} value={base} onChange={setBase} />
      </div>

      {error && <p className="aw-empty">データを読み込めませんでした。</p>}
      {!error && !view && <p className="aw-empty">読み込み中…</p>}

      {view && user && (
        <div className="aw-grid">
          <Panel title="資産・負債" total={formatYen(view.net)} className="aw-span-7">
            <Waterfall holdings={holdings!} liabilities={user.liabilities} />
          </Panel>

          <Panel title="現金" total={formatPct(view.cashTotal, view.total)} className="aw-span-5">
            <CashBar holdings={holdings!} emergencyFund={user.emergencyFund} total={view.total} />
          </Panel>

          <Panel title="資産配分" total={formatYen(view.scopedTotal)} className="aw-span-12">
            <AllocationBar holdings={view.scoped} />
          </Panel>

          <Panel title="銘柄" className="aw-span-7">
            <BarList items={view.bars} total={view.scopedTotal} />
          </Panel>

          <Panel title="登録通貨" total={formatPct(view.foreign, view.scopedTotal)} className="aw-span-5">
            <BarList items={view.currencies} total={view.scopedTotal} short outlined />
          </Panel>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
