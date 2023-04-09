import React from "react";

import { Box, Container, CssBaseline } from "@mui/material";

import Notification from "../../components/Notification";
import RootWorkspace from "../RootWorkspace";
import HeaderLayout from "./HeaderLayout";
import MenuLeft from "./MenuLeft";

const DashboardLayout: React.FC<React.PropsWithChildren<{}>> = ({ children, ...props }) => {
  return (
    <RootWorkspace>
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
        <HeaderLayout />
        <MenuLeft />
        <Container sx={{ mt: 12, mb: 4 }}>{children}</Container>
      </Box>
      <Notification />
    </RootWorkspace>
  );
};

export default DashboardLayout;
