import { AssetsData, Category, Currency } from "@/store/asset/type";
import { User } from "@/store/user/type";

// 資産クラスの並び順と色（デザインシステムの class-* トークン）。並びは固定し、金額順に並べ替えても色は変えない
export const CATEGORIES: { name: Category; color: string; onColor: string }[] = [
  { name: "日本株", color: "var(--class-jp-equity)", onColor: "var(--on-cat-light)" },
  { name: "米国株", color: "var(--class-us-equity)", onColor: "var(--on-cat-dark)" },
  { name: "中国株", color: "var(--class-cn-equity)", onColor: "var(--on-cat-light)" },
  { name: "インド株", color: "var(--class-in-equity)", onColor: "var(--on-cat-dark)" },
  { name: "債券", color: "var(--class-bond)", onColor: "var(--on-cat-light)" },
  { name: "投資信託", color: "var(--class-fund)", onColor: "var(--on-cat-dark)" },
  { name: "コモディティ", color: "var(--class-commodity)", onColor: "var(--on-cat-light)" },
  { name: "現金", color: "var(--class-cash)", onColor: "var(--on-cat-dark)" },
  { name: "その他", color: "var(--class-other)", onColor: "var(--on-cat-other)" },
];

export const categoryColor = (category: Category) =>
  CATEGORIES.find((c) => c.name === category)?.color ?? "var(--class-other)";

const CURRENCY_COLORS: Partial<Record<Currency, string>> = {
  JPY: "var(--fx-jpy)",
  USD: "var(--fx-usd)",
  EUR: "var(--fx-eur)",
};
const CURRENCY_ORDER: Currency[] = ["JPY", "USD", "EUR", "CHF", "AUD", "CAD", "HKD", "CNY", "INR"];

export type Base = "total" | "invest";

export type Holding = {
  name: string;
  category: Category;
  currency: Currency;
  value: number;
  isJpyCash: boolean;
};

const isJpyCash = (a: { category: Category; currency: Currency }) =>
  a.category === "現金" && a.currency === "JPY";

/**
 * 保存されている円現金は「総資産 − 負債 − 円現金以外の資産」（src/plugins/dynamoDb.ts）。
 * 表示では負債を差し引かない「総資産 − 円現金以外の資産」を円現金として使う。保存値は変更しない。
 */
export const toHoldings = (assets: AssetsData, user: User): Holding[] => {
  const others = assets.filter((a) => !isJpyCash(a));
  const othersTotal = others.reduce((sum, a) => sum + a.value, 0);
  const jpyCash = Math.max(0, user.netAssets - othersTotal);
  const holdings: Holding[] = others.map((a) => ({
    name: a.label,
    category: a.category,
    currency: a.currency,
    value: a.value,
    isJpyCash: false,
  }));
  const jpyCashRow = assets.find(isJpyCash);
  holdings.push({
    name: jpyCashRow?.label ?? "円現金",
    category: "現金",
    currency: "JPY",
    value: jpyCash,
    isJpyCash: true,
  });
  return holdings;
};

// 投資資産（総資産 − 生活防衛資金）を分母にするときは、生活防衛資金を円現金から除く
export const applyBase = (holdings: Holding[], base: Base, emergencyFund: number): Holding[] =>
  base === "total"
    ? holdings
    : holdings.map((h) => (h.isJpyCash ? { ...h, value: Math.max(0, h.value - emergencyFund) } : h));

export const sum = (holdings: Holding[]) => holdings.reduce((s, h) => s + h.value, 0);

export const byCategory = (holdings: Holding[]) =>
  CATEGORIES.map((c) => ({
    ...c,
    value: sum(holdings.filter((h) => h.category === c.name)),
  }));

export const byCurrency = (holdings: Holding[]) =>
  CURRENCY_ORDER.map((name) => ({
    name,
    color: CURRENCY_COLORS[name] ?? "var(--fx-other)",
    value: sum(holdings.filter((h) => h.currency === name)),
  })).filter((c) => c.value > 0);

export const cashSummary = (holdings: Holding[], emergencyFund: number) => {
  const jpy = sum(holdings.filter((h) => h.isJpyCash));
  const foreign = sum(holdings.filter((h) => h.category === "現金" && h.currency !== "JPY"));
  return {
    jpy,
    foreign,
    emergencyFund,
    reserved: Math.min(jpy, emergencyFund),
    free: Math.max(0, jpy - emergencyFund),
    shortfall: Math.max(0, emergencyFund - jpy),
  };
};

export const formatMan = (yen: number) => `${Math.round(yen / 10000).toLocaleString("ja-JP")}万`;
export const formatYen = (yen: number) => `¥${Math.round(yen).toLocaleString("ja-JP")}`;
export const formatPct = (part: number, whole: number) =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "—";
