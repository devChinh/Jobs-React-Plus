import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "next-i18next";
import { Bar } from "react-chartjs-2";
import { useSetRecoilState } from "recoil";

import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import DashboardLayout from "../../container/DashboardLayout";
import {
  ANALYTICS_QUERY,
  ANALYTICS_SESSION_QUERY,
  GET_ANALYTICS_LOGIN_PER_MONTH,
} from "../../graphql/dashboard";
import { WORKSPACES_QUERY } from "../../graphql/workspace";
import {
  Analytics,
  AnalyticsSession,
  ApiChart,
  getAnalytics,
} from "../../recoil/atom/dashboard/types";
import { notificationState } from "../../recoil/atom/workspace";
import { TWorkspace, TWorkspaces } from "../../recoil/atom/workspace/types";
import { convertApiAccess, convertChartDataLoginPerMonth } from "./helper";
import {
  AnalyticsContent,
  AnalyticsTitle,
  CardContent,
  CardTitle,
  ChartTitle,
  Item,
} from "./style";

ChartJS.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  type: "bar",
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const optionsLoginUser = {
  type: "bar",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const defaultChartData: ChartData<"bar", number[], string> = {
  labels: [],
  datasets: [],
};

const DashboardContainer: React.FC<{}> = () => {
  const { t } = useTranslation("dashboard");
  const { push: routerPush } = useRouter();

  const {
    data: dataAnlytics,
    loading: loadingAnlytics,
    error: errorAnlytics,
  } = useQuery<Analytics>(ANALYTICS_QUERY);
  const {
    data: dataAnlyticsSession,
    loading: loadingAnlyticsSession,
    error: errorAnlyticsSession,
  } = useQuery<AnalyticsSession>(ANALYTICS_SESSION_QUERY);
  const {
    data: dataW,
    loading: loadingW,
    error: errorW,
  } = useQuery<TWorkspaces>(WORKSPACES_QUERY);

  const [getAnalyticsLoginPerMonth] = useLazyQuery(
    GET_ANALYTICS_LOGIN_PER_MONTH
  );

  const setNotification = useSetRecoilState(notificationState);

  const [analyticsData, setAnalyticsData] = useState<getAnalytics>();
  const [chartData, setChartData] = useState<{
    apiAccess: ChartData<"bar", number[], string>;
    apiLogin: ChartData<"bar", number[], string>;
  }>({
    apiAccess: defaultChartData,
    apiLogin: defaultChartData,
  });
  const [loginPerMonthChartData, setLoginPerMonthChartData] =
    useState<ChartData<"bar", number[], string>>(defaultChartData);
  const [workspaces, setWorkspaces] = useState<TWorkspace[]>([]);
  const [monthYear, setMonthYear] = useState<Dayjs>(dayjs());
  const [idWorkspaceSelected, setIdWorkspaceSelected] = useState<string>("");

  const handleChangeWorksapce = (event: SelectChangeEvent) => {
    setIdWorkspaceSelected(event.target.value);
  };

  const getDataAnalyticsLoginPerMonth = useCallback(
    async (date: Dayjs | null) => {
      try {
        const monthOfYear = date
          ? dayjs(date).format("YYYY-MM")
          : dayjs(monthYear).format("YYYY-MM");
        const workspaceId = idWorkspaceSelected;

        const { data } = await getAnalyticsLoginPerMonth({
          variables: {
            payload: {
              monthOfYear,
              workspaceId,
            },
          },
        });

        if (data) {
          const apiLogin = convertChartDataLoginPerMonth(
            data.getAnalyticsLoginPerMonth.data
          );

          setLoginPerMonthChartData(apiLogin);
        }
      } catch (error) {
        setLoginPerMonthChartData(defaultChartData);

        setNotification({
          open: true,
          severity: "error",
          message: "Data not found",
        });
      }
    },
    [getAnalyticsLoginPerMonth, idWorkspaceSelected, monthYear]
  );

  const handleAcceptDatePicker = (date: Dayjs | null) => {
    date && getDataAnalyticsLoginPerMonth(date);
  };

  useEffect(() => {
    if (!loadingAnlytics && dataAnlytics && !errorAnlytics) {
      if (dataAnlytics.getAnalytics) {
        setAnalyticsData(dataAnlytics.getAnalytics);
        const dataApiAccessChart: ApiChart[] =
          dataAnlytics.getAnalytics.api_access.filter(
            (item) => item.count !== 0
          );

        const apiAccess = convertApiAccess(dataApiAccessChart);
        const apiLogin = convertApiAccess(dataAnlytics.getAnalytics.api_login);

        setChartData({
          apiAccess,
          apiLogin,
        });
      }
    }
  }, [dataAnlytics, loadingAnlytics, errorAnlytics]);

  useEffect(() => {
    if (
      dataW &&
      !loadingW &&
      !errorW &&
      dataW.workspaces?.workspaces &&
      dataW.workspaces?.current_workspace_id
    ) {
      setWorkspaces(dataW.workspaces.workspaces);
      setIdWorkspaceSelected(dataW.workspaces.current_workspace_id);
    }
  }, [dataW, errorW, loadingW]);

  useEffect(() => {
    getDataAnalyticsLoginPerMonth(null);
  }, [idWorkspaceSelected]);

  return (
    <Box>
      <DashboardLayout>
        {loadingAnlytics || loadingAnlyticsSession ? (
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
          <Box sx={{ pb: 2 }}>
            <Box sx={{ flexGrow: 1, mb: 2 }}>
              <Grid container spacing={3.75}>
                <Grid item xs={4}>
                  <Item onClick={() => routerPush("/workspace")}>
                    <CardTitle className="cardTitle">
                      {t("workspace")}
                    </CardTitle>
                    <CardContent
                      sx={{
                        color: "dashboard.text.grey",
                      }}
                      className="cardContent"
                    >
                      {analyticsData?.workspaces_count || 0}
                    </CardContent>
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <CardTitle className="cardTitle">
                      {t("organization")}
                    </CardTitle>
                    <CardContent
                      sx={{
                        color: "dashboard.text.grey",
                      }}
                      className="cardContent"
                    >
                      {analyticsData?.organizations_count || 0}
                    </CardContent>
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <CardTitle className="cardTitle">
                      {t("subscription")}
                    </CardTitle>
                    <CardContent
                      sx={{
                        color: "dashboard.text.grey",
                      }}
                      className="cardContent"
                    >
                      {analyticsData?.subscriptions_count || 0}
                    </CardContent>
                  </Item>
                </Grid>
              </Grid>
            </Box>
            <Paper
              sx={{
                p: 3,
                margin: "auto",
                flexGrow: 1,
                border: "1px solid #565659",
              }}
            >
              <Grid container spacing={2}>
                <Grid xs={9} item>
                  <Box>
                    <ChartTitle
                      sx={{
                        color: "dashboard.text.grey",
                      }}
                    >
                      {t("api_access")}
                    </ChartTitle>
                    <Bar options={options} data={chartData.apiAccess} />
                  </Box>
                  <Box
                    sx={{
                      paddingTop: 5,
                    }}
                  >
                    <ChartTitle
                      sx={{
                        color: "dashboard.text.grey",
                      }}
                    >
                      {t("current_login")}
                    </ChartTitle>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControl
                        sx={{
                          m: 1,
                          color: "text.primary",
                          minWidth: "250px",
                        }}
                        size="small"
                        disabled={!workspaces[0]}
                      >
                        <Select
                          labelId="worksapce-select-small"
                          id="worksapce-select-small"
                          value={idWorkspaceSelected}
                          label="workspace"
                          onChange={handleChangeWorksapce}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          sx={{
                            backgroundColor: "organization.background.default",
                            border: "1px solid #38383B",
                            borderRadius: "5px",
                            ".MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            fontSize: "15px",
                            fontWeight: "bold",
                            color: "#27AE60",
                            width: "250px",
                          }}
                          MenuProps={{
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: "250px",
                            },
                            sx: {
                              "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                                {
                                  backgroundColor: "#27AE60",
                                },
                              "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                                {
                                  backgroundColor: "#27AE60",
                                },
                            },
                          }}
                        >
                          {workspaces[0] &&
                            workspaces.map((w) => (
                              <MenuItem
                                key={w.workspace_id}
                                value={w.workspace_id}
                              >
                                {w.workspace_name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          inputFormat="YYYY-MM"
                          views={["year", "month"]}
                          value={monthYear}
                          onChange={(date) => {
                            date && setMonthYear(date);
                          }}
                          onAccept={(date) => handleAcceptDatePicker(date)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                readOnly: true,
                              }}
                              size="small"
                              sx={{
                                backgroundColor:
                                  "organization.background.default",
                                border: "1px solid #38383B",
                                borderRadius: "5px",
                                ".MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Bar
                      options={optionsLoginUser}
                      data={loginPerMonthChartData}
                    />
                  </Box>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={3} sm container>
                  <Grid
                    item
                    xs
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <AnalyticsTitle>{t("api_access_today")}</AnalyticsTitle>
                        <AnalyticsContent
                          sx={{
                            color: "dashboard.text.grey",
                          }}
                        >
                          {analyticsData?.api_access_today_count || 0}
                        </AnalyticsContent>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <AnalyticsTitle>{t("monthly_access")}</AnalyticsTitle>
                        <AnalyticsContent
                          sx={{
                            color: "dashboard.text.grey",
                          }}
                        >
                          {analyticsData?.api_access_monthly_count || 0}
                        </AnalyticsContent>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </DashboardLayout>
      {/* hide cookie consent */}
      {/* <Box sx={{ position: "fixed", zIndex: "tooltip" }}>
        <PopupCookiesConsent />
      </Box> */}
    </Box>
  );
};

export default DashboardContainer;
