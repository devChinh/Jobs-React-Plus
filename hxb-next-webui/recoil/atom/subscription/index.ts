import { atom } from "recoil";
import { TSubscriptions } from "./types";

export const subscriptionsState = atom<TSubscriptions>({
  key: "subscriptions",
  default: {
    subscriptions: {
      subscriptions: [],
      current_subscription_id: undefined,
    },
    fetched: false,
  },
});
