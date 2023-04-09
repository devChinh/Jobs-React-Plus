import { Accordion, Box, FormLabel, TableRow, Toolbar } from "@mui/material";
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

export const ToolbarCustom = styled(Toolbar)`
  margin-top: 14px;
`;

export const FormLabelCustom = styled(FormLabel)`
  width: 140px;
`;

export const BoxModal = styled(Box)`
  width: 800px;
  height: 297px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 32px;
`;
export const AccordionCustom = styled(Accordion)`
  background-image: unset;
  box-shadow: unset;
  &:before {
    all: unset;
  }
`;
