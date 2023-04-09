import { gql } from "@apollo/client";

export const ANALYTICS_USAGE_API_QUERY = gql`
  query GetAnalyticsUsageApi(
    $getAnalyticsUsageApiId: String!
    $payload: ApiUsagePayload
  ) {
    getAnalyticsUsageApi(id: $getAnalyticsUsageApiId, payload: $payload) {
      api_usage {
        api_path
        created_at
        user_id
        w_id
        username
        email
        workspace_name
        status_code
        latency
        source_ip
        host
        payload
        method
      }
      total
    }
  }
`;
