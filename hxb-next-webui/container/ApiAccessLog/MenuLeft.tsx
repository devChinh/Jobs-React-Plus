import React from "react";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

const drawerWidth: number = 250;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "100%",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    "&::-webkit-scrollbar": {
      width: "0px",
      height: "0px",
    },
  },
}));

interface ApiAccessLogProps {}

const ApiAccessLogMenu: React.FC<ApiAccessLogProps> = ({}) => {
  const { t } = useTranslation("log");

  return (
    <Drawer variant="permanent" open={true}>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "background.paper",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            selected
            sx={{
              "&.Mui-selected": {
                backgroundColor: "background.boxModal",
                "&:hover": {
                  backgroundColor: "background.boxModal",
                },
              },
              "&:hover": {
                backgroundColor: "background.boxModal",
              },
            }}
          >
            <ListItemText primary={t("api_access_logs")} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ApiAccessLogMenu;
