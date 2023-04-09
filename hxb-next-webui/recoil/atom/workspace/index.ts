import { atom } from "recoil";
import { TStatus } from "../common/types";

import {
  getApplicationDatastores,
  TActionPanel,
  TDatastoreField,
} from "../datastore/types";
import {
  TApplicationAndDataStore,
  TDatastoreFields,
  TDynamicKey,
  TTemplates,
  TWorkspaceDetail,
  TWorkspaces,
} from "./types";

export const workspacesState = atom<TWorkspaces>({
  key: "workSpaces",
  default: {
    workspaces: {
      workspaces: [],
      current_workspace_id: undefined,
    },
    fetched: false,
    loading: false,
  },
});

export const applicationAndDatastoreState = atom<TWorkspaceDetail | undefined>({
  key: "applicationAndDatastore",
  default: undefined,
});

const datastoreSelectedDefault: getApplicationDatastores = {
  datastore_id: "",
  name: "",
  display_id: "",
  deleted: false,
  imported: false,
  uploading: false,
};

export const datastoreSelectedState = atom<getApplicationDatastores>({
  key: "datastoreSelected",
  default: datastoreSelectedDefault,
});

export const datastoreCurrentSelectedState = atom<getApplicationDatastores>({
  key: "datastoreCurrentSelected",
  default: datastoreSelectedDefault,
});

export const openModalDatastoreSettingState = atom<boolean>({
  key: "openModalDatastoreSetting",
  default: false,
});

export const datastorePanelState = atom<{
  action: TActionPanel;
  open: boolean;
}>({
  key: "datastorePanel",
  default: {
    open: false,
    action: "HIDE",
  },
});

export const deleteModalState = atom<{ type?: string; open: boolean }>({
  key: "deleteModal",
  default: {
    open: false,
  },
});

export const datastoreFieldsState = atom<TDatastoreField | undefined>({
  key: "datastoreFields",
  default: undefined,
});

export const openNotificationState = atom<boolean>({
  key: "openNotification",
  default: false,
});

export const notificationState = atom<{
  open: boolean;
  severity: TStatus;
  message: string;
}>({
  key: "notification",
  default: {
    open: false,
    severity: "success",
    message: "",
  },
});

export const projectSelectedState = atom<TApplicationAndDataStore | undefined>({
  key: "projectSelected",
  default: undefined,
});

export const datastoresState = atom<getApplicationDatastores[] | undefined>({
  key: "datastores",
  default: undefined,
});

export const templatesState = atom<TTemplates>({
  key: "templates",
  default: {
    getTemplates: {
      categories: [],
    },
    enabled: false,
  },
});

export const templateIdSelectedState = atom<string>({
  key: "templateIdSelected",
  default: "",
});

export const itemTableSelectedState = atom<TDynamicKey>({
  key: "itemTableSelected",
  default: {},
});

export const dataColumnState = atom<TDatastoreFields>({
  key: "dataColumn",
  default: {},
});
