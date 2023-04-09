import { Box, Chip, Paper, styled, Typography } from "@mui/material";

export const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.9),
  textAlign: "center",
  color: theme.palette.text.secondary,
  minHeight: 134,
  cursor: "pointer",
  border: "1px solid #565659",
  transition: "all .2s",
  "&:hover": {
    border: "1px solid",
    borderColor: "#00c6ab",
    padding: theme.spacing(0.9),
    "& .cardTitle": {
      color: "#00c6ab",
    },
    "& .cardContent": {
      color: "#00c6ab",
    },
  },
}));

export const CardTitle = styled(Typography)`
  font-style: normal;
  font-weight: bold;
  font-size: 19px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.4px;
  color: #9fa2b4;
  padding-top: 12px;
`;

export const CardContent = styled(Typography)`
  font-style: normal;
  font-weight: bold;
  font-size: 40px;
  line-height: 50px;
  text-align: center;
  letter-spacing: 0.4px;
  padding-top: 12px;
`;

export const ChartTitle = styled(Typography)`
  font-style: normal;
  font-weight: bold;
  font-size: 19px;
  line-height: 24px;
  letter-spacing: 0.4px;
`;

export const ChartDate = styled(Typography)`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: #9fa2b4;
`;

export const AnalyticsTitle = styled(Typography)`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #9fa2b4;
`;

export const StatusChip = styled(Chip)`
  font-weight: bold;
  font-size: 11px;
  line-height: 14px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #ffffff;
  background: #00c6ab;
  width: 100px;
  margin: 2px;
`;

export const AnalyticsContent = styled(Typography)`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
`;

export const BoxModal = styled(Box)`
  width: 800px;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 32px;
`;
