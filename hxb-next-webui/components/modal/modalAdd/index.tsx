import React, { useState } from "react";

import {
  Backdrop,
  Box,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";

import { TWorkspace } from "../../../recoil/atom/organization/types";
import ButtonConfirm from "../../buttonConfirm";
import * as styles from "./style";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  sx: {
    "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "#00c6ab",
    },
    "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "#00c6ab",
    },
  },
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: TWorkspace[];
  setSelectedWorkspaceId?: React.Dispatch<React.SetStateAction<string>>;
  handleAddWorkspaceToOrg?: () => Promise<void>;
}

const ModalAdd: React.FC<Props> = ({
  open,
  setOpen,
  data,
  setSelectedWorkspaceId,
  handleAddWorkspaceToOrg,
}) => {
  const { t } = useTranslation("common");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const handleChangeWorkspaceSelect = (event: SelectChangeEvent) => {
    setSelectedWorkspace(event.target.value as string);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <styles.BoxModal sx={{ backgroundColor: "background.boxModal" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Typography
              sx={{ color: "text.primary" }}
              variant="h5"
              component="div"
              gutterBottom
            >
              {t("add_workspace")}
            </Typography>
            <Toolbar
              sx={{
                minHeight: "14px!important",
                padding: "0px!important",
              }}
            >
              <FormLabel
                sx={{
                  color: "text.primary",
                  width: "140px",
                  p: 0,
                }}
              >
                {t("workspace")}
              </FormLabel>
              <Box sx={{ minWidth: 300 }}>
                <FormControl
                  fullWidth
                  sx={{
                    ml: 8,
                    color: "text.primary",
                    height: "26px",
                  }}
                >
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedWorkspace}
                    onChange={handleChangeWorkspaceSelect}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    MenuProps={MenuProps}
                    sx={{
                      backgroundColor: "background.boxModal",
                      color: "text.select",
                      height: "60px",
                      border: "1px solid",
                      borderColor: "borderColor.default",
                      borderRadius: "5px",
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    {data &&
                      data.map((item) => (
                        <MenuItem
                          key={item.w_id}
                          value={item.w_id}
                          onClick={() => {
                            if (setSelectedWorkspaceId)
                              setSelectedWorkspaceId(item.w_id);
                          }}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Toolbar>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "end",
              }}
            >
              <ButtonConfirm
                buttonType={"cancel"}
                buttonClick={() => setOpen(false)}
              />
              <ButtonConfirm
                buttonType={"save"}
                buttonClick={() =>
                  handleAddWorkspaceToOrg && handleAddWorkspaceToOrg()
                }
              />
            </Toolbar>
          </Box>
        </styles.BoxModal>
      </Fade>
    </Modal>
  );
};

export default ModalAdd;
