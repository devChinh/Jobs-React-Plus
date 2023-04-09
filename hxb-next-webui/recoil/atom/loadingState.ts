import { atom } from "recoil";

export type LoadingCollectionType = Record<string, string>;

export const loadingState = atom({
  key: "loadingState",
  default: {} as LoadingCollectionType,
});
