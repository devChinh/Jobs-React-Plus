import { gql } from "@apollo/client";

export const ORGANIZATIONS_QUERY = gql`
  query organizations {
    getOrganizations {
      id
      name
      description
      created_at
    }
  }
`;

export const ORGANIZATION_QUERY = gql`
  query Query($getOrganizationId: String!) {
    getOrganization(id: $getOrganizationId) {
      id
      name
      description
      created_at
    }
  }
`;

export const ORGANIZATION_ADD_MUTATION = gql`
  mutation CreateOrganization($org: CreateUpdateOrganizationInput!) {
    createOrganization(org: $org) {
      id
      name
    }
  }
`;

export const ORGANIZATION_UPDATE_MUTATION = gql`
  mutation UpdateOrganization(
    $updateOrganizationId: String!
    $org: CreateUpdateOrganizationInput!
  ) {
    updateOrganization(id: $updateOrganizationId, org: $org) {
      id
      name
    }
  }
`;

export const ADD_WORKSPACE_TO_ORG = gql`
  mutation Mutation($wid: String!, $addWorkspaceToOrganizationId: String!) {
    addWorkspaceToOrganization(wid: $wid, id: $addWorkspaceToOrganizationId) {
      success
    }
  }
`;

export const WORKSPACE_IN_ORG_QUERY = gql`
  query Query($getWorkspacesInOrganizationId: String!) {
    getWorkspacesInOrganization(id: $getWorkspacesInOrganizationId) {
      w_id
      name
    }
  }
`;

export const WORKSPACE_CAN_ADD_ORG_QUERY = gql`
  query workspaceCanAddToOrg {
    getWorkspacesCanAddOrganization {
      w_id
      name
    }
  }
`;

export const USER_IN_ORG_QUERY = gql`
  query GetUserInOrganization($getUserInOrganizationId: String!) {
    getUserInOrganization(id: $getUserInOrganizationId) {
      user_id
      email
      user_name
    }
  }
`;
export const ORG_PLAN_QUERY = gql`
  query getProductsSTripe {
    getProductsSTripe {
      name
      description
      id
      prices {
        id
        name
        product {
          id
          name
        }
      }
    }
  }
`;

export const ALL_DATA_ORGANIZATION = gql`
  query GetWorkspacesInOrganization($organizationId: String!) {
    getWorkspacesInOrganization(id: $organizationId) {
      w_id
      name
    }
    getWorkspacesCanAddOrganization {
      w_id
      name
    }
    getOrganization(id: $organizationId) {
      id
      name
      description
      created_at
    }

    getCardInOrganization(organizationId: $organizationId) {
      card_id
      exp_month
      exp_year
      cvc
      name
      ID
    }
  }
`;
export const CARD_IN_ORG_QUERY = gql`
  query GetCardInOrganization($organizationId: String!) {
    getCardInOrganization(organizationId: $organizationId) {
      card_id
      exp_month
      exp_year
      cvc
      name
      ID
    }
  }
`;
export const ADD_CARD_ORGANIZATION = gql`
  mutation CreateCardOrganization($card: CreateCardOrganizationInput!) {
    createCardOrganization(card: $card) {
      ID
      card_id
      exp_month
      exp_year
      cvc
      name
    }
  }
`;
export const UPDATE_CARD_ORGANIZATION = gql`
  mutation UpdateCardOrganization($card: UpdateCardOrganizationInput!) {
    updateCardOrganization(card: $card) {
      ID
      card_id
      exp_month
      exp_year
      cvc
      name
    }
  }
`;
