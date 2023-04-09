import React, { useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material";

interface Props {
  setOpenDataSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoreVertComponent: React.FC<Props> = ({ setOpenDataSetting }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openMoreIcon = Boolean(anchorEl);
  const idMoreIcon = openMoreIcon ? "simple-popover" : undefined;

  const handleClickMoreIcon = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreIcon = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (setOpenDataSetting) {
      setOpenDataSetting(true);
    }
  };
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-haspopup="true"
        aria-describedby={idMoreIcon}
        onClick={handleClickMoreIcon}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        id={idMoreIcon}
        open={openMoreIcon}
        anchorEl={anchorEl}
        onClose={handleCloseMoreIcon}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List sx={{ minWidth: "144px" }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleEdit}>
              <ListItemText primary="Edit" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Delete" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default MoreVertComponent;
