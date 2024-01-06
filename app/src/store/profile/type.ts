export type Id = number;
export type NetAssets = number;
export type Liabilities = number;
export type EmergencyFund = number;
export type CreatedAt = Date;
export type ModifiedAt = Date;

export type Profile = {
  id: Id;
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
export type IsProfilesFetched = boolean;
export type NormalizedProfiles = {
  [id: string]: Profile;
};

export type State = {
  isProfilesFetched: IsProfilesFetched;
  profiles: NormalizedProfiles;
};
