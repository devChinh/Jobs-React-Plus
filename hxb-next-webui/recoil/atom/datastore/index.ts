import { atom } from "recoil";
import { TDatastoreGetDatastoreItems } from "../workspace/types";

export const datastoreGetDatastoreItemsState =
  atom<TDatastoreGetDatastoreItems>({
    key: "datastore",
    default: {
      datastoreGetDatastoreItems: {
        totalItems: 0,
        items: [],
      },
      loading: false,
    },
  });
