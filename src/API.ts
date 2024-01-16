/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  name: string,
  netAssets: number,
  liabilities: number,
  emergencyFund: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  netAssets?: ModelIntInput | null,
  liabilities?: ModelIntInput | null,
  emergencyFund?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  netAssets: number,
  liabilities: number,
  emergencyFund: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
  assets?: ModelAssetConnection | null,
};

export type ModelAssetConnection = {
  __typename: "ModelAssetConnection",
  items:  Array<Asset | null >,
  nextToken?: string | null,
};

export type Asset = {
  __typename: "Asset",
  id: string,
  userId: string,
  name: string,
  category: string,
  currency: string,
  amount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
  user?: User | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  netAssets?: number | null,
  liabilities?: number | null,
  emergencyFund?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateAssetInput = {
  id?: string | null,
  userId: string,
  name: string,
  category: string,
  currency: string,
  amount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
};

export type ModelAssetConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  amount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelAssetConditionInput | null > | null,
  or?: Array< ModelAssetConditionInput | null > | null,
  not?: ModelAssetConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateAssetInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  category?: string | null,
  currency?: string | null,
  amount?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  deletedAt?: string | null,
};

export type DeleteAssetInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  netAssets?: ModelIntInput | null,
  liabilities?: ModelIntInput | null,
  emergencyFund?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelAssetFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  amount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelAssetFilterInput | null > | null,
  or?: Array< ModelAssetFilterInput | null > | null,
  not?: ModelAssetFilterInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  netAssets?: ModelSubscriptionIntInput | null,
  liabilities?: ModelSubscriptionIntInput | null,
  emergencyFund?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  deletedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionAssetFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  currency?: ModelSubscriptionStringInput | null,
  amount?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  deletedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAssetFilterInput | null > | null,
  or?: Array< ModelSubscriptionAssetFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateAssetMutationVariables = {
  input: CreateAssetInput,
  condition?: ModelAssetConditionInput | null,
};

export type CreateAssetMutation = {
  createAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type UpdateAssetMutationVariables = {
  input: UpdateAssetInput,
  condition?: ModelAssetConditionInput | null,
};

export type UpdateAssetMutation = {
  updateAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type DeleteAssetMutationVariables = {
  input: DeleteAssetInput,
  condition?: ModelAssetConditionInput | null,
};

export type DeleteAssetMutation = {
  deleteAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAssetQueryVariables = {
  id: string,
};

export type GetAssetQuery = {
  getAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type ListAssetsQueryVariables = {
  filter?: ModelAssetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAssetsQuery = {
  listAssets?:  {
    __typename: "ModelAssetConnection",
    items:  Array< {
      __typename: "Asset",
      id: string,
      userId: string,
      name: string,
      category: string,
      currency: string,
      amount: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    netAssets: number,
    liabilities: number,
    emergencyFund: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    assets?:  {
      __typename: "ModelAssetConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateAssetSubscriptionVariables = {
  filter?: ModelSubscriptionAssetFilterInput | null,
};

export type OnCreateAssetSubscription = {
  onCreateAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type OnUpdateAssetSubscriptionVariables = {
  filter?: ModelSubscriptionAssetFilterInput | null,
};

export type OnUpdateAssetSubscription = {
  onUpdateAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};

export type OnDeleteAssetSubscriptionVariables = {
  filter?: ModelSubscriptionAssetFilterInput | null,
};

export type OnDeleteAssetSubscription = {
  onDeleteAsset?:  {
    __typename: "Asset",
    id: string,
    userId: string,
    name: string,
    category: string,
    currency: string,
    amount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
    deletedAt?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      netAssets: number,
      liabilities: number,
      emergencyFund: number,
      createdAt?: string | null,
      updatedAt?: string | null,
      deletedAt?: string | null,
    } | null,
  } | null,
};
