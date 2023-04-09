export type getAnalytics = {
  workspaces_count: number;
  deployed_apps_count: number;
  backend_template_count: number;
  subscriptions_count: number;
  organizations_count: number;
  api_access_today_count: number;
  api_access_monthly_count: number;
  average_response_time: number;
  resolution_within_slq: number;
  api_access: ApiChart[];
  api_login: ApiChart[];
};

export type getAnalyticsSession = {
  username: string;
  day: string;
  w_name: string;
  count: number;
};

export type TDataComon = {
  id: string;
  name: string;
};

export type Analytics = {
  getAnalytics?: getAnalytics;
  fetched?: boolean;
};

export type AnalyticsSession = {
  getAnalyticsSession?: getAnalyticsSession[];
  fetched?: boolean;
};

export type ApiChart = {
  day: string;
  name: string;
  count: number;
};

export type ApiChartAnlytics = {
  day: string;
  username: string;
  w_name: string;
  count: number;
};

export type Theme = {
  darkMode: boolean;
};

export enum ThemeMob {
  DARK = "dark",
  LIGHT = "light",
}

export type GetUserInfo = {
  username: string;
  email: string;
  profile_pic: string;
  u_id: string;
  current_workspace_id: string;
  is_ws_admin: string;
};

export type UserInfo = {
  userInfo: GetUserInfo;
};

export type ChartLoginPerMonth = {
  count_login: number;
  day_count: string;
  w_id: string;
};
