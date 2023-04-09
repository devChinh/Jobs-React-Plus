import { Chip, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTableCell = styled(TableCell)`
  font-weight: "bold";
  font-size: 14px;
  color: #9fa2b4;
`;

export const StyledDataTableCell = styled(TableCell)`
  font-size: 14px;
  color: #252733;
`;

export const WorkspaceChip = styled(Chip)`
  font-weight: bold;
  font-size: 11px;
  background-color: #2d9cdb;
  width: 62px;
  height: 24px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
`;
