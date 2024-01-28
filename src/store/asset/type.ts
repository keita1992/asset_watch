import { Id as UserId } from "../user/type";

export type Id = string;
export type Name = string;
export type Currency =
  | "JPY"
  | "USD"
  | "EUR"
  | "CHF"
  | "AUD"
  | "CAD"
  | "HKD"
  | "CNY"
  | "INR";
export type Category =
  | "日本株"
  | "米国株"
  | "中国株"
  | "インド株"
  | "債券"
  | "投資信託"
  | "コモディティ"
  | "現金"
  | "その他";
export type Amount = number;
export type CreatedAt = string;
export type UpdatedAt = string;
export type DeletedAt = string | null;

export type Asset = {
  id: Id;
  name: Name;
  userId: UserId;
  currency: Currency;
  category: Category;
  amount: Amount;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt: DeletedAt;
};

export type Request = Omit<
  Asset,
  "id" | "userId" | "createdAt" | "updatedAt" | "deletedAt"
>;

export const isRequest = (data: any) => {
  return (
    typeof data.userId === "string" &&
    typeof data.name === "string" &&
    typeof data.currency === "string" &&
    typeof data.category === "string" &&
    typeof data.amount === "number"
  );
};

// API関連
export type AssetsGroupedByCategory = {
  label: Category;
  value: Amount;
  color: string;
}[];

export type AssetsGroupedByCategoryResponse = {
  assets: AssetsGroupedByCategory;
};

export type AssetGroupedByCurrency = {
  label: Category;
  value: Amount;
  color: string;
}[];

export type AssetsGroupedByCurrencyResponse = {
  assets: AssetGroupedByCurrency;
};

export type AssetsData = {
  label: Name;
  value: Amount;
  color: string;
  category: Category;
  currency: Currency;
}[];

export type AssetsDataResponse = {
  assets: AssetsData;
};

// Redux関連
export type IsAssetsFetched = boolean;
export type NormalizedAssets = {
  [id: string]: Asset;
};

export type State = {
  isAssetsFetched: IsAssetsFetched;
  assets: NormalizedAssets;
};
