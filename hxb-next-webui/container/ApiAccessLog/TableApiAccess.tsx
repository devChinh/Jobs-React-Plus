import React, { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { TAnalyticsUsageApi } from "../../recoil/atom/log/types";
import DetailTable from "./DetailTable";

interface TableApiAccessProps {
  analyticsUsageApi: TAnalyticsUsageApi[];
  loadingTable: boolean;
  totalDataTable: number;
  limitDataTable: string;
  pageDataTable: number;
  openDrawerTable: boolean;
  setOffsetDataTable: React.Dispatch<React.SetStateAction<string>>;
  setLimitDataTable: React.Dispatch<React.SetStateAction<string>>;
  setPageDataTable: React.Dispatch<React.SetStateAction<number>>;
  setOpenDrawerTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableApiAccess: React.FC<TableApiAccessProps> = ({
  analyticsUsageApi,
  loadingTable,
  totalDataTable,
  limitDataTable,
  pageDataTable,
  openDrawerTable,
  setOffsetDataTable,
  setLimitDataTable,
  setPageDataTable,
  setOpenDrawerTable,
}) => {
  const { t } = useTranslation("log");

  const [apiAccessSelected, setApiAcceSelected] =
    useState<TAnalyticsUsageApi>();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPageDataTable(newPage);
  };

  useEffect(() => {
    const offset = pageDataTable * +limitDataTable;

    setOffsetDataTable(String(offset));
  }, [limitDataTable, pageDataTable, setOffsetDataTable]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimitDataTable(event.target.value);
    setPageDataTable(0);
  };

  useEffect(() => {
    loadingTable && setOpenDrawerTable(false);
  }, [loadingTable, setOpenDrawerTable]);

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        position: "relative",
        mt: 3,
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 0,
          height: "100%",
          minHeight: "45vh",
          zIndex: 100,
        }}
      >
        <Table
          sx={{
            minWidth: 650,
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow
              sx={{
                ".MuiTableCell-root": {
                  backgroundColor: "background.boxModal",
                  padding: "5px",
                },
              }}
            >
              <TableCell colSpan={7} align="right">
                <TablePagination
                  rowsPerPageOptions={[20, 50, 100]}
                  component="div"
                  count={totalDataTable}
                  rowsPerPage={+limitDataTable}
                  page={pageDataTable}
                  labelRowsPerPage={t("rows_per_page")}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                ".MuiTableCell-root": {
                  backgroundColor: "background.boxModal",
                  padding: "5px",
                },
              }}
            >
              <TableCell> {t("access_time")}</TableCell>
              <TableCell> {t("status")}</TableCell>
              <TableCell> {t("method")}</TableCell>
              <TableCell> {t("url")}</TableCell>
              <TableCell> {t("user")}</TableCell>
              <TableCell>{t("workspace")}</TableCell>
              <TableCell>{t("latency")}</TableCell>
            </TableRow>
          </TableHead>
          {loadingTable ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ height: 485 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {analyticsUsageApi.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      apiAccessSelected === row
                        ? "background.highlight"
                        : "inherit",
                    "&:last-child td, &:last-child th": { border: 0 },
                    ".MuiTableCell-root": {
                      padding: "5px",
                      overflowWrap: "break-word",
                      minWidth: "110px",
                      maxWidth: "448px",
                    },
                  }}
                  onClick={() => {
                    setOpenDrawerTable(true);
                    setApiAcceSelected(row);
                  }}
                >
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell>{row.status_code}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>{row.api_path}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.workspace_name}</TableCell>
                  <TableCell>{row.latency}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          right: "0",
          display: openDrawerTable ? "flex" : "none",
          backgroundColor: "background.boxModal",
          maxHeight: "calc(100vh - 54px)",
        }}
      >
        <DetailTable
          open={openDrawerTable}
          setOpen={setOpenDrawerTable}
          apiAccessSelected={apiAccessSelected}
          setApiAcceSelected={setApiAcceSelected}
        />
      </Box>
    </Box>
  );
};

export default TableApiAccess;
