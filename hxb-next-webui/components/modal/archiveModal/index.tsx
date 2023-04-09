import React from "react";

import {
  Box,
  Button,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRecoilValue } from "recoil";

import {
  datastoreSelectedState,
  projectSelectedState,
} from "../../../recoil/atom/workspace";
import { TWorkspace } from "../../../recoil/atom/workspace/types";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  data?: TWorkspace;
  subtitle?: string | React.ReactNode;
  textButtonDelete?: string;
  isDeleteDatastore?: boolean;
  isDeleteProject?: boolean;
  handleDeleteProject?: () => Promise<void>;
}

const ModalArchive: React.FC<Props> = ({
  open,
  setOpen,
  title,
  data,
  subtitle,
  textButtonDelete,
  isDeleteDatastore,
  isDeleteProject,
  handleDeleteProject,
}) => {
  const { t } = useTranslation("common");

  const datastoreSelected = useRecoilValue(datastoreSelectedState);
  const projectSelected = useRecoilValue(projectSelectedState);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    handleDeleteProject && handleDeleteProject();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          backgroundColor: "background.modal",
          color: "text.primary",
          border: "1px solid #555558",
          boxShadow: 24,
          p: 4,
          borderRadius: "5px",
        }}
      >
        <Typography
          sx={{ color: "text.primary", m: 0 }}
          variant="h5"
          component="div"
          gutterBottom
        >
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Toolbar>
            <Typography sx={{ color: "text.primary" }} variant="h6">
              {subtitle}
            </Typography>
          </Toolbar>
          <Toolbar>
            <TextField
              sx={{
                backgroundColor: "organization.background.default",
                borderRadius: "10px",
              }}
              value={
                data
                  ? data.workspace_name
                  : isDeleteDatastore
                  ? datastoreSelected.name
                  : isDeleteProject && projectSelected
                  ? projectSelected.name
                  : ""
              }
              fullWidth
              size={"small"}
              disabled
            />
          </Toolbar>
          <Toolbar>
            <Button
              sx={{
                color: "text.primary",
                fontSize: "14px",
                lineHeight: "24px",
                borderColor: "#FF7979",
                backgroundColor: "#FF7979",
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: "72px",
                height: "31px",
                borderRadius: "5px",
              }}
              variant="outlined"
              disableRipple
              onClick={handleDelete}
            >
              {textButtonDelete}
            </Button>
            <Button
              sx={{
                color: "text.primary",
                fontSize: "14px",
                lineHeight: "24px",
                borderColor: "#acacae",
                backgroundColor: "#acacae",
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: "72px",
                height: "31px",
                borderRadius: "5px",
                ml: "15px",
              }}
              variant="outlined"
              disableRipple
              onClick={handleClose}
            >
              {t("cancel")}
            </Button>
          </Toolbar>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalArchive;
