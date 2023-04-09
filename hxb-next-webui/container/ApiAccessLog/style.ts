import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BoxDetail = styled(Box)`
  padding: 0 17px 10px;
  display: flex;
`;

export const TextTitleDetail = styled(Typography)`
  width: 150px;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
`;

export const TextContentDetail = styled(Typography)`
  width: 100%;
  color: #acacae;
  font-size: 14px;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
`;
