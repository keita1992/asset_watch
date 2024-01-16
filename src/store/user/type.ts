export type Id = string;
export type Name = string;
export type NetAssets = number;
export type Liabilities = number;
export type EmergencyFund = number;
export type CreatedAt = string;
export type UpdatedAt = string;

export type User = {
  id: Id;
  name: Name;
  netAssets: NetAssets;
  liabilities: Liabilities;
  emergencyFund: EmergencyFund;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type Request = Omit<User, "id" | "createdAt" | "updatedAt">;

export const isRequest = (data: any) => {
  return (
    typeof data.netAssets === "number" &&
    typeof data.liabilities === "number" &&
    typeof data.emergencyFund === "number"
  );
};

// Redux関連
export type IsUserFetched = boolean;

export type State = {
  isUserFetched: IsUserFetched;
  user: User;
};
