export type getApplicationAndDataStore = {
  application_id: string;
  name: string;
  display_id: string;
  datastores: TDatastore[];
}

export type TDatastore = {
  datastore_id: string;
  name: string;
}

export type ApplicationAndDataStore = {
  getApplicationAndDataStore?: getApplicationAndDataStore[];
  fetched?: boolean;
}
