import { getCookie } from "cookies-next";
import { atom } from "recoil";
import { GetUserInfo, Theme } from "./types";

export const dashboardState = atom<Theme>({
  key: "dashboard",
  default: {
    darkMode: !!getCookie("darkMode"),
  },
});

export const userInfoState = atom<GetUserInfo>({
  key: "userInfo",
  default: {
    username: "",
    email: "",
    profile_pic: "",
    u_id: "",
    current_workspace_id: "",
    is_ws_admin: "",
  },
});
