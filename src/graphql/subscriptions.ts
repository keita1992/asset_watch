/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    id
    name
    netAssets
    liabilities
    emergencyFund
    createdAt
    updatedAt
    deletedAt
    assets {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    id
    name
    netAssets
    liabilities
    emergencyFund
    createdAt
    updatedAt
    deletedAt
    assets {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    id
    name
    netAssets
    liabilities
    emergencyFund
    createdAt
    updatedAt
    deletedAt
    assets {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateAsset = /* GraphQL */ `subscription OnCreateAsset($filter: ModelSubscriptionAssetFilterInput) {
  onCreateAsset(filter: $filter) {
    id
    userId
    name
    category
    currency
    amount
    createdAt
    updatedAt
    deletedAt
    user {
      id
      name
      netAssets
      liabilities
      emergencyFund
      createdAt
      updatedAt
      deletedAt
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAssetSubscriptionVariables,
  APITypes.OnCreateAssetSubscription
>;
export const onUpdateAsset = /* GraphQL */ `subscription OnUpdateAsset($filter: ModelSubscriptionAssetFilterInput) {
  onUpdateAsset(filter: $filter) {
    id
    userId
    name
    category
    currency
    amount
    createdAt
    updatedAt
    deletedAt
    user {
      id
      name
      netAssets
      liabilities
      emergencyFund
      createdAt
      updatedAt
      deletedAt
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAssetSubscriptionVariables,
  APITypes.OnUpdateAssetSubscription
>;
export const onDeleteAsset = /* GraphQL */ `subscription OnDeleteAsset($filter: ModelSubscriptionAssetFilterInput) {
  onDeleteAsset(filter: $filter) {
    id
    userId
    name
    category
    currency
    amount
    createdAt
    updatedAt
    deletedAt
    user {
      id
      name
      netAssets
      liabilities
      emergencyFund
      createdAt
      updatedAt
      deletedAt
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAssetSubscriptionVariables,
  APITypes.OnDeleteAssetSubscription
>;
