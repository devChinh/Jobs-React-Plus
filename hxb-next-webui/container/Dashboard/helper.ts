import type { ChartData, ChartDataset } from "chart.js";
import dayjs from "dayjs";

import {
  ApiChart,
  ChartLoginPerMonth,
} from "../../recoil/atom/dashboard/types";

export const generateLightColorRgb = () => {
  const red = Math.floor(((1 + Math.random()) * 256) / 2);
  const green = Math.floor(((1 + Math.random()) * 256) / 2);
  const blue = Math.floor(((1 + Math.random()) * 256) / 2);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
};

export const convertApiAccess = (
  data: ApiChart[]
): ChartData<"bar", number[], string> => {
  const labels: dayjs.Dayjs[] = [];
  let names: string[] = [];
  for (const d of data) {
    const l = labels.findIndex((la) => la.isSame(d.day, "date"));
    if (l === -1) {
      labels.push(dayjs(d.day, "YYYY-MM-DD"));
    }
    const nIndex = names.findIndex((na) => na === d.name);
    if (nIndex === -1) {
      names.push(d.name);
    }
  }
  labels.sort((a, b) => {
    return a.isBefore(b) ? -1 : 1;
  });

  const dataSets: ChartDataset<"bar", number[]>[] = [];

  let i = 0;
  for (const n of names) {
    const dataSet: ChartDataset<"bar", number[]> = {
      type: "bar",
      label: n,
      data: [],
      backgroundColor: generateLightColorRgb(),
    };

    for (const l of labels) {
      const d = data.find((da) => {
        return l.isSame(da.day, "date") && da.name == n;
      });
      dataSet.data.push(d?.count || 0);
    }
    dataSets.push(dataSet);
    i++;
  }

  const dataExport: ChartData<"bar", number[], string> = {
    labels: [],
    datasets: [...dataSets],
  };

  for (const l of labels) {
    dataExport.labels?.push(l.format("MM-DD"));
  }

  return dataExport;
};

export const convertChartDataLoginPerMonth = (
  data: ChartLoginPerMonth[]
): ChartData<"bar", number[], string> => {
  const dataChart: ChartLoginPerMonth[] = [];

  for (const d of data) {
    const index = dataChart
      .map(function (dc) {
        return dc.w_id + dc.day_count;
      })
      .indexOf(d.w_id + d.day_count);

    if (index === -1) {
      dataChart.push(d);
    } else {
      const dataCount = dataChart[index].count_login + d.count_login;

      dataChart[index] = {
        ...dataChart[index],
        count_login: dataCount,
      };
    }
  }

  const labels: dayjs.Dayjs[] = [];
  const workspaceIds: string[] = [];

  for (const d of dataChart) {
    const l = labels.findIndex((la) =>
      la.isSame(dayjs(d.day_count, "YYYY-MM-DD"))
    );
    if (l === -1) {
      labels.push(dayjs(d.day_count, "YYYY-MM-DD"));
    }
    const wIndex = workspaceIds.findIndex((wid) => wid === d.w_id);
    if (wIndex === -1) {
      workspaceIds.push(d.w_id);
    }
  }

  labels.sort((a, b) => {
    return a.isBefore(b) ? -1 : 1;
  });

  const dataSets: ChartDataset<"bar", number[]>[] = [];

  let i = 0;

  for (const w of workspaceIds) {
    const dataSet: ChartDataset<"bar", number[]> = {
      type: "bar",
      label: w,
      data: [],
      backgroundColor: generateLightColorRgb(),
    };

    for (const l of labels) {
      const dFilter = dataChart.filter((da) => {
        return l.isSame(dayjs(da.day_count, "YYYY-MM-DD")) && da.w_id == w;
      });

      let sum = 0;

      for (const item of dFilter) {
        sum += item.count_login;
      }

      dataSet.data.push(sum);
    }

    dataSets.push(dataSet);
    i++;
  }

  const dataExport: ChartData<"bar", number[], string> = {
    labels: [],
    datasets: [...dataSets],
  };

  for (const l of labels) {
    dataExport.labels?.push(l.format("YYYY-MM-DD"));
  }

  return dataExport;
};
