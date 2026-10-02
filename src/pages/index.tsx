import { useEffect, useMemo, useState } from "react";

import { AllocationBar, Segment } from "@/features/dashboard/components/AllocationBar";
import { HoldingList, Stats } from "@/features/dashboard/components/HoldingList";
import { Panel } from "@/features/dashboard/components/Panel";
import { SegmentedControl } from "@/features/dashboard/components/SegmentedControl";
import { Waterfall } from "@/features/dashboard/components/Waterfall";
import {
  applyBase,
  Base,
  byCategory,
  byCurrency,
  cashPosition,
  formatPct,
  formatYen,
  Holding,
  isCash,
  ON_CHART,
  sum,
  toHoldings,
  withHoldingColors,
} from "@/features/dashboard/portfolio";

import { axios } from "@/libs/axios";
import { AssetsDataResponse } from "@/store/asset/type";
import { User } from "@/store/user/type";
import { USER_ID } from "@/utils/constants";

const BASE_OPTIONS: { value: Base; label: string }[] = [
  { value: "total", label: "純資産" },
  { value: "invest", label: "投資資産" },
];

export const Dashboard = () => {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const [base, setBase] = useState<Base>("invest");

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
    const cashTotal = sum(scoped.filter(isCash));
    const invest = withHoldingColors(scoped.filter((h) => !isCash(h) && h.value > 0));

    const position = cashPosition(scoped);
    const cashSegments: Segment[] = [
      ...byCurrency(position.cash).map((c) => ({
        key: c.name, name: c.name, value: c.value, color: c.color, onColor: c.onColor,
      })),
      { key: "other", name: "キャッシュ以外", value: position.nonCashTotal, color: "var(--cat-other)", onColor: ON_CHART },
    ];

    const classSegments: Segment[] = byCategory(scoped)
      .filter((c) => c.value !== 0)
      .sort((a, b) => Number(a.name === "現金") - Number(b.name === "現金") || b.value - a.value)
      .map((c) => ({ key: c.name, name: c.name, value: c.value, color: c.color, onColor: c.onColor }));

    const currencies = byCurrency(scoped);
    const jpy = currencies.find((c) => c.name === "JPY")?.value ?? 0;
    const currencySegments: Segment[] = currencies.map((c) => ({ key: c.name, name: c.name, value: c.value, color: c.color, onColor: c.onColor }));

    const holdingKey = (h: Holding) => `${h.name}-${h.category}-${h.currency}`;
    // 小さい銘柄も独立した区画にし、名前と割合は下の一覧で確認できるようにする
    const holdingSegments: Segment[] = invest.map((h) => ({
      key: holdingKey(h), name: h.name, value: h.value, color: h.color, onColor: h.onColor,
    }));
    const cashSegment: Segment = { key: "cash", name: "キャッシュ", value: cashTotal, color: "var(--class-cash)", onColor: ON_CHART };
    const holdingCashSegments: Segment[] = position.canShowAllocation ? [cashSegment] : byCurrency(position.cash).map((c) => ({
      key: c.name, name: c.name === "JPY" ? "円現金" : `${c.name}現金`, value: c.value, color: "var(--class-cash)", onColor: ON_CHART,
    }));
    const top = (n: number) => formatPct(sum(invest.slice(0, n)), scopedTotal);

    return {
      net: sum(holdings),
      scopedTotal,
      cashTotal,
      cashSegments,
      position,
      classSegments,
      jpy,
      currencySegments,
      holdingSegments,
      holdingCashSegments,
      stats: [
        { label: "最大の銘柄", value: top(1) },
        { label: "上位3銘柄", value: top(3) },
        { label: "上位5銘柄", value: top(5) },
      ],
      rows: [
        ...invest.map((h) => ({
          key: holdingKey(h),
          name: h.name,
          value: h.value,
          color: h.color,
          totalPct: formatPct(h.value, scopedTotal),
        })),
        ...holdingCashSegments.map((s) => ({ ...s, totalPct: formatPct(s.value, scopedTotal) })),
      ],
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
          <Panel title="資産・負債" totalLabel="純資産" total={formatYen(view.net)} className="aw-span-7">
            <Waterfall holdings={holdings!} liabilities={user.liabilities} />
          </Panel>

          <Panel title="キャッシュポジション" totalLabel={base === "invest" ? "純資産 − 生活防衛資金" : "純資産"} total={formatPct(view.position.cashTotal, view.position.total)} className="aw-span-5 aw-cash-position">
            {view.position.canShowAllocation ? (
              <AllocationBar label="キャッシュポジション" segments={view.cashSegments} total={view.position.total} legend="none" />
            ) : (
              <div>
                {view.position.cash.map((h) => <p key={h.currency}>{h.currency} {formatYen(h.value)}</p>)}
                <p>キャッシュ以外 {formatYen(view.position.nonCashTotal)}</p>
              </div>
            )}
          </Panel>

          <Panel title="資産クラス" className="aw-span-7">
            <AllocationBar label="資産クラス" segments={view.classSegments} total={view.scopedTotal} canShowAllocation={view.position.canShowAllocation} legend="none" />
          </Panel>

          <Panel title="通貨" totalLabel="JPY" total={formatPct(view.jpy, view.scopedTotal)} className="aw-span-5">
            <AllocationBar label="通貨" segments={view.currencySegments} total={view.scopedTotal} canShowAllocation={view.position.canShowAllocation} />
          </Panel>

          <Panel title="銘柄" className="aw-span-12">
            <AllocationBar label="銘柄構成" segments={[...view.holdingSegments, ...view.holdingCashSegments]} total={view.scopedTotal} canShowAllocation={view.position.canShowAllocation} legend="none" />
            <HoldingList rows={view.rows} />
            <Stats items={view.stats} />
          </Panel>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
