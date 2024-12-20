import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import DateRangePickerCustom from "src/components/DatePickRangeCustom";
import ControlTextField from "src/components/form/ControlTextField";
import useFetchShopOrder from "src/hooks/api/order/useFetchShopOrder";
import useTabList from "src/hooks/useTabList";
import TableOrder from "src/views/pages/order/TableOrder";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";

import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import ControlSelect from "src/components/form/ControlSelect";
import ExportExcelDialog from "src/views/pages/order/ExportExcelDialog";
import { useRouter } from "next/router";
import queryString from "query-string";

const schemaValidate = yup.object().shape({
  codeTransport: yup.string().default("ALL"),
});

interface OrderForm {
  codeOrders: string;
  codeBill: string;
  codeProduct: string;
  codeName: string;
  codeDate: string;
  codeTransport: string;
}
const unitShipping = [
  {
    label: "Tất cả đơn vị",
    id: "ALL",
  },
];
const OrderPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderForm>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const router = useRouter();

  const [openExportExcelDialog, setOpenExportExcelDialog] =
    useState<boolean>(false);

  const [startDate, setStartDate] = useState<any>(new Date());
  console.log("startDatestartDate", startDate);
  let formattedDateStart = useMemo(() => {
    if (startDate) {
      return startDate.toISOString();
    }
  }, [startDate]);
  console.log("formattedDateStart", formattedDateStart);
  const currentYear = new Date().getFullYear();
  const startDateData =
    startDate === null ? new Date(currentYear, 0, 1) : startDate;

  const [endDate, setEndDate] = useState<any>(new Date());
  let formattedDateEnd = useMemo(() => {
    if (endDate) {
      return endDate.toISOString();
    }
  }, [endDate]);

  const endDateData = endDate == null ? new Date(currentYear, 11, 31) : endDate;
  // const handleStartDateChange = (date: any) => {
  //   console.log('datedatedate', date)
  //   setStartDate(date ?? dayjs(new Date()));
  // };

  // const handleEndDateChange = (date: any) => {
  //   setEndDate(date ?? dayjs(new Date()));
  // };

  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
  });
  console.log("filters", filters);
  const [{ data: orderList, count, countInfo }, fetchShopOrder] =
    useFetchShopOrder();
  console.log("countInfo", countInfo);
  // const [page, setPage] = useState(1);

  // const cout1 = count ? count : '0'
  const tabs = [
    {
      label: `Tất cả (${count ? count : "0"})`,
      value: "ALL",
    },
    {
      label: `Chuẩn bị hàng (${countInfo?.PENDING ? countInfo?.PENDING : "0"})`,
      value: "PENDING",
    },
    {
      label: `Chờ lấy hàng (${
        countInfo?.PROCESSING ? countInfo?.PROCESSING : "0"
      })`,
      value: "PROCESSING",
    },
    {
      label: `Đang giao (${countInfo?.SHIPPED ? countInfo?.SHIPPED : "0"})`, //dang giao: SHIPPING
      value: "SHIPPED",
    },
    {
      label: `Giao thành công (${
        countInfo?.COMPLETED ? countInfo?.COMPLETED : "0"
      })`,
      value: "COMPLETED",
    },
    {
      label: `Đơn hủy (${countInfo?.CANCELLED ? countInfo?.CANCELLED : "0"})`,
      value: "CANCELLED",
    },
    {
      label: `Trả hàng (${countInfo?.RETURNED ? countInfo?.RETURNED : "0"})`,
      value: "RETURNED",
    },
  ];

  const { TabList, TabContext, TabPanel, tabValue } = useTabList({
    tabs,
  });

  useEffect(() => {
    if (orderList) {
      setStartDate(
        orderList[0]?.createdAt ? new Date(orderList[0].createdAt) : null
      );
      setEndDate(
        orderList[0]?.updatedAt ? new Date(orderList[0].updatedAt) : null
      );
    }
  }, []);

  const onSubmit = (data: OrderForm) => {
    const newFilters = {
      ...filters,
      orderCode: data.codeOrders,
      product_name: data.codeProduct,
      user_name: data.codeName,
      shipping_code: data.codeBill,
      shipping_unit: data.codeTransport,
      order_date_from: formattedDateStart,
      order_date_to: formattedDateEnd,
      //@ts-ignore
      // shipping_unit: data.codeTransport === "ALL"
    };
    console.log("newFilters", newFilters);
    setFilters(newFilters);
  };

  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      page: 1,
    }));

    if (tabValue === "ALL") {
      const newFilters = { ...filters };

      delete newFilters.status;
      setFilters({
        ...newFilters,
      });
      return;
    }

    setFilters({
      ...filters,
      status: tabValue,
    });
  }, [tabValue]);
  useEffect(() => {
    if (router.isReady) {
      const filters: Record<string, any> = router.query;
      fetchShopOrder({
        ...filters,
        ...(filters.order_date_from && {
          order_date_from: new Date(filters.order_date_from).toISOString(),
        }),
        ...(filters.order_date_to && {
          order_date_to: new Date(filters.order_date_to).toISOString(),
        }),
      });
    }
  }, [router]);

  useEffect(() => {
    const search = queryString.stringify(filters);
    // push filter to url
    router.push(`/order?${search}`);
  }, [filters]);

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <ControlTextField
                  control={control}
                  name="codeOrders"
                  placeholder="Nhập mã đơn hàng"
                  fullWidth
                  label="Mã đơn hàng"
                  ditaction="column"
                />
              </Grid>
              <Grid item xs={6}>
                {/* <ControlTextField
                  control={control}
                  name="codeBill"
                  placeholder="Nhập mã vận đơn"
                  fullWidth
                  label="Mã vận đơn"
                  ditaction="column"
                /> */}
                <FormControl fullWidth>
                  <ControlSelect
                    name="codeTransport"
                    control={control}
                    options={unitShipping}
                    label="Đơn vị vận chuyển"
                    direction="column"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <ControlTextField
                  control={control}
                  name="codeProduct"
                  placeholder="Nhập tên sản phẩm"
                  fullWidth
                  label="Tên sản phẩm"
                  ditaction="column"
                />
              </Grid>
              <Grid item xs={6}>
                <ControlTextField
                  control={control}
                  name="codeName"
                  placeholder="Nhập tên người mua"
                  fullWidth
                  label="Tên người mua"
                  ditaction="column"
                />
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography marginBottom={"14px"}>Ngày đặt hàng</Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      columnGap: "10px",
                      paddingTop: "̀50px",
                    }}
                  >
                    <DatePicker
                      slotProps={{ textField: { size: "small" } }}
                      label="Từ ngày"
                      value={dayjs(startDateData)}
                      onChange={(date) => {
                        setStartDate(date ?? dayjs(new Date()));
                      }}
                      format="DD/MM/YYYY"
                    />
                    <DatePicker
                      slotProps={{ textField: { size: "small" } }}
                      label="Đến ngày"
                      value={dayjs(endDateData)}
                      onChange={(date) => {
                        setEndDate(date ?? dayjs(new Date()));
                      }}
                      format="DD/MM/YYYY"
                    />
                  </Box>
                </Box>
              </Grid>
              {/* <Grid item xs={6}>
                <FormControl fullWidth>
                  <ControlSelect
                    name="codeTransport"
                    control={control}
                    options={unitShipping}
                    label="Đơn vị vận chuyển"
                    direction="column"
                  />
                </FormControl>
              </Grid> */}
            </Grid>
            <Grid
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                columnGap: "10px",
              }}
            >
              <Button
                style={{
                  textTransform: "capitalize",
                }}
                variant="contained"
                type="submit"
              >
                Tìm
              </Button>
              <Button
                style={{
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setFilters({
                    page: 1,
                  });
                  reset({
                    codeOrders: "",
                    codeBill: "",
                    codeProduct: "",
                    codeName: "",
                    codeDate: "",
                  });
                }}
              >
                Nhập lại
              </Button>
            </Grid>
            <Grid
              style={{
                marginTop: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenExportExcelDialog(true)}
                >
                  Excel
                </Button>
              </Box>
              <TabContext value={tabValue}>
                <Grid
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  <TabList />
                  <TabPanel value="ALL">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(count / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="PENDING">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.PENDING / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="PROCESSING">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.PROCESSING / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="SHIPPED">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.SHIPPED / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="COMPLETED">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.COMPLETED / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="CANCELLED">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.CANCELLED / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                  <TabPanel value="RETURNED">
                    <TableOrder
                      orderList={orderList}
                      filters={filters}
                      fetchShopOrder={fetchShopOrder}
                      count={Math.ceil(countInfo?.RETURNED / 30)}
                      page={filters.page}
                      handleChangePage={(value) =>
                        setFilters((prev) => ({ ...prev, page: value }))
                      }
                    />
                  </TabPanel>
                </Grid>
              </TabContext>
              {/* <TableOrder
              orderList={orderList}
              filters={filters}
              fetchShopOrder={fetchShopOrder}
              count={Math.ceil(count / 30)}
              page={page}
              handleChangePage={(value) => setPage(value)}
            /> */}
            </Grid>
          </CardContent>
        </Card>
      </form>
      <ExportExcelDialog
        open={openExportExcelDialog}
        onClose={() => setOpenExportExcelDialog(false)}
      />
    </Fragment>
  );
};

export default OrderPage;
