export type TDynamicKey = {
  [key: string]: string | number;
};
export type TWorkspace = {
  workspace_id: string;
  workspace_name: string;
};

export type TWorkspaceInfo = {
  workspaces?: TWorkspace[];
  current_workspace_id?: string;
};

export type TWorkspaces = {
  workspaces?: TWorkspaceInfo;
  fetched?: boolean;
  loading: boolean;
};

export type TApplicationAndDataStore = {
  application_id: string;
  name: string;
  display_id: string;
  datastores: TWorkspaceDetailDatastoresItem[];
};

export type TWorkspaceDetail = {
  getApplicationAndDataStore: TApplicationAndDataStore[];
};
export type TWorkspaceDetailDatastoresItem = {
  datastore_id: string;
  display_id: string;
  name: string;
};

export type TDatastoreGetDatastoreItems = {
  datastoreGetDatastoreItems: {
    totalItems: number;
    items: TDatastoreGetDatastoreItem[];
  };
  loading: boolean;
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

export type TCategory = {
  category: string;
  templates: TTemplate[];
};

export type TTemplates = {
  getTemplates: {
    categories: TCategory[];
  };
  enabled: boolean;
};

export type TTemplate = {
  tp_id: string;
  name: string;
  description: string;
};

export type TTDatastoreField = {
  field_id: string;
  name: string;
  display_id: string;
  dataType: string;
  unique: boolean;
  has_index: boolean;
  options?: {
    display_id: string;
    option_id: string;
    value: string;
  }[];
};

export type TTDatastoreFieldLayout = {
  field_id: string;
  sizeX: number;
  sizeY: number;
  col: number;
  row: number;
};

export type TDatastoreFields = {
  [key: string]: TTDatastoreField;
};

export type TDatastoreFieldLayout = {
  [key: string]: TTDatastoreFieldLayout[];
};

export type TDatastoreGetFields = {
  datastoreGetFields: {
    fields: TDatastoreFields;
    field_layout: TDatastoreFieldLayout;
  };
};
