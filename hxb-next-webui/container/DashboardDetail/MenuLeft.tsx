import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import {
  Box,
  Divider,
  Link,
  ListItem,
  ListItemIcon,
  Toolbar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

import ColorModeContext from "../../modules/styles/ColorModeContext";
import logoWthDark from "/public/images/hexa-vertical-dark.svg";
import logoWth from "/public/images/logo_white_vertical.png";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const drawerWidth: number = 220;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    background: theme.palette.mode === "dark" ? "#292A2E" : "#fff",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(6),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(6),
      },
    }),
  },
}));

const MenuLeft = () => {
  const { push: routerPush } = useRouter();
  const { darkMode } = useContext(ColorModeContext);
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        backgroundColor: "background.grey",
        height: "100%",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          px: [0],
        }}
      >
        <Link onClick={() => routerPush("/dashboard")}>
          <Box sx={{ p: 0 }}>
            <Image
              alt="HEXABASE"
              width={46}
              height={143}
              src={darkMode ? logoWth : logoWthDark}
            />
          </Box>
        </Link>
      </Toolbar>
      <Divider
        sx={{
          ml: "auto",
          mr: "auto",
          borderColor: "#565658",
          mt: "25px",
          mb: "21px",
          width: "20px",
        }}
      />
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/dashboard")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="dashboard"
            src={
              router.pathname.includes("dashboard")
                ? "/icons/dashboard-selected.svg"
                : `/icons/dashboard-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/workspace")}
      >
        <ListItemIcon
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            ml: "-1px",
          }}
        >
          <Image
            alt="workspace"
            src={
              router.pathname.includes("workspace")
                ? "/icons/workspace-selected.svg"
                : `/icons/workspace-${darkMode ? "white" : "black"}.svg`
            }
            width="22px"
            height="22px"
          />
        </ListItemIcon>
      </ListItem>
      {/*
      <Divider
        sx={{
          ml: "auto",
          mr: "auto",
          borderColor: "#565658",
          mt: "30px",
          mb: "30px",
          width: "20px",
        }}
      />
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/sample-project")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <SmartToyOutlinedIcon
            sx={{
              color: router.pathname.includes("sample-project")
                ? "#00c6ab"
                : "inherit",
              width: "22px",
              height: "22px",
            }}
          />
        </ListItemIcon>
      </ListItem>
      */}
      <Divider
        sx={{
          ml: "auto",
          mr: "auto",
          borderColor: "#565658",
          mt: "30px",
          mb: "30px",
          width: "20px",
        }}
      />
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/log")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <ManageSearchIcon
            sx={{
              color: router.pathname.includes("log") ? "#00c6ab" : "inherit",
              width: "22px",
              height: "22px",
            }}
          />
        </ListItemIcon>
      </ListItem>
      {/* <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/project")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="project"
            src={
              router.pathname.includes("project")
                ? "/icons/deployed-selected.svg"
                : `/icons/deployed-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/dashboard")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="deployed-app"
            src={
              router.pathname.includes("deployed-app")
                ? "/icons/deployed-selected.svg"
                : `/icons/deployed-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/dashboard")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="template"
            src={
              router.pathname.includes("template")
                ? "/icons/template-selected.svg"
                : `/icons/template-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem>
      <Divider /> */}
      {/* <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/organization")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="organization"
            src={
              router.pathname.includes("organization")
                ? "/icons/organization-selected.svg"
                : `/icons/organization-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/subscription")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="subscription"
            src={
              router.pathname.includes("subscription")
                ? "/icons/subscription-selected.svg"
                : `/icons/subscription-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem> */}
      {/* <ListItem
        sx={{ pt: "15px", pb: "15px", pl: 0, pr: 0 }}
        button
        onClick={() => routerPush("/dashboard")}
      >
        <ListItemIcon
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Image
            alt="user-profile"
            src={
              router.pathname.includes("user-profile")
                ? "/icons/template-selected.svg"
                : `/icons/template-${darkMode ? "white" : "black"}.svg`
            }
            width="20px"
            height="20px"
          />
        </ListItemIcon>
      </ListItem> */}
    </Drawer>
  );
};

export default MenuLeft;
