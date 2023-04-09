export type TSubscription = {
  subscription_id: string;
  organization_icon: string | undefined | null;
  organization_name: string;
  organization_description: string;
  workspaces: string;
  billing_accounts: string;
};

export type TSubscriptionInfo = {
  subscriptions?: TSubscription[];
  current_subscription_id?: string | undefined | null;
};

export type TSubscriptions = {
  subscriptions?: TSubscriptionInfo;
  fetched?: boolean;
};

export type TSubscriptionDetail = {
  billing_account_id: string;
  billing_account_name: string;
};

export type TSubscriptionUsageOverview = {
  billing_account_name: string;
  workspaces: string;
  monthly_fee: string;
  function_usage_fee: string;
  storage_usage_fee: string;
  total_fee: string;
};

export type TSubscriptionUsageBillingAccount = {
  workspace_name: string;
  plan: string;
  monthly_fee: string;
  function_usage_fee: string;
  storage_usage_fee: string;
  total_fee: string;
};

export type TSubscriptionPaymentHistoryBillingAccount = {
  id: string;
  month: string;
  workspace_1: string;
  workspace_2: string;
  workspace_3: string;
  total_fee_month: string;
};

export type TSubscriptionPaymentHistoryOverview = {
  id: string;
  month: string;
  billing_account_total_fee: TSubscriptionUsageOverview[];
  total_fee_month: string;
};

export type TSubscriptionPaymentHistoryMonthList = {
  id: string;
  month: string;
  workspace_usage: TSubscriptionUsageBillingAccount[];
  total_fee_month: string;
  isInvoice: boolean;
};

export type TDatastoreGetDatastoreItems = {
  datastoreGetDatastoreItems: {
    totalItems: number;
    items: TDatastoreGetDatastoreItem[];
  };
};

export type TDatastoreGetDatastoreItem = {
  [key: string]: string;
  assignee: string;
  created_at: string;
  created_by: string;
  d_id: string;
  i_id: string;
  p_id: string;
  rev_no: string;
  status_id: string;
  title: string;
  unread: string;
};
