import { gql } from "@apollo/client";

export const ANALYTICS_QUERY = gql`
  query analytics {
    getAnalytics {
      workspaces_count
      deployed_apps_count
      backend_template_count
      subscriptions_count
      api_access_today_count
      api_access_monthly_count
      average_response_time
      resolution_within_slq
      api_access {
        day
        count
        name
      }
      api_login {
        day
        count
        name
      }
    }
  }
`;
export const USERINFO_QUERY = gql`
  query Query {
    userInfo {
      username
      email
      profile_pic
      u_id
      current_workspace_id
      is_ws_admin
    }
  }
`;

export const ANALYTICS_SESSION_QUERY = gql`
  query getAnalyticsSession {
    getAnalyticsSession {
      username
      day
      w_name
      count
    }
  }
`;

export const GET_ANALYTICS_LOGIN_PER_MONTH = gql`
  query GetAnalyticsLoginPerMonth($payload: ApiAnalyticLoginPerMonthPayload!) {
    getAnalyticsLoginPerMonth(payload: $payload) {
      data {
        count_login
        day_count
        w_id
      }
    }
  }
`;
