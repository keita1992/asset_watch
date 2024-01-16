/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createAsset = /* GraphQL */ `mutation CreateAsset(
  $input: CreateAssetInput!
  $condition: ModelAssetConditionInput
) {
  createAsset(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAssetMutationVariables,
  APITypes.CreateAssetMutation
>;
export const updateAsset = /* GraphQL */ `mutation UpdateAsset(
  $input: UpdateAssetInput!
  $condition: ModelAssetConditionInput
) {
  updateAsset(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAssetMutationVariables,
  APITypes.UpdateAssetMutation
>;
export const deleteAsset = /* GraphQL */ `mutation DeleteAsset(
  $input: DeleteAssetInput!
  $condition: ModelAssetConditionInput
) {
  deleteAsset(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAssetMutationVariables,
  APITypes.DeleteAssetMutation
>;
