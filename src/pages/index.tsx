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
  cashSummary,
  formatPct,
  formatYen,
  Holding,
  HOLDING_COLOR_COUNT,
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
    const cashTotal = sum(scoped.filter(isCash));
    const invest = withHoldingColors(scoped.filter((h) => !isCash(h) && h.value > 0));
    const investTotal = sum(invest);

    // 総資産を分母にするときだけ、円現金のうち生活防衛資金の分を分けて示す
    const reserved = base === "total" ? Math.min(cashSummary(holdings, user.emergencyFund).jpy, user.emergencyFund) : 0;
    const cashSegments: Segment[] = [
      { key: "reserved", name: "キャッシュ（生活防衛）", value: reserved, color: "var(--class-cash)", onColor: ON_CHART, hatch: true },
      { key: "free", name: "キャッシュ（待機資金）", value: cashTotal - reserved, color: "var(--class-cash)", onColor: ON_CHART },
      { key: "other", name: "キャッシュ以外", value: investTotal, color: "var(--cat-other)", onColor: ON_CHART },
    ];

    const classSegments: Segment[] = byCategory(scoped)
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value)
      .map((c) => ({ key: c.name, name: c.name, value: c.value, color: c.color, onColor: c.onColor }));

    const currencies = byCurrency(scoped);
    const jpy = currencies.find((c) => c.name === "JPY")?.value ?? 0;
    const currencySegments: Segment[] = currencies.map((c) => ({ key: c.name, name: c.name, value: c.value, color: c.color, onColor: c.onColor }));

    const holdingKey = (h: Holding) => `${h.name}-${h.category}-${h.currency}`;
    // 横棒は上位 5 件だけ区画にし、残りは「残りN銘柄」の 1 区画にまとめる。全銘柄は下の一覧で見る
    const rest = invest.slice(HOLDING_COLOR_COUNT);
    const holdingSegments: Segment[] = [
      ...invest.slice(0, HOLDING_COLOR_COUNT).map((h) => ({ key: holdingKey(h), name: h.name, value: h.value, color: h.color, onColor: h.onColor })),
      ...(rest.length > 0 ? [{ key: "rest", name: `残り${rest.length}銘柄`, value: sum(rest), color: "var(--holding-rest)", onColor: ON_CHART }] : []),
    ];
    const cashSegment: Segment = { key: "cash", name: "キャッシュ", value: cashTotal, color: "var(--class-cash)", onColor: ON_CHART };
    const top = (n: number) => formatPct(sum(invest.slice(0, n)), investTotal);

    return {
      net: sum(holdings) - user.liabilities,
      scopedTotal,
      cashTotal,
      investTotal,
      cashSegments,
      classSegments,
      jpy,
      currencySegments,
      holdingSegments,
      cashSegment,
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
          investPct: formatPct(h.value, investTotal),
          totalPct: formatPct(h.value, scopedTotal),
        })),
        { key: "cash", name: "キャッシュ", value: cashTotal, color: "var(--class-cash)", investPct: "—", totalPct: formatPct(cashTotal, scopedTotal) },
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

          <Panel title="キャッシュポジション" total={formatPct(view.cashTotal, view.scopedTotal)} className="aw-span-5">
            <AllocationBar label="キャッシュポジション" segments={view.cashSegments} total={view.scopedTotal} showName={false} legend="all" />
          </Panel>

          <Panel title="資産クラス" className="aw-span-7">
            <AllocationBar label="資産クラス" segments={view.classSegments} total={view.scopedTotal} />
          </Panel>

          <Panel title="通貨" totalLabel="JPY" total={formatPct(view.jpy, view.scopedTotal)} className="aw-span-5">
            <AllocationBar label="通貨" segments={view.currencySegments} total={view.scopedTotal} />
          </Panel>

          <Panel title="銘柄" className="aw-span-12">
            <div className="aw-alloc-rows">
              <span className="aw-alloc-rows__label">金融資産</span>
              <div>
                <AllocationBar label="金融資産の銘柄構成" segments={view.holdingSegments} total={view.investTotal} legend="none" />
              </div>
              <span className="aw-alloc-rows__label">キャッシュ込み</span>
              <div>
                <AllocationBar label="キャッシュ込みの銘柄構成" segments={[...view.holdingSegments, view.cashSegment]} total={view.scopedTotal} legend="none" />
              </div>
            </div>
            <Stats items={view.stats} />
            <HoldingList rows={view.rows} />
          </Panel>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
