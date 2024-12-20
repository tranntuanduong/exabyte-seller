import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartData,
  Legend,
} from "chart.js";

import { DataFetchStatistic } from "src/types/generality";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import _, { groupBy } from 'lodash'
import { daysInThisMonth } from "src/utils/date";
import { getMonth } from "date-fns";
// import { daysInThisMonth } from 'src/utils/date';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface Props {
  isWeek?: boolean
  isYear?: boolean
  isDay?: boolean;
  data?: any;
  isMonth?: boolean;
  // keyFilter?: string
  legendSales: boolean;
  legendCount: boolean;
  fetchStatistic: (query: any) => Promise<void>
}

const LineChart = ({
  fetchStatistic,
  data,
  isMonth = false,
  legendSales = false,
  legendCount = false,
  isDay = false,
  isYear = false,
  isWeek = false
}: Props) => {
  const { query } = useRouter();
  console.log("queryqueryqueryquery", query);
  // const convertCompletedData = [...Array(numberColumn).keys()].map((_, index) => {
  //   //kiem tra data co ngay index + 1 hay khong
  //   const dayData = dataSet?.order_completed.find((item) => item.date == index + 1);
  //   if (!dayData) {
  //     return {
  //       labels: index + 1,
  //       data: 0,
  //       orderData: 0
  //     }
  //   }
  //   return {
  //     labels: dayData.date,
  //     data: dayData.sales,
  //     orderData: dayData.order_completed
  //   }
  // })
  // const convertDataOrderCancel = [...Array(numberColumn).keys()].map((_, idx) => {
  //   const cancelData = dataSet?.order_cancel.find((item) => item.date == idx + 1)
  //   if (!cancelData) {
  //     return {
  //       labels: idx + 1,
  //       data: 0
  //     }
  //   }
  //   return {
  //     labels: cancelData.date,
  //     data: cancelData.order_cancel
  //   }
  // })
  // // check xem thang nay co bao nhieu nay hoac check

  // lấy dữ liệu ngày trong tháng từ api
  const currentDate = new Date(
    (query?.date_from as string) ?? Date.now()
  );
  //
  const numberDayInMonth = daysInThisMonth(currentDate);
  const numberColumn = isMonth ? 12 : numberDayInMonth;
  // console.log('numberColumn', numberColumn)

  const labels = [...Array(numberColumn).keys()].map(
    (item, index) => `Ngày ${index + 1}`
  );
  console.log('labels', labels)
  const convertData = labels.reduce(
    (acc: any, cur, index) => {
      const findData = data?.find((item: any) => item.date == index + 1);

      if (findData) {
        Object.keys(findData).forEach((key) => {
          if (key !== "date") {
            acc[key] = [...acc[key], +findData[key]];
          }
        });
      } else {
        acc.count.push(0);
        acc.sales.push(0);
      }
      return acc;
    },
    {
      sales: [],
      count: [],
    }
  );
  const numberColumnMonth = isYear ? 1 : 12
  const labelsMonth = [...Array(numberColumnMonth).keys()].map((item, index) =>
    `Tháng ${index + 1}`

  );
  const convertDataMonth = labelsMonth.reduce(
    (acc: any, cur, index) => {
      const findData = data?.find((item: any) => item.date == index + 1);

      if (findData) {
        Object.keys(findData).forEach((key) => {
          if (key !== "date") {
            acc[key] = [...acc[key], +findData[key]];
          }
        });
      } else {
        acc.count.push(0);
        acc.sales.push(0);
      }
      return acc;
    },
    {
      sales: [],
      count: [],
    }

  );

  const numberColumnWeek = isWeek ? 1 : 7

  const labelsWeek = [...Array(numberColumnWeek).keys()].map((item, index) => {
    if (index === 6) return `Chủ nhật`

    return `Thứ ${index + 2}`
  }

  );
  const getItemDate = (dateNumber: string) => {
    // lấy thứ trong tuần
    return new Date(dateNumber).getDay()
    //
  }
  const convertDataWeek = labelsWeek.reduce(
    (acc: any, cur, index) => {

      const findData = data?.find((item: any) => {
        // điều kiện theo index để lấy thứ trong tuần
        const dataWeek = getItemDate(item.date) === 0 ?
          6 : getItemDate(item.date) - 1

        return dataWeek === index
      });
      //
      if (findData) {
        Object.keys(findData).forEach((key) => {
          if (key !== "date") {
            acc[key] = [...acc[key], +findData[key]];
          }
        });
      } else {
        acc.count.push(0);
        acc.sales.push(0);
      }
      return acc;
    },
    {
      sales: [],
      count: [],
    }
  );
  const numberColumnHour = isDay ? 1 : 24;
  const labelsHour = [...Array(numberColumnHour).keys()].map((item, index) =>
    index + 1 < 10 ? `0${index + 1}:00` : `${index + 1}:00`
  );

  const dataHourFormat = data?.map((item: any) => ({
    ...item,
    date: dayjs(item.date).format("HH:00")
  }))?.reduce((acc: any, cur: any) => {
    const findIndex = acc.findIndex((item: any) => item.date == cur.date);

    if (findIndex >= 0) {
      acc[findIndex] = {
        ...acc[findIndex],
        count: +acc[findIndex].count + +cur.count,
        sales: +acc[findIndex].sales + +cur.sales
      }
    } else {
      acc.push(cur)
    }


    return acc;
  }, [])

  console.log("dataHourFormat", data, dataHourFormat);


  const convertDataHour = labelsHour.reduce(
    (acc: any, cur) => {
      const findData = dataHourFormat?.find((item: any) => item.date == cur);

      if (findData) {
        Object.keys(findData).forEach((key) => {
          if (key !== "date") {
            acc[key] = [...acc[key], +findData[key]];
          }
        });
      } else {
        acc.count.push(0);
        acc.sales.push(0);
      }
      return acc;
    },
    {
      sales: [],
      count: [],
    }
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      count: {
        type: "linear",
        display: false,
        position: "left",
      },
      // order_cancel: {
      //   type: "linear",
      //   display: false,
      //   position: "left",
      // },
      sales: {
        type: "linear",
        display: false,
        position: "left",
      },
    },
  };

  console.log("data", data);
  return (
    <div>
      {query.date === "DAY" && (
        <Line
          data={{
            labels: labelsHour,
            datasets: [
              ...(legendCount
                ? [
                  {
                    data: [...convertDataHour.count, 0, 6],
                    label: "Đơn hàng",
                    backgroundColor: "#ED7451",
                    borderColor: "#ED7451",
                    yAxisID: "count",
                    tension: 0.1,
                  },
                ]
                : []),
              ...(legendSales
                ? [
                  {
                    data: [...convertDataHour.sales, 0, 6],
                    label: "Doanh số",
                    backgroundColor: "#3F71D2",
                    borderColor: "#3F71D2",
                    yAxisID: "sales",
                    tension: 0.1,
                  },
                ]
                : []),
              // ...(legendOrderCancel
              //   ? [
              //     {
              //       data: [...convertDataHour.order_cancel, 0, 6],
              //       label: "Đơn đã hủy",
              //       backgroundColor: "#5F708E",
              //       borderColor: "#5F708E",
              //       yAxisID: "order_cancel",
              //       tension: 0.1,
              //     },
              //   ]
              //   : []),
            ],
          }}
          //@ts-ignore
          options={options}
        ></Line>
      )}
      {query.date === "MONTH" && (
        <Line
          data={{
            labels: labels,
            datasets: [
              ...(legendCount
                ? [
                  {
                    label: "Đơn hàng",
                    borderColor: "#ED7451",
                    backgroundColor: "#ED7451",
                    data: [...convertData.count, 0, 6],
                    tension: 0.1,
                    yAxisID: "count",
                  },
                ]
                : []),
              // ...(legendOrderCancel
              //   ? [
              //     {
              //       label: "Đơn đã hủy",
              //       borderColor: "#5F708E",
              //       backgroundColor: "#5F708E",
              //       data: [...convertData.order_cancel, 0, 6],
              //       tension: 0.1,
              //       yAxisID: "order_cancel",
              //     },
              //   ]
              //   : []),
              ...(legendSales
                ? [
                  {
                    label: "Doanh số",
                    borderColor: "#3F71D2",
                    backgroundColor: "#3F71D2",
                    data: [...convertData.sales, 0, 6],
                    tension: 0.1,
                    yAxisID: "sales",
                  },
                ]
                : []),
            ],
          }}
          //@ts-ignore
          options={options}
        />
      )}



      {query.date === "YEAR" && (
        <Line
          data={{
            labels: labelsMonth,
            datasets: [
              ...(legendCount
                ? [
                  {
                    data: [...convertDataMonth.count, 0, 6],
                    label: "Đơn hàng",
                    backgroundColor: "#ED7451",
                    borderColor: "#ED7451",
                    yAxisID: "count",
                    tension: 0.1,
                  },
                ]
                : []),
              ...(legendSales
                ? [
                  {
                    data: [...convertDataMonth.sales, 0, 6],
                    label: "Doanh số",
                    backgroundColor: "#3F71D2",
                    borderColor: "#3F71D2",
                    yAxisID: "sales",
                    tension: 0.1,
                  },
                ]
                : []),
              // ...(legendOrderCancel
              //   ? [
              //     {
              //       data: [...convertDataMonth.order_cancel, 0, 6],
              //       label: "Đơn đã hủy",
              //       backgroundColor: "#5F708E",
              //       borderColor: "#5F708E",
              //       yAxisID: "order_cancel",
              //       tension: 0.1,
              //     },
              //   ]
              //   : []),
            ],
          }}
          //@ts-ignore
          options={options}
        ></Line>
      )}
      {query.date === "WEEK" && (
        <Line
          data={{
            labels: labelsWeek,
            datasets: [
              ...(legendCount
                ? [
                  {
                    data: [...convertDataWeek.count, 0, 6],
                    label: "Đơn hàng",
                    backgroundColor: "#ED7451",
                    borderColor: "#ED7451",
                    yAxisID: "count",
                    tension: 0.1,
                  },
                ]
                : []),
              ...(legendSales
                ? [
                  {
                    data: [...convertDataWeek.sales, 0, 6],
                    label: "Doanh số",
                    backgroundColor: "#3F71D2",
                    borderColor: "#3F71D2",
                    yAxisID: "sales",
                    tension: 0.1,
                  },
                ]
                : []),
              // ...(legendOrderCancel
              //   ? [
              //     {
              //       data: [...convertDataWeek.order_cancel, 0, 6],
              //       label: "Đơn đã hủy",
              //       backgroundColor: "#5F708E",
              //       borderColor: "#5F708E",
              //       yAxisID: "order_cancel",
              //       tension: 0.1,
              //     },
              //   ]
              //   : []),
            ],
          }}
          //@ts-ignore
          options={options}
        ></Line>
      )}
    </div>
  );
};

export default LineChart;
