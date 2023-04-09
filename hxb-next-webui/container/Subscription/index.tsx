import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SortIcon from "@mui/icons-material/Sort";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRecoilValue } from "recoil";

import DashboardLayout from "../../container/DashboardLayout";
import {
  StyledTableCell,
  WorkspaceChip,
} from "../../container/Subscription/style";
import { subscriptionsState } from "../../recoil/atom/subscription";
import {
  TSubscription,
  TSubscriptions,
} from "../../recoil/atom/subscription/types";

const SubscriptionContainer: React.FC<{}> = () => {
  const { t } = useTranslation("subscriptions");
  const { push: routerPush } = useRouter();

  const s: TSubscriptions = useRecoilValue(subscriptionsState);

  const [subscriptions, setSubscriptions] = useState<TSubscription[]>([]);
  const [displayedSubscriptions, setDisplayedSubscriptions] = useState<
    TSubscription[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  const styleContainerIcon = {
    display: "flex",
    alignItem: "center",
  };

  useEffect(() => {
    if (s.fetched) {
      if (
        s.subscriptions &&
        s.subscriptions.subscriptions &&
        s.subscriptions.subscriptions.length > 0
      ) {
        setSubscriptions(s.subscriptions.subscriptions);
      }
    }
  }, [s]);

  useEffect(() => {
    const displayed = subscriptions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDisplayedSubscriptions(displayed);
  }, [page, rowsPerPage, subscriptions]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectSubscription = (subscriptionId: string) => {
    routerPush({
      pathname: `/subscription/${subscriptionId}`,
    });
  };

  const handleOpenSubscription = (subscriptionId: string) => {
    const newWindow = window.open(
      `http://dev.hexabase.com/h/${subscriptionId}`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <DashboardLayout>
      {loadingSubscription ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            component="div"
            sx={{ ml: "24px", mb: "34px", color: "text.titleTable" }}
          >
            {t("subscriptions")}
          </Typography>
          <Paper>
            <TableContainer component={Paper}>
              <Toolbar
                sx={{
                  justifyContent: "flex-end",
                  pr: { xs: 1, sm: 1, xl: "26px" },
                  pl: { sm: 0, xl: 0 },
                }}
              >
                <div className="box-icon" style={styleContainerIcon}>
                  <IconButton
                    color="inherit"
                    sx={{
                      p: 1,
                      color: "#9FA2B4",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    <SortIcon fontSize="medium" htmlColor="#9FA2B4" />
                    {t("sort")}
                  </IconButton>
                  <IconButton
                    color="inherit"
                    sx={{
                      p: 1,
                      color: "#9FA2B4",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    <FilterAltIcon fontSize="medium" htmlColor="#9FA2B4" />
                    {t("filter")}
                  </IconButton>
                </div>
              </Toolbar>
              <Table
                sx={{ minWidth: 650 }}
                size="medium"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{t("organization")}</StyledTableCell>
                    <StyledTableCell>{t("workspaces")}</StyledTableCell>
                    <StyledTableCell>{t("billing_accounts")}</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedSubscriptions.map((row) => (
                    <TableRow
                      key={row.subscription_id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleSelectSubscription(row.subscription_id)
                      }
                    >
                      <TableCell component="th" scope="row">
                        <div style={{ width: "100%", display: "flex" }}>
                          <Box
                            sx={{
                              width: "90px",
                              height: "51px",
                              backgroundColor: "#c4c4c4",
                            }}
                          >
                            <Image
                              alt="Organization icon"
                              src="/#"
                              width="90px"
                              height="51px"
                            />
                          </Box>
                          <Box>
                            {row.organization_name}
                            <span
                              style={{ display: "block", marginLeft: "25px" }}
                            >
                              {row.organization_description}
                            </span>
                          </Box>
                        </div>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <WorkspaceChip label={row.workspaces} />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <WorkspaceChip label={row.billing_accounts} />
                      </TableCell>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          textAlign: "right",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-haspopup="true"
                          onClick={() =>
                            handleOpenSubscription(row.subscription_id)
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, 25]}
              component="div"
              count={subscriptions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </DashboardLayout>
  );
};

export default SubscriptionContainer;
