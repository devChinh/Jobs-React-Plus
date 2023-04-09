import React from "react";

import { Box, CssBaseline, Grid } from "@mui/material";

import Notification from "../../components/Notification";
import RootOrganization from "../RootOrganization";
import RootSubscription from "../RootSubcription";
import RootWorkspace from "../RootWorkspace";
import HeaderLayout from "./HeaderLayout";
import MenuLeft from "./MenuLeft";

const DashboardLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <RootWorkspace>
      <RootSubscription>
        <RootOrganization>
          <Box
            component="main"
            sx={{
              backgroundColor: "background.paper",
              flexGrow: 1,
              minHeight: "100vh",
              overflow: "auto",
              display: "flex",
            }}
          >
            <CssBaseline />
            <Box sx={{ flexShrink: 1 }}>
              <MenuLeft />
            </Box>

            <Box
              sx={{
                width: "100%",
                flexDirection: "column",
                overflow: "auto",
              }}
            >
              <HeaderLayout />
              <Grid container>{children}</Grid>
              <Notification />
            </Box>
          </Box>
        </RootOrganization>
      </RootSubscription>
    </RootWorkspace>
  );
};

export default DashboardLayout;
