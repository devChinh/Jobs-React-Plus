import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { useQuery } from "@apollo/client";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import { styled, Theme as MuiTheme } from "@mui/material/styles";
import { removeCookies } from "cookies-next";
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";

import CommonSelectOptions from "../../components/SelectOptions";
import { USERINFO_QUERY } from "../../graphql/dashboard";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import { userInfoState } from "../../recoil/atom/dashboard";
import {
  GetUserInfo,
  TDataComon,
  UserInfo,
} from "../../recoil/atom/dashboard/types";
import { organizationsState } from "../../recoil/atom/organization";
import { TOrganizations } from "../../recoil/atom/organization/types";
import { subscriptionsState } from "../../recoil/atom/subscription";
import { TSubscriptions } from "../../recoil/atom/subscription/types";
import { workspacesState } from "../../recoil/atom/workspace";
import { TWorkspaces } from "../../recoil/atom/workspace/types";
import * as styles from "./style";

interface MuiAppBarProps extends AppBarProps {
  onThemeChanged?: (darkMode: boolean) => void;
  open?: boolean;
  setTheme?: React.Dispatch<React.SetStateAction<MuiTheme>>;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<MuiAppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const HeaderLayout = (props: MuiAppBarProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { darkMode, setDarkMode } = useContext(ColorModeContext);

  const [w] = useRecoilState<TWorkspaces>(workspacesState);
  const [s] = useRecoilState<TSubscriptions>(subscriptionsState);
  const [o] = useRecoilState<TOrganizations>(organizationsState);
  const [userInfo, setUserInfo] = useRecoilState<GetUserInfo>(userInfoState);
  const { data } = useQuery<UserInfo>(USERINFO_QUERY);
  const [selectedData, setselectedData] = useState<TDataComon[]>([]);
  const [title, setTitle] = useState("");
  const language = useMemo(() => {
    return router.locale;
  }, [router.locale]);
  const isWorkspace = router.pathname.includes("workspace");
  const isSubscription = router.pathname.includes("subscription");
  const isOrganization = router.pathname.includes("organization");

  useEffect(() => {
    const data: TDataComon[] = [];
    if (isWorkspace) {
      if (w.workspaces && w.workspaces.workspaces) {
        w.workspaces.workspaces.forEach((item) => {
          data.push({
            id: item.workspace_id,
            name: item.workspace_name,
          });
        });
      }
      setTitle("workspace");
    }
    if (isOrganization) {
      if (o.getOrganizations) {
        o.getOrganizations.forEach((item) => {
          data.push({
            id: item.id,
            name: item.name,
          });
        });
      }
      setTitle("organization");
    }
    if (isSubscription) {
      if (s.subscriptions && s.subscriptions.subscriptions) {
        s.subscriptions.subscriptions.forEach((item) => {
          data.push({
            id: item.subscription_id,
            name: item.organization_name,
          });
        });
      }
      setTitle("subscription");
    }
    setselectedData(data);
  }, [w, s, o, isWorkspace, isSubscription, isOrganization]);

  useEffect(() => {
    if (data && data.userInfo) {
      setUserInfo(data.userInfo);
    }
  }, [data, setUserInfo]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  const {
    query: { dynamic, id },
  } = router;

  const logoutAction = async () => {
    await removeCookies("token");
    router.push("/auth/login");
  };

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        borderBottom: "1px solid rgba(130, 130, 130, 0.5)",
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "48px!important",
          pr: "17px!important", // keep right padding when drawer closed
          pl: "17px!important",
          justifyContent: "space-between",
        }}
      >
        {title !== "" ? (
          <CommonSelectOptions data={selectedData} title={title} />
        ) : (
          <div></div>
        )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl variant="standard" sx={{ mr: 2, minWidth: 110 }}>
            <Select
              id="language-select"
              size="small"
              value={language}
              MenuProps={{
                sx: {
                  "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                    {
                      backgroundColor: "#00c6ab",
                    },
                  "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                    {
                      backgroundColor: "#00c6ab",
                    },
                },
              }}
              onChange={(e) =>
                router.push(router.asPath, undefined, {
                  locale: e.target.value,
                })
              }
            >
              <MenuItem value="en">{t("english")}</MenuItem>
              <MenuItem value="ja">{t("japanese")}</MenuItem>
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <styles.MaterialUISwitch
                  checked={darkMode}
                  onChange={handleToggle}
                />
              }
              label=""
            />
          </FormGroup>
          <IconButton color="inherit" onClick={logoutAction} sx={{ p: 1.5 }}>
            <LogoutIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Typography sx={{ fontSize: 12, p: 0, ml: "39px" }} variant="body2">
            {userInfo?.username}
          </Typography>
          <Avatar sx={{ ml: "9px" }}>
            {/* <Image
I            alt="avt"
            src={`${userInfo?.profile_pic}`}
            width="20px"
            height="20px"
          /> */}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderLayout;
