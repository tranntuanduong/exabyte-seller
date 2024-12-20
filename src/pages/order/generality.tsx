import { Box, Card, CardContent, Typography } from "@mui/material";
import _, { reduce } from "lodash";
import React, { useMemo, useState } from "react";
import GeneralInformation from "src/components/GeneralInformation";
import useFetchStatistic from "src/hooks/api/generality/useFetchStatistic";
import LineChart from "src/views/pages/chart/LineChart";
import FilterGenerality from "src/views/pages/order/generality/containers/FilterGenerality";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
const Generality = () => {
  const { query } = useRouter();

  const [{ data, loading }, fetchStatistic] = useFetchStatistic();
  console.log("first98", data);
  const [filters, setFilters] = useState({
    legendSales: true,
    legendCount: true,
  });
  const overviewData = useMemo(() => {
    return (
      data?.reduce(
        (acc: any, cur) => {
          Object.keys(cur).forEach((key) => {
            if (key !== "date") {
              acc[key] = acc[key] + +cur[key];
            }
          });
          return acc;
        },
        {
          count: 0,
          sales: 0,
        }
      ) ?? {
        count: 0,
        sales: 0,
      }
    );
  }, [data]);
  console.log("overviewData", overviewData);
  const handleFilter = (newValue: any) => {
    if (Object.values(newValue).every((value) => value === false)) {
      toast.error("Phải chọn ít nhất một giá trị");
      return;
    }
    console.log("newValue", newValue);
    setFilters(newValue);
  };
  return (
    <Box>
      <Card
        sx={{
          marginBottom: "20px",
          overflow: "unset",
        }}
      >
        <CardContent>
          <FilterGenerality fetchStatistic={fetchStatistic} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Tổng quan</Typography>
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              gap: "20px",
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleFilter({
                  ...filters,
                  legendSales: !filters.legendSales,
                })
              }
            >
              <GeneralInformation
                colorBorder={filters.legendSales ? "#3F71D2" : "#DCDCDC"}
                type="price"
                title="Doanh số"
                number={overviewData.sales ?? 0}
              />
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleFilter({
                  ...filters,
                  legendCount: !filters.legendCount,
                })
              }
            >
              <GeneralInformation
                colorBorder={filters.legendCount ? "#ED7451" : "#DCDCDC"}
                title="Đơn hàng"
                number={overviewData.count ?? 0}
              />
            </div>
            {/* <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleFilter({
                  ...filters,
                  legendOrderCancel: !filters.legendOrderCancel,
                })
              }
            >
              <GeneralInformation
                colorBorder={filters.legendOrderCancel ? "#5F708E" : "#DCDCDC"}
                title="Đơn đã huỷ"
                number={overviewData.order_cancel ?? 0}
              />
            </div> */}
          </Box>
        </CardContent>
        <Box padding={"20px"}>
          <LineChart
            fetchStatistic={fetchStatistic}
            isWeek={false}
            isYear={false}
            isDay={false}
            data={data}
            isMonth={false}
            legendSales={filters.legendSales}
            legendCount={filters.legendCount}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Generality;
