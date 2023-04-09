import { useRouter } from "next/router";
import React from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardDetail from "../../container/DashboardDetail";
import {
  TSubscriptionDetail,
  TSubscriptionPaymentHistoryBillingAccount,
  TSubscriptionPaymentHistoryOverview,
  TSubscriptionUsageBillingAccount,
  TSubscriptionUsageOverview,
} from "../../recoil/atom/subscription/types";
import { StyledTableCell } from "../Subscription/style";
import SubscriptionMenu from "./MenuLeft";
import * as styles from "./styles";

const getSubscription: TSubscriptionDetail[] = [
  {
    billing_account_id: "1",
    billing_account_name: "Billing Acount 1",
  },
  {
    billing_account_id: "2",
    billing_account_name: "Billing Acount 2",
  },
  {
    billing_account_id: "3",
    billing_account_name: "Billing Acount 3",
  },
];

const mockDataUsageOverView: TSubscriptionUsageOverview[] = [
  {
    billing_account_name: "Billing Account 1",
    workspaces: "3",
    monthly_fee: "1,1111",
    function_usage_fee: "1,111",
    storage_usage_fee: "111",
    total_fee: "6,166",
  },
  {
    billing_account_name: "Billing Account 2",
    workspaces: "5",
    monthly_fee: "222,222",
    function_usage_fee: "22,222",
    storage_usage_fee: "2,222",
    total_fee: "2,222,222",
  },
  {
    billing_account_name: "Billing Account 3",
    workspaces: "100",
    monthly_fee: "999,999",
    function_usage_fee: "99,999",
    storage_usage_fee: "9,999",
    total_fee: "9,999,999",
  },
];

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

const mockDataPaymentHistoryBillingACcount: TSubscriptionPaymentHistoryBillingAccount[] =
  [
    {
      id: "1",
      month: "2022/01",
      workspace_1: "0",
      workspace_2: "222,222",
      workspace_3: "333,333",
      total_fee_month: "999,999",
    },
    {
      id: "2",
      month: "2021/12",
      workspace_1: "0",
      workspace_2: "2,222,222",
      workspace_3: "3,333,333",
      total_fee_month: "9,999,999",
    },
    {
      id: "3",
      month: "2021/11",
      workspace_1: "0",
      workspace_2: "833",
      workspace_3: "5,333",
      total_fee_month: "6,166",
    },
  ];

const mockDataPaymentHistoryOverview: TSubscriptionPaymentHistoryOverview[] = [
  {
    id: "1",
    month: "2022/01",
    billing_account_total_fee: mockDataUsageOverView,
    total_fee_month: "9,999,999",
  },
  {
    id: "2",
    month: "2021/12",
    billing_account_total_fee: mockDataUsageOverView,
    total_fee_month: "9,999,999",
  },
  {
    id: "3",
    month: "2021/11",
    billing_account_total_fee: mockDataUsageOverView,
    total_fee_month: "9,999,999",
  },
];

const EnhancedTableToolbar = () => {
  const router = useRouter();

  const styleContainerIcon = {
    display: "flex",
    alignItem: "center",
  };
  return (
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
          // color="inherit"
          variant="subtitle1"
          component="div"
        >
          Usage - 2022/02
        </Typography>
      </Box>

      <div className="box-icon" style={styleContainerIcon}>
        {router.query.billing_account_id ? (
          <Button
            sx={{
              flex: "1 1 100%",
              fontSize: "14px",
              lineHeight: "24px",
              borderColor: "rgba(130, 130, 130, 0.5)",
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
            CSV Download
          </Button>
        ) : null}
        <Button
          sx={{
            flex: "1 1 100%",
            fontSize: "14px",
            lineHeight: "24px",
            borderColor: "rgba(130, 130, 130, 0.5)",
            color: "text.primary",
            whiteSpace: "nowrap",
            minWidth: "auto",
          }}
          variant="outlined"
        >
          2022/02
        </Button>
      </div>
    </Toolbar>
  );
};

const PaymentHistoryToolbar = () => {
  const router = useRouter();
  const isBillingAccountRouter = router.query.billing_account_id;

  if (router.query.payment_history_id) {
    return (
      <>
        <Button
          sx={{
            textTransform: "none",
            color: "#9FA2B4",
          }}
          type="button"
          // onClick={() => router.back()}
          onClick={() => {
            if (isBillingAccountRouter) {
              router.replace(
                `/subscription/${router.query.id}?billing_account_id=${isBillingAccountRouter}`,
                `/subscription/${router.query.id}?billing_account_id=${isBillingAccountRouter}`,
                {
                  shallow: true,
                }
              );
            } else {
              router.replace(
                `/subscription/${router.query.id}`,
                `/subscription/${router.query.id}`,
                {
                  shallow: true,
                }
              );
            }
          }}
        >
          &lt; Back
        </Button>
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
              // color="inherit"
              variant="subtitle1"
              component="div"
            >
              Payment History - 2021/11
            </Typography>
          </Box>
          <div className="box-icon">
            <Button
              sx={{
                flex: "1 1 100%",
                fontSize: "14px",
                lineHeight: "24px",
                borderColor: "rgba(130, 130, 130, 0.5)",
                color: "text.primary",
                whiteSpace: "nowrap",
                minWidth: "auto",
              }}
              variant="outlined"
            >
              2021/11
            </Button>
          </div>
        </Toolbar>
      </>
    );
  } else {
    return (
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
            // color="inherit"
            variant="subtitle1"
            component="div"
          >
            Payment History
          </Typography>
        </Box>
      </Toolbar>
    );
  }
};

const OverviewUsageTableHead = () => {
  const router = useRouter();

  if (router.query.billing_account_id) {
    return (
      <TableHead>
        <TableRow>
          <StyledTableCell>Workspace name</StyledTableCell>
          <StyledTableCell>Plan</StyledTableCell>
          <StyledTableCell align="right">Monthly Fee</StyledTableCell>
          <StyledTableCell align="right">Function Usage Fee</StyledTableCell>
          <StyledTableCell align="right">Storage Usage Fee</StyledTableCell>
          <StyledTableCell align="right">Total Fee</StyledTableCell>
        </TableRow>
      </TableHead>
    );
  } else {
    return (
      <TableHead>
        <TableRow>
          <StyledTableCell>Billing account name</StyledTableCell>
          <StyledTableCell>Workspaces</StyledTableCell>
          <StyledTableCell align="right">Monthly Fee</StyledTableCell>
          <StyledTableCell align="right">Function Usage Fee</StyledTableCell>
          <StyledTableCell align="right">Storage Usage Fee</StyledTableCell>
          <StyledTableCell align="right">Total Fee</StyledTableCell>
        </TableRow>
      </TableHead>
    );
  }
};

const OverviewUsageTableBody = () => {
  const router = useRouter();

  if (router.query.billing_account_id) {
    return (
      <TableBody>
        {mockDataUsageBillingAccount.map((row, rowIndex) => (
          <styles.TableRowCustom
            hover
            // onClick={(event) => handleClick(event, `${row.name}`)}
            // role="checkbox"x
            tabIndex={-1}
            key={rowIndex}
          >
            <TableCell
              component="th"
              scope="row"
              padding="none"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.workspace_name}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.plan}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.monthly_fee !== "0" ? (
                <span>&#165;{row.monthly_fee}</span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.function_usage_fee !== "0" ? (
                <span>&#165;{row.function_usage_fee}</span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.storage_usage_fee !== "0" ? (
                <span>&#165;{row.storage_usage_fee}</span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              &#165;{row.total_fee}
            </TableCell>
          </styles.TableRowCustom>
        ))}
      </TableBody>
    );
  } else {
    return (
      <TableBody>
        {mockDataUsageOverView.map((row, rowIndex) => (
          <styles.TableRowCustom
            hover
            // onClick={(event) => handleClick(event, `${row.name}`)}
            // role="checkbox"x
            tabIndex={-1}
            key={rowIndex}
          >
            <TableCell
              component="th"
              scope="row"
              padding="none"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.billing_account_name}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              {row.workspaces}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              &#165;{row.monthly_fee}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              &#165;{row.function_usage_fee}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              &#165;{row.storage_usage_fee}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              padding="none"
              align="right"
              sx={{
                p: 2,
                wordBreak: "keep-all",
                backgroundColor: "background.paper",
              }}
            >
              &#165;{row.total_fee}
            </TableCell>
          </styles.TableRowCustom>
        ))}
      </TableBody>
    );
  }
};

const OverViewUsageTable = () => {
  return (
    <>
      <TableContainer>
        <Table
          sx={{
            maxWidth: "100%",
            backgroundColor: "background.paper",
            backgroundImage: "unset",
          }}
          aria-labelledby="tableTitle"
          size={"small"}
        >
          <OverviewUsageTableHead />
          <OverviewUsageTableBody />
        </Table>
      </TableContainer>
      <Typography
        sx={{
          flex: "1 1 100%",
          display: "flex",
          fontSize: "18px",
          lineHeight: "24px",
          mt: "15px",
          justifyContent: "flex-end",
          color: "text.primary",
        }}
        // color="inherit"
        variant="subtitle1"
        component="div"
      >
        &#165;9,999,999
      </Typography>
    </>
  );
};

const OverViewPaymentHistoryTableHead = () => {
  const router = useRouter();
  const isBillingAccountRouter = router.query.billing_account_id;
  const isPaymentHistoryRouter = router.query.payment_history_id;

  if (isBillingAccountRouter) {
    if (isPaymentHistoryRouter) {
      return (
        <TableHead>
          <TableRow>
            <StyledTableCell>Workspace name</StyledTableCell>
            <StyledTableCell>Plan</StyledTableCell>
            <StyledTableCell align="right">Monthly Fee</StyledTableCell>
            <StyledTableCell align="right">Function Usage Fee</StyledTableCell>
            <StyledTableCell align="right">Storage Usage Fee</StyledTableCell>
            <StyledTableCell align="right">Total Fee</StyledTableCell>
          </TableRow>
        </TableHead>
      );
    } else {
      return (
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Workspace 1</StyledTableCell>
            <StyledTableCell>Workspace 2</StyledTableCell>
            <StyledTableCell>Workspace 3</StyledTableCell>
            <StyledTableCell align="right">Total Fee</StyledTableCell>
          </TableRow>
        </TableHead>
      );
    }
  } else {
    if (isPaymentHistoryRouter) {
      return (
        <TableHead>
          <TableRow>
            <StyledTableCell>Billing account name</StyledTableCell>
            <StyledTableCell>Workspaces</StyledTableCell>
            <StyledTableCell align="right">Monthly Fee</StyledTableCell>
            <StyledTableCell align="right">Function Usage Fee</StyledTableCell>
            <StyledTableCell align="right">Storage Usage Fee</StyledTableCell>
            <StyledTableCell align="right">Total Fee</StyledTableCell>
          </TableRow>
        </TableHead>
      );
    } else {
      return (
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="right">Total Fee</StyledTableCell>
          </TableRow>
        </TableHead>
      );
    }
  }
};

const OverViewPaymentHistoryTableBody = () => {
  const router = useRouter();
  const isBillingAccountRouter = router.query.billing_account_id;
  const isPaymentHistoryRouter = router.query.payment_history_id;

  if (isBillingAccountRouter) {
    if (isPaymentHistoryRouter) {
      return (
        <TableBody>
          {mockDataUsageBillingAccount.map((row, rowIndex) => (
            <styles.TableRowCustom hover tabIndex={-1} key={rowIndex}>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.workspace_name}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.plan}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.monthly_fee !== "0" ? (
                  <span>&#165;{row.monthly_fee}</span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.function_usage_fee !== "0" ? (
                  <span>&#165;{row.function_usage_fee}</span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.storage_usage_fee !== "0" ? (
                  <span>&#165;{row.storage_usage_fee}</span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.total_fee}
              </TableCell>
            </styles.TableRowCustom>
          ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          {mockDataPaymentHistoryBillingACcount.map((row, rowIndex) => (
            <styles.TableRowCustom
              hover
              onClick={() => {
                router.replace(
                  `/subscription/${router.query.id}?billing_account_id=${router.query.billing_account_id}&payment_history_id=${row.id}`,
                  `/subscription/${router.query.id}?billing_account_id=${router.query.billing_account_id}&payment_history_id=${row.id}`,
                  {
                    shallow: true,
                  }
                );
              }}
              tabIndex={-1}
              key={rowIndex}
            >
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.month}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.workspace_1}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.workspace_2}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.workspace_3}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.total_fee_month}
              </TableCell>
            </styles.TableRowCustom>
          ))}
        </TableBody>
      );
    }
  } else {
    if (isPaymentHistoryRouter) {
      return (
        <TableBody>
          {mockDataUsageOverView.map((row, rowIndex) => (
            <styles.TableRowCustom
              hover
              // onClick={(event) => handleClick(event, `${row.name}`)}
              // role="checkbox"x
              tabIndex={-1}
              key={rowIndex}
            >
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.billing_account_name}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.workspaces}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.monthly_fee}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.function_usage_fee}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.storage_usage_fee}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.total_fee}
              </TableCell>
            </styles.TableRowCustom>
          ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          {mockDataPaymentHistoryOverview.map((row, rowIndex) => (
            <styles.TableRowCustom
              hover
              onClick={() => {
                router.replace(
                  `/subscription/${router.query.id}?payment_history_id=${row.id}`,
                  `/subscription/${router.query.id}?payment_history_id=${row.id}`,
                  {
                    shallow: true,
                  }
                );
              }}
              // role="checkbox"x
              tabIndex={-1}
              key={rowIndex}
            >
              <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                {row.month}
              </TableCell>
              {row.billing_account_total_fee.map((total, index) => (
                <TableCell
                  key={index}
                  component="th"
                  scope="row"
                  padding="none"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                  }}
                >
                  &#165;{total.total_fee}
                </TableCell>
              ))}
              <TableCell
                component="th"
                scope="row"
                padding="none"
                align="right"
                sx={{
                  p: 2,
                  wordBreak: "keep-all",
                  backgroundColor: "background.paper",
                }}
              >
                &#165;{row.total_fee_month}
              </TableCell>
            </styles.TableRowCustom>
          ))}
        </TableBody>
      );
    }
  }
};

const OverViewPaymentHistoryTable = () => {
  return (
    <>
      <TableContainer>
        <Table
          sx={{
            maxWidth: "100%",
            backgroundColor: "background.paper",
            backgroundImage: "unset",
          }}
          aria-labelledby="tableTitle"
          size={"small"}
        >
          <OverViewPaymentHistoryTableHead />
          <OverViewPaymentHistoryTableBody />
        </Table>
      </TableContainer>
    </>
  );
};

const SubscriptionDetailContainer: React.FC<{}> = () => {
  const router = useRouter();
  const [tabItem, setTabItem] = React.useState("1");

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabItem(newValue);
  };

  return (
    <DashboardDetail>
      <Box
        sx={{
          width: "90%",
          display: "flex",
        }}
      >
        <SubscriptionMenu data={getSubscription} />
        <Box
          sx={{
            maxWidth: "calc(100vw - 310px)",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={tabItem}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                  TabIndicatorProps={{
                    style: {
                      display: "none",
                    },
                  }}
                >
                  <Tab
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "subscription.background.default",
                        color: "text.primary",
                        border: "none",
                      },
                    }}
                    label="Usage"
                    value="1"
                  />
                  <Tab
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "subscription.background.default",
                        color: "text.primary",
                      },
                    }}
                    label="Payment History"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <EnhancedTableToolbar />
                <OverViewUsageTable />
              </TabPanel>
              <TabPanel value="2">
                <PaymentHistoryToolbar />
                <OverViewPaymentHistoryTable />
              </TabPanel>
            </TabContext>
          </Box>
        </Box>
      </Box>
    </DashboardDetail>
  );
};

export default SubscriptionDetailContainer;
