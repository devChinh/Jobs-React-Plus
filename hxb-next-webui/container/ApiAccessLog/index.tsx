import React, { useCallback, useEffect, useMemo, useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { useSetRecoilState } from "recoil";

import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import DashboardDetail from "../../container/DashboardDetail";
import { ANALYTICS_USAGE_API_QUERY } from "../../graphql/apiUsageByUsers";
import { WORKSPACES_QUERY } from "../../graphql/workspace";
import { TAnalyticsUsageApi } from "../../recoil/atom/log/types";
import { notificationState } from "../../recoil/atom/workspace";
import { TWorkspaceInfo, TWorkspaces } from "../../recoil/atom/workspace/types";
import ApiAccessLogMenu from "./MenuLeft";
import { validationSchema } from "./schema";
import TableApiAccess from "./TableApiAccess";

dayjs.extend(utc);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 350,
    },
    sx: {
      "&& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "#00c6ab",
      },
    },
  },
};

const STATUS = ["200", "400", "401", "403", "404", "500", "503"];
const METHODS = ["GET", "POST", "PUT", "DELETE"];

const ApiAccessLogContainer: React.FC<{}> = () => {
  const { t } = useTranslation("log");
  const [getAnalyticsUsageApi, { loading: loadingTable }] = useLazyQuery(
    ANALYTICS_USAGE_API_QUERY
  );
  const {
    data: dataW,
    loading: loadingW,
    error: errorW,
  } = useQuery<TWorkspaces>(WORKSPACES_QUERY, {
    variables: {
      payload: {
        name: "",
      },
    },
  });

  const setNotification = useSetRecoilState(notificationState);

  const [analyticsUsageApi, setAnalyticsUsageApi] = useState<
    TAnalyticsUsageApi[]
  >([]);
  const [workspaces, setWorkspaces] = useState<TWorkspaceInfo>();
  const [workspaceDefault, setWorkspaceDefault] = useState<string | null>();
  const [offsetDataTable, setOffsetDataTable] = useState<string>("0");
  const [limitDataTable, setLimitDataTable] = useState<string>("20");
  const [totalDataTable, setTotalDataTable] = useState<number>(0);
  const [pageDataTable, setPageDataTable] = useState(0);
  const [openDrawerTable, setOpenDrawerTable] = useState<boolean>(false);

  const initialValue = useMemo(() => {
    const initial = {
      workspace: "",
      status: "",
      method: "",
      url: "",
      user: "",
      start_time: dayjs().hour(dayjs().hour() - 1),
      end_time: dayjs(),
    };
    if (workspaceDefault)
      return {
        ...initial,
        workspace: workspaceDefault,
      };
    return initial;
  }, [workspaceDefault]);

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const { workspace, url, method, status, user, start_time, end_time } =
        values;
      dataGetAnalyticsUsageApi(
        workspace,
        url,
        method,
        status,
        user,
        start_time,
        end_time
      );
    },
  });

  const dataGetAnalyticsUsageApi = useCallback(
    async (
      w_id: string,
      url: string,
      method: string,
      status: string,
      username: string,
      start_time: Dayjs | null,
      end_time: Dayjs | null
    ) => {
      try {
        const { data } = await getAnalyticsUsageApi({
          variables: {
            getAnalyticsUsageApiId: w_id,
            payload: {
              url: url || "",
              method: method || "",
              status: status || "",
              username: username || "",
              start_time: start_time
                ? dayjs.utc(start_time).format("YYYY-MM-DD HH:mm:ss")
                : "",
              end_time: end_time
                ? dayjs.utc(end_time).format("YYYY-MM-DD HH:mm:ss")
                : "",
              offset: `${offsetDataTable}` || "0",
              limit: `${limitDataTable}` || "20",
            },
          },
        });

        if (data && data.getAnalyticsUsageApi.api_usage) {
          const dataFormatDateTime: TAnalyticsUsageApi[] =
            data.getAnalyticsUsageApi.api_usage.map((d: TAnalyticsUsageApi) => {
              return {
                ...d,
                created_at: dayjs(d.created_at).format("YYYY-MM-DD HH:mm:ss"),
              };
            });
          setAnalyticsUsageApi(dataFormatDateTime);
          setTotalDataTable(data.getAnalyticsUsageApi.total);
        } else {
          clearDataTable();
        }
      } catch (error) {
        clearDataTable();
        setNotification({
          open: true,
          severity: "error",
          message: "get data analytics usage api failed",
        });
      }
    },
    [getAnalyticsUsageApi, limitDataTable, offsetDataTable, setNotification]
  );

  const clearDataTable = () => {
    setAnalyticsUsageApi([]);
    setTotalDataTable(0);
    setOffsetDataTable("0");
    setLimitDataTable("20");
    setPageDataTable(0);
    setOpenDrawerTable(false);
  };

  const onChangeWorkspace = (e: SelectChangeEvent<string>) => {
    formik.resetForm();
    formik.setFieldValue("workspace", e.target.value);

    clearDataTable();
  };

  useEffect(() => {
    const { workspace, url, method, status, user, start_time, end_time } =
      formik.values;
    dataGetAnalyticsUsageApi(
      workspace,
      url,
      method,
      status,
      user,
      start_time,
      end_time
    );
  }, [dataGetAnalyticsUsageApi, limitDataTable, offsetDataTable]);

  useEffect(() => {
    if (dataW && !loadingW && !errorW) {
      setWorkspaces(dataW.workspaces);
      setWorkspaceDefault(dataW.workspaces?.current_workspace_id);
    }
  }, [dataW, errorW, loadingW]);

  return (
    <DashboardDetail>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 55px)",
          maxHeight: "100%",
          display: "flex",
        }}
      >
        <ApiAccessLogMenu />
        <Box
          sx={{
            maxWidth: "calc(100vw - 310px)",
            width: "100%",
            height: "100%",
            overflowX: "hidden",
          }}
        >
          {loadingW ? (
            <Box
              sx={{
                width: "100%",
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
              <Box sx={{ m: 1 }}>
                <Typography
                  sx={{ color: "text.primary", m: 0, fontWeight: "bold" }}
                  variant="h4"
                  gutterBottom
                >
                  {t("api_access_logs")}
                </Typography>
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  sx={{
                    mt: 2,
                    "& .MuiToolbar-root": {
                      minHeight: 0,
                      mb: 1,
                    },
                    "& .MuiFormLabel-root": {
                      fontSize: "14px",
                      fontWeight: "bold",
                      lineHeight: "24px",
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "14px",
                      lineHeight: "16px",
                      letterSpacing: "0.3px",
                      borderRadius: "5px",
                      backgroundColor: "organization.background.default",
                    },
                    "& .MuiIconButton-root": {
                      p: 0,
                    },
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid",
                      },
                  }}
                >
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "90%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("workspace")}
                    </FormLabel>
                    <FormControl sx={{ minWidth: 350 }}>
                      <Select
                        size="small"
                        id="workspace"
                        name="workspace"
                        value={formik.values.workspace}
                        MenuProps={MenuProps}
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={(e) => onChangeWorkspace(e)}
                        error={
                          formik.touched.workspace &&
                          Boolean(formik.errors.workspace)
                        }
                      >
                        {workspaces &&
                          workspaces.workspaces &&
                          workspaces.workspaces?.map((w) => (
                            <MenuItem
                              key={w.workspace_id}
                              value={w.workspace_id}
                            >
                              {w.workspace_name}
                            </MenuItem>
                          ))}
                      </Select>
                  
                    </FormControl>
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("access_time")}
                    </FormLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack direction="row" spacing={0.5}>
                        <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm:ss"
                          value={formik.values.start_time}
                          ampm={false}
                          onChange={(date) =>
                            formik.setFieldValue("start_time", date)
                          }
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          renderInput={(params) => (
                            <TextField
                              id="startDate"
                              name="startDate"
                              size="small"
                              {...params}
                            />
                          )}
                        />
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{ color: "text.primary", textAlign: "center" }}
                          >
                            ~
                          </Typography>
                        </Box>
                        <DateTimePicker
                          inputFormat="YYYY-MM-DD HH:mm:ss"
                          value={formik.values.end_time}
                          ampm={false}
                          onChange={(date) => {
                            formik.setFieldValue("end_time", date);
                          }}
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          minDate={formik.values.start_time}
                          minTime={formik.values.start_time}
                          renderInput={(params) => (
                            <TextField
                              id="endDate"
                              name="endDate"
                              size="small"
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("status")}
                    </FormLabel>
                    <FormControl fullWidth>
                      <Select
                        size="small"
                        id="status"
                        name="status"
                        value={formik.values.status}
                        MenuProps={MenuProps}
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.status && Boolean(formik.errors.status)
                        }
                      >
                        <MenuItem value="">
                          <em>{t("empty")}</em>
                        </MenuItem>
                        {STATUS.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                      
                    </FormControl>
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("method")}
                    </FormLabel>
                    <FormControl fullWidth>
                      <Select
                        size="small"
                        id="method"
                        name="method"
                        value={formik.values.method}
                        MenuProps={MenuProps}
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.method && Boolean(formik.errors.method)
                        }
                      >
                        <MenuItem value="">
                          <em>{t("empty")}</em>
                        </MenuItem>
                        {METHODS.map((method) => (
                          <MenuItem key={method} value={method}>
                            {method}
                          </MenuItem>
                        ))}
                      </Select>
                 
                    </FormControl>
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("url")}
                    </FormLabel>
                    <TextField
                      fullWidth
                      id="url"
                      name="url"
                      value={formik.values.url}
                      onChange={formik.handleChange}
                      error={formik.touched.url && Boolean(formik.errors.url)}
                      helperText={formik.touched.url && formik.errors.url}
                      size="small"
                    />
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        minWidth: "150px",
                      }}
                    >
                      {t("user")}
                    </FormLabel>
                    <TextField
                      fullWidth
                      id="user"
                      name="user"
                      value={formik.values.user}
                      onChange={formik.handleChange}
                      error={formik.touched.user && Boolean(formik.errors.user)}
                      helperText={formik.touched.user && formik.errors.user}
                      size="small"
                    />
                  </Toolbar>
                  <Toolbar
                    sx={(theme) => ({
                      [theme.breakpoints.down("md")]: {
                        width: "100%",
                      },
                      [theme.breakpoints.down("lg")]: {
                        width: "80%",
                      },
                      [theme.breakpoints.up("lg")]: {
                        width: "70%",
                      },
                      [theme.breakpoints.up("xl")]: {
                        width: "50%",
                      },
                    })}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      color="success"
                      sx={{
                        backgroundColor: "background.highlight",
                        color: "text.primary",
                        borderRadius: "5px",
                        mt: 1,
                      }}
                    >
                      {t("search")}
                    </Button>
                  </Toolbar>
                </Box>
              </Box>
              <TableApiAccess
                analyticsUsageApi={analyticsUsageApi}
                loadingTable={loadingTable}
                totalDataTable={totalDataTable}
                limitDataTable={limitDataTable}
                pageDataTable={pageDataTable}
                openDrawerTable={openDrawerTable}
                setOffsetDataTable={setOffsetDataTable}
                setLimitDataTable={setLimitDataTable}
                setPageDataTable={setPageDataTable}
                setOpenDrawerTable={setOpenDrawerTable}
              />
            </>
          )}
        </Box>
      </Box>
    </DashboardDetail>
  );
};

export default ApiAccessLogContainer;
