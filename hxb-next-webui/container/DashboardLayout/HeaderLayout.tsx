import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo } from "react";

import { useMutation, useQuery } from "@apollo/client";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Alert,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { styled } from "@mui/material/styles";
import { getCookies, removeCookies } from "cookies-next";
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";

import { USERINFO_QUERY } from "../../graphql/dashboard";
import { SET_CURRENT_WORKSPACE_MUTATION } from "../../graphql/workspace";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import { userInfoState } from "../../recoil/atom/dashboard";
import { GetUserInfo, UserInfo } from "../../recoil/atom/dashboard/types";
import { workspacesState } from "../../recoil/atom/workspace";
import { TWorkspace, TWorkspaces } from "../../recoil/atom/workspace/types";
import * as styles from "./style";

interface MuiAppBarProps extends AppBarProps {
  onThemeChanged?: (darkMode: boolean) => void;
  open?: boolean;
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
  const { darkMode, setDarkMode } = useContext(ColorModeContext);

  const [w, setWorkspaces] = useRecoilState<TWorkspaces>(workspacesState);
  const [userInfo, setUserInfo] = useRecoilState<GetUserInfo>(userInfoState);
  const router = useRouter();
  const [setCurrentWorkspace, { error, loading }] = useMutation(
    SET_CURRENT_WORKSPACE_MUTATION
  );
  const { data } = useQuery<UserInfo>(USERINFO_QUERY);

  const language = useMemo(() => {
    return router.locale;
  }, [router.locale]);

  useEffect(() => {
    if (data && data.userInfo) {
      setUserInfo(data.userInfo);
    }
  }, [data, setUserInfo]);

  const handleSetCurrentWorkspace = useCallback(
    (wid: string) => {
      setCurrentWorkspace({
        variables: {
          setCurrentWorkSpaceInput: {
            workspace_id: wid,
          },
        },
      });
      setWorkspaces({
        ...w,
        workspaces: {
          ...w.workspaces,
          current_workspace_id: wid,
        },
      });
    },
    [setCurrentWorkspace, setWorkspaces, w]
  );

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };
  const logoutAction = async () => {
    window.location.href = window.location.origin + "/api/auth/logout";
    const keys = Object.keys(await getCookies());
    const keysRemove = keys.filter((key) => key !== "darkMode");
    for (let key of keysRemove) {
      await removeCookies(key, {
        path: "/",
      });
    }
    // await removeCookies("appSession");
    // await removeCookies("token");
    router.push("/auth/login");
  };
  useEffect(() => {
    const workspaces = w?.workspaces?.workspaces || [];
    if (
      w.fetched &&
      (!w.workspaces?.current_workspace_id ||
        w.workspaces?.current_workspace_id === "") &&
      workspaces.length > 0
    ) {
      const ws: TWorkspace = workspaces[0];
      handleSetCurrentWorkspace(ws.workspace_id);
    }
  }, [handleSetCurrentWorkspace, w]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, marginLeft: "240px" }}
        >
          {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
            <styles.SelectCustom
              style={{ color: `${darkMode ? "#FFFFFF" : "#252733"}` }}
            >
              {w.workspaces &&
                w.workspaces.workspaces &&
                w.workspaces.workspaces.map((ws) => (
                  <option key={ws.workspace_id} value={ws.workspace_id}>
                    {ws.workspace_name}
                  </option>
                ))}
            </styles.SelectCustom>
          </FormControl> */}
        </Typography>
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
        <Typography
          sx={{
            fontSize: 12,
            p: 2,
            color: "text.primary",
          }}
          variant="body2"
        >
          {userInfo?.username}
        </Typography>
        <Avatar>
          {/* <Image
						alt="avt"
						src={`${userInfo?.profile_pic}`}
						width="20px"
						height="20px"
					/> */}
        </Avatar>
      </Toolbar>
      <Dialog
        open={!!error && !loading}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">Workspaces error!</Alert>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default HeaderLayout;
