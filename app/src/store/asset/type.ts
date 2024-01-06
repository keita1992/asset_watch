export type Id = string;
export type Name = string;
export type Currency = 'JPY' | 'USD' | 'EUR' | 'CHF' | 'AUD' | 'CAD';
export type Category = '日本株' | '米国株' | '債券' | '投資信託' | 'コモディティ' | '現金' | 'その他';
export type Amount = number;
export type CreatedAt = Date;
export type ModifiedAt = Date;
export type DeletedAt = Date | null;

export type Asset = {
  id: Id;
  name: Name;
  currency: Currency;
  category: Category;
  amount: Amount;
  createdAt: CreatedAt;
  modifiedAt: ModifiedAt;
  deletedAt: DeletedAt;
};

export type Request = Omit<Asset, "id" | "createdAt" | "modifiedAt" | "deletedAt">;

export const isRequest = (data: any) => {
  return (
    typeof data.name === "string" &&
    typeof data.currency === "string" &&
    typeof data.category === "string" &&
    typeof data.amount === "number"
  );
}

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
