import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { useSetRecoilState } from "recoil";

import {
  datastorePanelState,
  deleteModalState,
  itemTableSelectedState,
} from "../../recoil/atom/workspace";

const ItemIdRenderer: React.FC<ICellRendererParams> = ({ data }) => {
  const setItemTableSelected = useSetRecoilState(itemTableSelectedState);
  const setDatastorePanel = useSetRecoilState(datastorePanelState);
  const setDeleteModal = useSetRecoilState(deleteModalState);

  const buttonEditClicked = () => {
    setItemTableSelected(data);
    setDatastorePanel({ action: "EDIT", open: true });
  };

  const buttonDeleteClicked = () => {
    setDeleteModal({ type: "deleteDatastoreItem", open: true });
  };

  return (
    <span>
      <IconButton aria-label="edit" size="small">
        <EditOutlinedIcon onClick={buttonEditClicked} fontSize="inherit" />
      </IconButton>
      <IconButton aria-label="delete" size="small">
        <DeleteOutlineOutlinedIcon
          onClick={buttonDeleteClicked}
          fontSize="inherit"
        />
      </IconButton>
    </span>
  );
};

export default ItemIdRenderer;
