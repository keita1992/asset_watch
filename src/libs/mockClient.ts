// AWS に接続せずにローカルで動かすための GraphQL クライアントのモック。
// USE_MOCK_DATA=true のとき src/libs/amplify.ts から使われる。データはサーバープロセスのメモリ上にだけ保持する。
import { v4 as uuid } from "uuid";

import { USER_ID } from "@/utils/constants";

type Row = Record<string, any>;
type Filter = Record<string, any>;

type MockDb = { users: Row[]; assets: Row[] };

const now = () => new Date().toISOString();

const seed = (): MockDb => {
  const t = "2026-09-20T00:00:00.000Z";
  const asset = (name: string, category: string, currency: string, amount: number) => ({
    id: uuid(),
    userId: USER_ID,
    name,
    category,
    currency,
    amount,
    createdAt: t,
    updatedAt: t,
    deletedAt: null,
  });
  return {
    users: [
      {
        id: USER_ID,
        name: "サンプル",
        netAssets: 21860000,
        liabilities: 800000,
        emergencyFund: 3000000,
        createdAt: t,
        updatedAt: t,
      },
    ],
    assets: [
      asset("eMAXIS Slim 米国株式(S&P500)", "米国株", "JPY", 5210000),
      asset("VTI", "米国株", "USD", 1900000),
      asset("ニッセイ外国株式インデックス", "投資信託", "JPY", 1650000),
      asset("iシェアーズ 米国債7-10年", "債券", "USD", 1786000),
      asset("トヨタ自動車", "日本株", "JPY", 1284000),
      asset("eMAXIS Slim 全世界株式", "投資信託", "JPY", 965000),
      asset("純金積立", "コモディティ", "JPY", 902000),
      asset("NEXT FUNDS インド株式", "インド株", "JPY", 885000),
      asset("米ドル預金", "現金", "USD", 820000),
      asset("三菱UFJ FG", "日本株", "JPY", 640000),
      asset("テンセント", "中国株", "HKD", 571000),
      asset("ビットコイン", "その他", "JPY", 203000),
      // 円現金は updateJpyCash と同じ式（総資産 − 負債 − 円現金以外の資産）で保存される値
      asset("円現金", "現金", "JPY", 4244000),
    ],
  };
};

// 開発サーバーのホットリロードでデータが消えないよう globalThis に置く
const g = globalThis as unknown as { __assetWatchMockDb?: MockDb };
const db = (): MockDb => (g.__assetWatchMockDb ??= seed());

// Amplify の ModelFilterInput のうち、このアプリが使う eq / ne / attributeExists / and / or / not を評価する
const matches = (row: Row, filter?: Filter): boolean => {
  if (!filter) return true;
  return Object.entries(filter).every(([key, cond]) => {
    if (key === "and") return (cond as Filter[]).every((f) => matches(row, f));
    if (key === "or") return (cond as Filter[]).some((f) => matches(row, f));
    if (key === "not") return !matches(row, cond as Filter);
    const value = row[key];
    return Object.entries(cond as Filter).every(([op, expected]) => {
      if (op === "eq") return value === expected;
      if (op === "ne") return value !== expected;
      if (op === "attributeExists") return (value !== null && value !== undefined) === expected;
      throw new Error(`mockClient: unsupported filter operator "${op}"`);
    });
  });
};

const operationName = (query: string) => {
  const m = /(?:query|mutation)\s+(\w+)/.exec(query);
  if (!m) throw new Error("mockClient: cannot read the operation name");
  return m[1];
};

const update = (rows: Row[], input: Row) => {
  const row = rows.find((r) => r.id === input.id);
  if (!row) throw new Error(`mockClient: ${input.id} not found`);
  Object.assign(row, input, { updatedAt: now() });
  return { ...row };
};

const run = (name: string, variables: Row = {}): Row => {
  const { users, assets } = db();
  switch (name) {
    case "GetUser":
      return { getUser: users.find((u) => u.id === variables.id) ?? null };
    case "ListUsers":
      return { listUsers: { items: users.filter((u) => matches(u, variables.filter)), nextToken: null } };
    case "CreateUser": {
      const user = { ...variables.input, createdAt: now(), updatedAt: now() };
      users.push(user);
      return { createUser: user };
    }
    case "UpdateUser":
      return { updateUser: update(users, variables.input) };
    case "DeleteUser": {
      const i = users.findIndex((u) => u.id === variables.input.id);
      return { deleteUser: i >= 0 ? users.splice(i, 1)[0] : null };
    }
    case "GetAsset":
      return { getAsset: assets.find((a) => a.id === variables.id) ?? null };
    case "ListAssets":
      return { listAssets: { items: assets.filter((a) => matches(a, variables.filter)).map((a) => ({ ...a })), nextToken: null } };
    case "CreateAsset": {
      const asset = { id: uuid(), deletedAt: null, ...variables.input, createdAt: now(), updatedAt: now() };
      assets.push(asset);
      return { createAsset: asset };
    }
    case "UpdateAsset":
      return { updateAsset: update(assets, variables.input) };
    case "DeleteAsset": {
      const i = assets.findIndex((a) => a.id === variables.input.id);
      return { deleteAsset: i >= 0 ? assets.splice(i, 1)[0] : null };
    }
    default:
      throw new Error(`mockClient: unsupported operation "${name}"`);
  }
};

export const mockClient = {
  graphql: async ({ query, variables }: { query: string; variables?: Row }) => ({
    data: run(operationName(String(query)), variables),
  }),
};
