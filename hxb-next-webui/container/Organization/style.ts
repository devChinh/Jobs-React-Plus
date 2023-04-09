import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";

export const StyledTableCell = styled(TableCell)`
  font-weight: "bold";
  font-size: 14px;
  color: #9fa2b4;
`;

export const StyledDataTableCell = styled(TableCell)`
  font-size: 14px;
  color: #252733;
`;

export const RoleChip = styled(Chip)`
  font-weight: bold;
  font-size: 11px;
  background-color: #f12b2c;
  width: 62px;
  height: 24px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
`;
