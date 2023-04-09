import { gql } from "@apollo/client";

export const WORKSPACES_QUERY = gql`
  query Workspaces($payload: WorkSpacesPayload) {
    workspaces(payload: $payload) {
      current_workspace_id
      workspaces {
        workspace_id
        workspace_name
      }
    }
  }
`;

export const SET_CURRENT_WORKSPACE_MUTATION = gql`
  mutation SetCurrentWorkSpace(
    $setCurrentWorkSpaceInput: SetCurrentWorkSpaceInput!
  ) {
    setCurrentWorkSpace(setCurrentWorkSpaceInput: $setCurrentWorkSpaceInput) {
      success
    }
  }
`;

export const GET_APPLICATION_AND_DATA_STORE = gql`
  query GetApplicationAndDataStore($workspaceId: String!) {
    getApplicationAndDataStore(workspaceId: $workspaceId) {
      application_id
      name
      display_id
      datastores {
        datastore_id
        name
      }
    }
  }
`;

export const DATASTORE_GET_DATASTORE_ITEM = gql`
  mutation Mutation(
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

export const DATASTORE_CREATE_NEW_ITEM = gql`
  mutation DatastoreCreateNewItem(
    $newItemActionParameters: NewItemActionParameters!
    $datastoreId: String!
    $projectId: String!
  ) {
    datastoreCreateNewItem(
      newItemActionParameters: $newItemActionParameters
      datastoreId: $datastoreId
      projectId: $projectId
    ) {
      error
      history_id
      item
      item_id
    }
  }
`;

export const GET_DATASTORE_ITEM_DETAILS = gql`
  query GetDatastoreItemDetails(
    $itemId: String!
    $datastoreId: String!
    $projectId: String
    $datastoreItemDetailParams: DatastoreItemDetailParams
  ) {
    getDatastoreItemDetails(
      itemId: $itemId
      datastoreId: $datastoreId
      projectId: $projectId
      datastoreItemDetailParams: $datastoreItemDetailParams
    ) {
      title
      rev_no
      field_values
      fields
      status_list
      status_actions
      item_actions
      status_order
      status_action_order
      item_action_order
    }
  }
`;

export const DATASTORE_UPDATE_ITEM = gql`
  mutation DatastoreUpdateItem(
    $itemActionParameters: ItemActionParameters!
    $itemId: String!
    $datastoreId: String!
    $projectId: String!
  ) {
    datastoreUpdateItem(
      ItemActionParameters: $itemActionParameters
      itemId: $itemId
      datastoreId: $datastoreId
      projectId: $projectId
    )
  }
`;

export const DATASTORE_DELETE_ITEM = gql`
  mutation DatastoreDeleteItem(
    $deleteItemReq: DeleteItemReq!
    $itemId: String!
    $datastoreId: String!
    $projectId: String!
  ) {
    datastoreDeleteItem(
      deleteItemReq: $deleteItemReq
      itemId: $itemId
      datastoreId: $datastoreId
      projectId: $projectId
    ) {
      error
    }
  }
`;
export const ADD_WORKSPACE = gql`
  mutation AddWorkspace($createWorkSpaceInput: CreateWorkSpaceInput!) {
    createWorkspace(createWorkSpaceInput: $createWorkSpaceInput) {
      w_id
    }
  }
`;

export const APPLICATION_CREATE_PROJECT = gql`
  mutation ApplicationCreateProject($createProjectParams: CreateProjectParams) {
    applicationCreateProject(createProjectParams: $createProjectParams) {
      project_id
    }
  }
`;

export const APPLICATION_UPADATE_PROJECT = gql`
  mutation UpdateProjectName($payload: UpdateProjectNamePl!) {
    updateProjectName(payload: $payload) {
      success
      data
    }
  }
`;

export const APPLICATION_DELETE_PROJECT = gql`
  mutation DeleteProject($payload: DeleteProjectPl!) {
    deleteProject(payload: $payload) {
      success
      data
    }
  }
`;
export const GET_TEMPLATES = gql`
  query Query {
    getTemplates {
      categories {
        category
        templates {
          tp_id
          name
          description
        }
      }
      enabled
    }
  }
`;

export const DOWNLOAD_FILE_QUERY = gql`
  query GetDowloadFile($id: String!) {
    getDownloadFile(id: $id) {
      filename
      data
    }
  }
`;

export const CREATE_ITEM_FILE_ATTACHMENT = gql`
  mutation CreateItemFileAttachment($payload: ItemFileAttachmentPl!) {
    createItemFileAttachment(payload: $payload) {
      file_id
      display_order
      d_id
      datastore_id
      w_id
      p_id
      i_id
      temporary
      filename
      filepath
      item_id
      contentType
      selfLink
      mediaLink
      size
      file_id
      created_at
      timeCreated
      updated
      user_id
    }
  }
`;
