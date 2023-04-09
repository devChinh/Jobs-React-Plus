import React from "react";

import { Menu, MenuItem } from "@mui/material";
import { SetterOrUpdater } from "recoil";

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  textEdit?: string;
  textDelete?: string;
  setOpenModalSetting?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalArchive?: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenEditCard?: () => void;
  setOpenModalDeleteConfirm?: SetterOrUpdater<{
    type?: string | undefined;
    open: boolean;
  }>;
}

const ITEM_HEIGHT = 48;

const MenuMoreVert: React.FC<Props> = ({
  anchorEl,
  setAnchorEl,
  textEdit,
  textDelete,
  setOpenModalSetting,
  setOpenModalArchive,
  handleOpenEditCard,
  setOpenModalDeleteConfirm,
}) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    if (setOpenModalSetting) setOpenModalSetting(true);
    if (handleOpenEditCard) handleOpenEditCard();
  };

  const handleClickDelete = () => {
    if (setOpenModalArchive) setOpenModalArchive(true);
    if (setOpenModalDeleteConfirm)
      setOpenModalDeleteConfirm({ type: "deleteField", open: true });
  };

  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: "20ch",
        },
      }}
    >
      {setOpenModalDeleteConfirm ? null : (
        <MenuItem onClick={handleClickEdit}>{textEdit}</MenuItem>
      )}

      {textDelete && (
        <MenuItem sx={{ color: "#FF7979" }} onClick={handleClickDelete}>
          {textDelete}
        </MenuItem>
      )}
    </Menu>
  );
};

export default MenuMoreVert;
