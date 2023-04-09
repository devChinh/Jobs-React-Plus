import { atom } from "recoil";
import { TErrorSignup } from "./type";

export const errorSignupState = atom<TErrorSignup>({
  key: "errorSignup",
  default: {
    isError: false,
    message: undefined,
  },
});
