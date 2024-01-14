export type NetAssets = number;
export type Liabilities = number;
export type EmergencyFund = number;
export type CreatedAt = string;
export type ModifiedAt = string;

export type Profile = {
  netAssets: NetAssets;
  liabilities: Liabilities;
  emergencyFund: EmergencyFund;
  createdAt: CreatedAt;
  modifiedAt: ModifiedAt;
};

export type Request = Omit<Profile, "id" | "createdAt" | "modifiedAt">;

export const isRequest = (data: any) => {
  return (
    typeof data.netAssets === "number" &&
    typeof data.liabilities === "number" &&
    typeof data.emergencyFund === "number"
  );
};

// Redux関連
export type IsProfileFetched = boolean;

export type State = {
  isProfileFetched: IsProfileFetched;
  profile: Profile;
};
