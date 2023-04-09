import React, { useContext } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ColorModeContext from "../../modules/styles/ColorModeContext";
import {
  datastoreCurrentSelectedState,
  datastorePanelState,
  datastoreSelectedState,
  itemTableSelectedState,
  openModalDatastoreSettingState,
} from "../../recoil/atom/workspace";

const EnhancedTableToolbar: React.FC<{}> = () => {
  const { darkMode } = useContext(ColorModeContext);

  const datastoreCurrentSelected = useRecoilValue(
    datastoreCurrentSelectedState
  );
  const setDatastoreSelected = useSetRecoilState(datastoreSelectedState);
  const setOpenModalDatastoreSetting = useSetRecoilState(
    openModalDatastoreSettingState
  );
  const setDatastorePanel = useSetRecoilState(datastorePanelState);
  const setItemTableSelected = useSetRecoilState(itemTableSelectedState);

  const handleClickSettingIcon = () => {
    setDatastoreSelected(datastoreCurrentSelected);
    setOpenModalDatastoreSetting(true);
  };

  const handleClickAddIcon = () => {
    setDatastorePanel({ action: "NEW", open: true });
    setItemTableSelected({});
  };

  return (
    <Toolbar
      sx={{
        backgroundColor: "background.tableToolbar",
        justifyContent: "space-between",
        pr: { xs: 1, sm: 1, xl: "26px" },
        pl: { sm: 0, xl: 0 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Divider
          orientation={"vertical"}
          sx={{
            mr: "15px",
            width: "5px",
            border: "unset",
            backgroundColor: darkMode ? "transparent" : "#252733",
            height: "64px",
          }}
        />
        <Typography
          sx={{
            flex: "1 1 100%",
            fontSize: "20px",
            lineHeight: "24px",
            color: "text.primary",
          }}
          variant="subtitle1"
          component="div"
        >
          {datastoreCurrentSelected.name}
        </Typography>
      </Box>

      {/* hide datastore setting icon */}
      <Box
        className="box-icon"
        sx={{
          display: "flex",
          alignItem: "center",
        }}
      >
        <IconButton
          onClick={handleClickAddIcon}
          color="inherit"
          sx={{ p: 0, ml: "18px" }}
        >
          <AddIcon fontSize="medium" sx={{ color: "icon.primary" }} />
        </IconButton>
        {/* <IconButton
          onClick={handleClickSettingIcon}
          color="inherit"
          sx={{ p: 0, ml: "18px" }}
        >
          <SettingsIcon fontSize="medium" sx={{ color: "icon.primary" }} />
        </IconButton> */}
      </Box>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
