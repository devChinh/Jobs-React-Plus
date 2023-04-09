import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import logoBlk from "/public/images/logo_b.png";
import logoWth from "/public/images/logo_w.png";
import { useTranslation } from "next-i18next";

import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Box,
  Divider,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

import ColorModeContext from "../../modules/styles/ColorModeContext";

const drawerWidth: number = 220;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    background: theme.palette.mode === "dark" ? "#292A2E" : "#fff",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
    ".logo": {
      display: "flex",
      padding: "20px",
      minHeight: "128px",
    },
    ".MuiButtonBase-root": {
      minHeight: "50px",
      paddingLeft: "19px",
    },
    ".divider-nav": {
      marginLeft: "20px",
      width: "40px",
      borderColor: "#565658",
      marginBottom: "68px",
      "&.break-nav": {
        marginTop: "30px",
        marginBottom: "30px",
      },
    },
  },
}));

const MenuLeft = () => {
  const { t } = useTranslation("common");
  const { darkMode } = useContext(ColorModeContext);

  const { push: routerPush } = useRouter();
  const router = useRouter();

  const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          minHeight: "100vh",
          whiteSpace: "normal",
        },
      }}
    >
      <Box>
        <Toolbar className="logo">
          <Link component="button" onClick={() => routerPush("/dashboard")}>
            <Box>
              {!darkMode ? (
                <Image alt="Hexabase" src={logoBlk} width={140} height={45} />
              ) : (
                <Image alt="Hexabase" src={logoWth} width={140} height={45} />
              )}
            </Box>
          </Link>
        </Toolbar>
        <Divider className="divider-nav" />
        <ListItemButton onClick={() => routerPush("/dashboard")}>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <Image
              alt="dashboard"
              src={
                router.pathname == "/dashboard"
                  ? "/icons/dashboard-selected.svg"
                  : `/icons/dashboard-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("dashboard")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/dashboard"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItemButton>
        <ListItemButton onClick={() => routerPush("/workspace")}>
          <ListItemIcon sx={{ minWidth: "40px", ml: "-1px" }}>
            <Image
              alt="workspace"
              src={
                router.pathname == "/workspace"
                  ? "/icons/workspace-selected.svg"
                  : `/icons/workspace-${darkMode ? "white" : "black"}.svg`
              }
              width="22px"
              height="22px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("workspace")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/workspace"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItemButton>
        {/*
        <Divider className="divider-nav break-nav" />
        <ListItem button onClick={() => routerPush("/sample-project")}>
          <ListItemIcon sx={{ minWidth: "40px", ml: "-1px" }}>
          <SmartToyOutlinedIcon
              sx={{
                color: (theme) =>
                  router.pathname == "/sample-project"
                    ? "#00c6ab"
                    : theme.palette.text.primary,
              }}
            />
            <Image
              alt="sampleProject"
              src={
                router.pathname == "/sample-project"
                  ? "/icons/workspace-selected.svg"
                  : `/icons/workspace-${darkMode ? "white" : "black"}.svg`
              }
              width="22px"
              height="22px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("sample_project")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/sample-project"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem>
        */}
        <Divider className="divider-nav break-nav" />
        <ListItemButton onClick={() => routerPush("/log")}>
          <ListItemIcon sx={{ minWidth: "40px", ml: "-1px" }}>
            <ManageSearchIcon
              sx={{
                color: (theme) =>
                  router.pathname == "/log"
                    ? "#00c6ab"
                    : theme.palette.text.primary,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={t("logs")}
            sx={{
              whiteSpace: "normal",
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/log"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItemButton>
        {/* <ListItem button onClick={() => routerPush("/project")}>
          <ListItemIcon sx={{minWidth:"40px"}}>
            <Image
              alt="project"
              src={
                router.pathname == "/project"
                  ? "/icons/project-selected.svg"
                  : `/icons/project-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("projects")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px"
              },
              color: (theme) =>
                router.pathname == "/project"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem>
        <ListItem button onClick={() => routerPush("/dashboard")}>
          <ListItemIcon>
            <Image
              alt="deployed-app"
              src={
                router.pathname == "/deployed-app"
                  ? "/icons/deployed-selected.svg"
                  : `/icons/deployed-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("deployed_app")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px"
              },
              color: (theme) =>
                router.pathname == "/deployed-app"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem>
        <ListItem button onClick={() => routerPush("/dashboard")}>
          <ListItemIcon>
            <Image
              alt="template"
              src={
                router.pathname == "/template"
                  ? "/icons/template-selected.svg"
                  : `/icons/template-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("backend_templates")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px"
              },
              color: (theme) =>
                router.pathname == "/template"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem>
        <Divider /> */}
        {/* <ListItem button onClick={() => routerPush("/organization")}>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <Image
              alt="organization"
              src={
                router.pathname == "/organization"
                  ? "/icons/organization-selected.svg"
                  : `/icons/organization-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("organization")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/organization"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem>
        <ListItem button onClick={() => routerPush("/subscription")}>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <Image
              alt="subscription"
              src={
                router.pathname == "/subscription"
                  ? "/icons/subscription-selected.svg"
                  : `/icons/subscription-${darkMode ? "white" : "black"}.svg`
              }
              width="22px"
              height="22px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("subscription")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px",
              },
              color: (theme) =>
                router.pathname == "/subscription"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem> */}
        {/* <ListItem button onClick={() => routerPush("/dashboard")}>
          <ListItemIcon sx={{minWidth:"40px"}}>
            <Image
              alt="user-profile"
              src={
                router.pathname == "/user-profile"
                  ? "/icons/user-selected.svg"
                  : `/icons/user-${darkMode ? "white" : "black"}.svg`
              }
              width="20px"
              height="20px"
            />
          </ListItemIcon>
          <ListItemText
            primary={t("user_profile")}
            sx={{
              "&& .MuiListItemText-primary": {
                fontWeight: "bold",
                fontSize: "14px"
              },
              color: (theme) =>
                router.pathname == "/profile"
                  ? "#00c6ab"
                  : theme.palette.text.primary,
            }}
          />
        </ListItem> */}
      </Box>
    </Drawer>
  );
};

export default MenuLeft;
