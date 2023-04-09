export type getApplicationDatastores = {
  datastore_id: string;
  name: string;
  display_id: string;
  deleted: boolean;
  imported: boolean;
  uploading: boolean;
};

export type DataStore = {
  getApplicationDatastores?: getApplicationDatastores[];
  fetched?: boolean;
};

export type TValue = {
  access_key?: string;
  email?: string;
  media_link?: string;
  self_link?: string;
  user_id?: string;
  user_name?: string;
  contentType?: string;
  file_id?: string;
  filename?: string;
  filepath: string;
  mediaLink?: string;
  name?: string;
  selfLink?: string;
};

export type TFileValue = {
  contentType?: string;
  file_id?: string;
  filename?: string;
  filepath?: string;
  mediaLink?: string;
  name?: string;
  selfLink?: string;
  temporary: true;
};

export type TFileTypeField = {
  dataType: string;
  field_id: string;
  field_name: string;
  value: TFileValue[];
};

export type TFieldValues = {
  dataType: string;
  field_id: string;
  field_name: string;
  value: string | TValue[] | string[] | number | null;
};

export type getDatastoreItemDetails = {
  title: string;
  rev_no: number;
  field_values: TFieldValues[];
  status_list: string;
  item_actions: string;
  status_actions: string;
  status_order: string;
  status_action_order: string;
  item_action_order: string;
};

export type DataStoreItem = {
  getDatastoreItemDetails?: getDatastoreItemDetails;
  fetched?: boolean;
};

export type TField = {
  as_title?: boolean;
  dataType: string;
  datastore_id?: string;
  display_id: string | null;
  fieldIndex?: number;
  field_id?: string;
  full_text?: boolean;
  has_index: boolean;
  hide_from_api?: boolean;
  max_value?: string;
  min_value?: string;
  name: string;
  project_id?: string;
  search?: boolean;
  show_list?: boolean;
  status?: boolean;
  title_order?: number;
  unique: boolean;
  workspace_id?: string;
};

export type TFieldDatastore = {
  as_title?: boolean;
  dataType: string;
  datastore_id?: string;
  display_id: string | null;
  display_name: string;
  fieldIndex?: number;
  field_id?: string;
  full_text?: boolean;
  has_index: boolean;
  hide_from_api?: boolean;
  max_value?: string;
  min_value?: string;
  name: TDatastoreName | string;
  project_id?: string;
  search?: boolean;
  show_list?: boolean;
  status?: boolean;
  title_order?: number;
  unique: boolean;
  workspace_id?: string;
  value?: string | TValue[] | string[] | number | null;
  options?: {
    display_id: string;
    o_id: string;
    value: string;
  }[];
};

export type TDatastoreField = {
  [key: string]: {
    as_title: boolean;
    dataType: string;
    datastore_id: string;
    display_id: string;
    fieldIndex: number;
    field_id: string;
    full_text: boolean;
    has_index: boolean;
    hide_from_api: boolean;
    max_value: string;
    min_value: string;
    name: string;
    project_id: string;
    search: boolean;
    show_list: boolean;
    status: boolean;
    title_order: number;
    unique: boolean;
    workspace_id: string;
  };
};

export type DataStoreGetField = {
  datastoreGetFields: {
    field_layou: {
      [key: string]: {
        col: number;
        field_id: string;
        row: number;
        sizeX: number;
        sizeY: number;
      };
    };
    fields: TDatastoreField;
  };
};

export type TDatastoreName = {
  en: string;
  ja: string;
};

export type TDatastoreCreateFieldPayload = {
  name: TDatastoreName;
  dataType: string;
  unique: boolean;
  has_index: boolean;
  roles: string[];
  display_id: string | null;
};

export type TRole = {
  id: string;
  display_ID: string;
  name: string;
};

export type TDatastoreSetting = {
  id: string;
  names: TDatastoreName;
  display_id: string;
  roles: TRole[];
  fields: TField[];
};

export type TGetDatastoreSetting = {
  datastoreSetting: TDatastoreSetting;
};

export type TDatastoreStatus = {
  status_id: string;
  display_id: string;
  status_name: string;
};

export type TActionPanel = "VIEW" | "EDIT" | "NEW" | "HIDE";
