import React, { useMemo } from "react";

import { Box, Modal, Typography } from "@mui/material";
import { useRecoilState } from "recoil";

import ButtonConfirm from "../../buttonConfirm";
import { deleteModalState } from "../../../recoil/atom/workspace";

interface Props {
  handleDeleteField?: () => void;
  handleClickCancel?: () => void;
}

const DeleteConfirm: React.FC<Props> = ({
  handleDeleteField,
  handleClickCancel,
}) => {
  const [deleteModal, setDeleteModal] = useRecoilState(deleteModalState);

  const typeModal = useMemo(() => {
    return deleteModal.type || "";
  }, [deleteModal]);

  const handleClickButtonCancel = () => {
    setDeleteModal({ open: false });
    handleClickCancel && handleClickCancel();
  };

  const handleClickButtonDelete = () => {
    setDeleteModal({ open: false });
    handleDeleteField && handleDeleteField();
  };

  return (
    <Box>
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "background.modal",
            color: "text.primary",
            border: "1px solid #555558",
            boxShadow: 24,
            p: 4,
            borderRadius: "5px",
          }}
        >
          <Typography id="spring-modal-title" variant="h6" component="h2" sx={{ mb: 5 }}>
            {typeModal === "deleteDatastoreItem"
              ? "Delete this Item?"
              : "Delete Field?"}
          </Typography>
          {typeModal !== "deleteDatastoreItem" && (
            <Typography id="spring-modal-description">
              Are you sure?
            </Typography>
          )}

          <Box>
            <ButtonConfirm
              buttonType={"cancel"}
              buttonClick={() => handleClickButtonCancel()}
            />
            <ButtonConfirm
              buttonType={"delete"}
              buttonClick={() => handleClickButtonDelete()}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeleteConfirm;
