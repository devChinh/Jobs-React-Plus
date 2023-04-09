import { Accordion, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Container = styled("div")`
  width: 100%;
  display: flex;
`;
export const Title = styled("h1")``;
export const TableRowCustom = styled(TableRow)`
  background-image: unset;
  box-shadow: unset;
`;
export const AccordionCustom = styled(Accordion)`
  background-image: unset;
  box-shadow: unset;
  &:before {
    all: unset;
  }
`;

export const StyledTableCell = styled(TableCell)`
  font-weight: "bold";
  font-size: 14px;
  color: #9fa2b4;
`;
