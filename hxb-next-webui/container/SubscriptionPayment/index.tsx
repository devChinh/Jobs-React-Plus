import { Button, Collapse, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState } from "react";
import DashboardDetail from "../DashboardDetail";
import {
  TSubscriptionPaymentHistoryMonthList,
  TSubscriptionUsageBillingAccount,
} from "../../recoil/atom/subscription/types";
import * as styles from "./style";
import { useTranslation } from "next-i18next";

const mockDataUsageBillingAccount: TSubscriptionUsageBillingAccount[] = [
  {
    workspace_name: "Workspace 1",
    plan: "Free",
    monthly_fee: "0",
    function_usage_fee: "0",
    storage_usage_fee: "0",
    total_fee: "0",
  },
  {
    workspace_name: "Workspace 2",
    plan: "Light Edition",
    monthly_fee: "500",
    function_usage_fee: "111",
    storage_usage_fee: "222",
    total_fee: "833",
  },
  {
    workspace_name: "Workspace 3",
    plan: "Enterprise Edition",
    monthly_fee: "2,000",
    function_usage_fee: "1,111",
    storage_usage_fee: "2,222",
    total_fee: "5,333",
  },
];

const mockDataPaymentHistoryMonthList: TSubscriptionPaymentHistoryMonthList[] =
  [
    {
      id: "1",
      month: "2022/01",
      workspace_usage: mockDataUsageBillingAccount,
      total_fee_month: "9,999,999",
      isInvoice: false,
    },
    {
      id: "2",
      month: "2021/12",
      workspace_usage: mockDataUsageBillingAccount,
      total_fee_month: "9,999,999",
      isInvoice: true,
    },
    {
      id: "3",
      month: "2021/11",
      workspace_usage: mockDataUsageBillingAccount,
      total_fee_month: "9,999,999",
      isInvoice: false,
    },
  ];

function Row(props: { row: TSubscriptionPaymentHistoryMonthList }) {
  const { t } = useTranslation("subscriptions");
  const { row } = props;
  const [openTable, setOpenTable] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell sx={{ borderBottom: "none" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenTable(!openTable)}
          >
            {openTable ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
          {row.month}
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: "none" }}>
          &#165;{row.total_fee_month}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openTable} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 10, mb: 10, width: row.isInvoice ? "90%" : "80%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <styles.StyledTableCell>{t("workspace_name")}</styles.StyledTableCell>
                    <styles.StyledTableCell>{t("plan")}</styles.StyledTableCell>
                    <styles.StyledTableCell align="right">
                      {t("monthly_fee")}
                    </styles.StyledTableCell>
                    <styles.StyledTableCell align="right">
                      {t("functions_usage_fee")}
                    </styles.StyledTableCell>
                    <styles.StyledTableCell align="right">
                      {t("storage_usage_fee")}
                    </styles.StyledTableCell>
                    <styles.StyledTableCell align="right">
                      {t("total_fee")}
                    </styles.StyledTableCell>
                    {row.isInvoice && (
                      <styles.StyledTableCell align="right"></styles.StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.workspace_usage.map((workspaceRow) => (
                    <TableRow key={workspaceRow.workspace_name}>
                      <TableCell>{workspaceRow.workspace_name}</TableCell>
                      <TableCell>{workspaceRow.plan}</TableCell>
                      <TableCell align="right">
                        {workspaceRow.monthly_fee !== "0" ? (
                          <span>&#165;{workspaceRow.monthly_fee}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {workspaceRow.function_usage_fee !== "0" ? (
                          <span>&#165;{workspaceRow.function_usage_fee}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {workspaceRow.storage_usage_fee !== "0" ? (
                          <span>&#165;{workspaceRow.storage_usage_fee}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        &#165;{workspaceRow.total_fee}
                      </TableCell>
                      {row.isInvoice && (
                        <TableCell align="right">
                          <Button
                            sx={{
                              backgroundColor:
                                "subscription.background.default",
                              color: "text.primary",
                              border: "1px solid #555558",
                              borderRadius: "7px",
                              textTransform: "none",
                            }}
                          >
                            {t("invoice_pdf")}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const SubscriptionPaymentContainer: React.FC<{}> = () => {
  const { t } = useTranslation("subscriptions");
  return (
    <DashboardDetail>
      <Box
        sx={{
          maxWidth: "calc(100vw - 310px)",
          width: "100%",
          height: "80vh",
          overflow: "auto",
          mt: 5,
          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid rgba(130, 130, 130, 0.5)",
          }}
        >
          <Button
            sx={{
              color: "subscription.text.primary",
              backgroundColor: "subscription.background.default",
              ml: 1,
              borderRadius: "0",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "subscription.background.default",
              },
            }}
          >
            {t("usage_statement")}
          </Button>
        </Box>
        <Box
          sx={{
            ml: 2,
            mr: 2,
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: "background.paper",
              justifyContent: "space-between",
              pr: { xs: 1, sm: 1, xl: "26px" },
              pl: { sm: 0, xl: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  flex: "1 1 100%",
                  fontSize: "26px",
                  lineHeight: "24px",
                  color: "text.primary",
                }}
                variant="subtitle1"
                component="div"
              >
                {t("usage_statement")}
              </Typography>
            </Box>

            <div className="box-icon">
              <Button
                sx={{
                  flex: "1 1 100%",
                  fontSize: "14px",
                  lineHeight: "24px",
                  borderColor: "rgba(130, 130, 130, 0.5)",
                  backgroundColor: "subscription.background.default",
                  color: "text.primary",
                  mr: "24px",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                  borderRadius: "30px",
                }}
                variant="outlined"
                disableRipple
              >
                {t("csv_download")}
              </Button>
            </div>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow sx={{ pb: 0 }}>
                <styles.StyledTableCell sx={{ pb: 0 }}>
                  {t("month")}
                </styles.StyledTableCell>
                <styles.StyledTableCell align="right" sx={{ pb: 0 }}>
                  {t("total_fee")}
                </styles.StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockDataPaymentHistoryMonthList.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </DashboardDetail>
  );
};

export default SubscriptionPaymentContainer;
