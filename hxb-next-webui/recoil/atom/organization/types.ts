export type TOrganization = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  is_admin?: boolean;
};

export type TGetOrganization = {
  getOrganization: TOrganization;
};

export type TOrganizations = {
  getOrganizations?: TOrganization[];
  fetched?: boolean;
};

export type TWorkspace = {
  w_id: string;
  name: string;
};

export type TWorkspaceInOrg = {
  getWorkspacesInOrganization: TWorkspace[];
};

export type TWorkspacesCanAddOrg = {
  getWorkspacesCanAddOrganization: TWorkspace[];
};

export type TPaymentCard = {
  card_id: string;
  card_name: string;
  card_type: string;
  card_number: string;
  card_date: string;
  card_cvc: number;
};
export type TCardInOrg = {
  ID: number;
  card_id: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  name: string;
};

export type TUserInOrg = {
  user_id: string;
  user_name: string;
  email: string;
};

export type TGetUserInOrg = {
  getUserInOrganization: TUserInOrg[];
};

export type TGetCardInOrg = {
  getCardInOrganization: TCardInOrg[];
};
export type TGetAllOrganization = {
  getOrganization: TOrganization;
  getUserInOrganization: TUserInOrg[];
  getWorkspacesInOrganization: TWorkspace[];
  getWorkspacesCanAddOrganization: TWorkspace[];
  getCardInOrganization: TCardInOrg[];
};

type TPlanPrice = {
  id: string;
  name: string;
};

export type TOrgPlan = {
  id: string;
  name: string;
  description: string;
  prices: TPlanPrice[];
};
export type TGetProductsDetailTripe = {
  getProductsSTripe: TOrgPlan[];
};
