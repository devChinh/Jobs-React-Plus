import { gql } from "@apollo/client";

export const APPLICATION_QUERY = gql`
query project($workspaceId: String!) {
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

//TODO: waiting for mutation gql
// export const SET_CURRENT_WORKSPACE_MUTATION = gql`
  
// `;