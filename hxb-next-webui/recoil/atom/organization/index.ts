import { atom } from "recoil";
import { TOrganizations } from "./types";

export const organizationsState = atom<TOrganizations>({
  key: "organizations",
  default: {
    getOrganizations: [],
    fetched: false,
  },
});
