import { gql } from "@apollo/client";

export const DATASTORE_QUERY = gql`
  query GetApplicationDatastores($applicationId: String!) {
    getApplicationDatastores(applicationId: $applicationId) {
      datastore_id
      name
      display_id
      deleted
      imported
      uploading
    }
  }
`;

export const GET_DATASTORE_ITEM = gql`
  query GetDatastoreItemDetails(
    $itemId: String!
    $datastoreId: String!
    $datastoreItemDetailParams: DatastoreItemDetailParams
    $projectId: String
  ) {
    getDatastoreItemDetails(
      itemId: $itemId
      datastoreId: $datastoreId
      datastoreItemDetailParams: $datastoreItemDetailParams
      projectId: $projectId
    ) {
      title
      rev_no
      field_values
      status_list
      item_actions
      status_actions
      status_order
      status_action_order
      item_action_order
    }
  }
`;

export const DATASTORE_FIELDS_QUERY = gql`
  query DatastoreGetFields($projectId: String, $datastoreId: String!) {
    datastoreGetFields(projectId: $projectId, datastoreId: $datastoreId) {
      fields
      field_layout
    }
  }
`;

export const DATASTORE_GET_DATASTOREITEMS = gql`
  mutation DatastoreGetDatastoreItems(
    $getItemsParameters: GetItemsParameters!
    $datastoreId: String!
    $projectId: String
  ) {
    datastoreGetDatastoreItems(
      getItemsParameters: $getItemsParameters
      datastoreId: $datastoreId
      projectId: $projectId
    ) {
      items
      totalItems
    }
  }
`;

export const DATASTORE_GET_FIELD = gql`
  query Query($datastoreId: String!, $projectId: String) {
    datastoreGetFields(datastoreId: $datastoreId, projectId: $projectId) {
      fields
      field_layout
    }
  }
`;

export const DATASTORE_CREATE_ITEM_ID = gql`
  mutation DatastoreCreateItemID($datastoreId: String!) {
    datastoreCreateItemID(datastoreId: $datastoreId) {
      item_id
    }
  }
`;

export const DATASTORE_CREATE_FIELD = gql`
  mutation DatastoreCreateField(
    $payload: CreateFieldPayload!
    $datastoreId: String!
  ) {
    datastoreCreateField(payload: $payload, datastoreId: $datastoreId) {
      display_id
      field_id
    }
  }
`;

export const DATASTORE_ROLES_QUERY = gql`
  query Roles($datastoreId: String!) {
    datastoreSetting(datastoreId: $datastoreId) {
      roles {
        id
        display_id
        name
      }
      fields {
        options {
          _key
          o_id
          fieldID
        }
        id
        display_name
        display_id
        names
        data_type
        search
        show_list
        as_title
        status
        field_index
        title_order
        full_text
        unique
        min_value
        max_value
      }
      field_layout {
        id
        display_id
        col
        row
        size_x
        size_y
      }
      statuses {
        id
        display_id
        names
      }
      id
      names
      display_id
    }
  }
`;

export const DATASTORE_DELETE_FIELD = gql`
  mutation DatastoreDeleteField($fieldId: String!, $datastoreId: String!) {
    datastoreDeleteField(fieldId: $fieldId, datastoreId: $datastoreId) {
      success
      data
    }
  }
`;
