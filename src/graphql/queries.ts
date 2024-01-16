/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getAsset = /* GraphQL */ `query GetAsset($id: ID!) {
  getAsset(id: $id) {
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
` as GeneratedQuery<APITypes.GetAssetQueryVariables, APITypes.GetAssetQuery>;
export const listAssets = /* GraphQL */ `query ListAssets(
  $filter: ModelAssetFilterInput
  $limit: Int
  $nextToken: String
) {
  listAssets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      category
      currency
      amount
      createdAt
      updatedAt
      deletedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAssetsQueryVariables,
  APITypes.ListAssetsQuery
>;
