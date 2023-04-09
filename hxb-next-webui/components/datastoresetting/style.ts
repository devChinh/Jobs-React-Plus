import { Box, FormLabel, TableCell, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BoxModal = styled(Box)`
  width: 80vw;
  height: 90vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 5px;
`;
export const FormLabelCustom = styled(FormLabel)`
  width: 140px;
`;
export const ToolbarCustom = styled(Toolbar)`
  margin-top: 14px;
`;
export const StyledTableCell = styled(TableCell)`
  font-weight: "bold";
  font-size: 14px;
  color: #9fa2b4;
`;
