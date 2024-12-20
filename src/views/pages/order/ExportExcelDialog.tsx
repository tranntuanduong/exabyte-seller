import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import UserIcon from "src/layouts/components/UserIcon";

import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { getFirstAndLastDayOfMonth } from "src/utils/date";
import useFetchShopOrder from "src/hooks/api/order/useFetchShopOrder";
import { utils as XLSXUtils, writeFile } from "xlsx";
import { toast } from "react-hot-toast";
import { groupBy } from "lodash";
import { ORDER_STATUS } from "./TableOrder";
import { MapShippingUnit } from "src/constants/order";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ExportExcelDialog = ({ open, onClose }: Props) => {
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth(new Date());

  const [startDate, setStartDate] = useState<any>(new Date(firstDay));
  const [endDate, setEndDate] = useState<any>(new Date(lastDay));
  const [{ data: orderList, count, countInfo, loading }, fetchShopOrder] =
    useFetchShopOrder();

  const getOrderValue = (order: any) => {
    return order.orderItems.reduce((acc: number, cur: any) => {
      return (acc += cur.price * cur.quantity);
    }, 0);
  };

  const handleExportExcel = async () => {
    const data = await fetchShopOrder({
      order_date_from: new Date(startDate).toISOString(),
      order_date_to: new Date(endDate).toISOString(),
      // status: "COMPLETED",
      not_pagination: true,
    });

    const orders = data?.data?.list ?? [];

    if (orders.length === 0) {
      toast.error("Không có đơn hàng nào trong khoảng thời gian này", {});
      onClose();
      return;
    }

    const dataExport = orders.reduce((acc: any, cur: any) => {
      const totalValue = getOrderValue(cur);
      const orderItems = cur.orderItems.map((orderItem: any) => ({
        ...cur,
        itemData: orderItem,
        totalValue,
      }));
      acc.push(...orderItems);

      return acc;
    }, []);

    const headers = [
      "Mã đơn hàng",
      "Thanh toán",
      "Ngày đặt hàng",
      "Ngày cập nhật lần cuối",
      "Tên khách hàng",
      "Email khách hàng",
      "Đơn vị vận chuyển",
      "Trạng thái",
      "Tên sản phẩm",
      "Phân loại",
      "Giá sản phẩm",
      "Số lượng",
      "Thành tiền",
    ];

    // custom width
    const columnWidths = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 35 },
    ];

    const groupData = groupBy(dataExport, "orderCode");

    console.log("groupData", groupData);

    // Merge cells
    let lastIndex = 0;
    let startIndex = 1;
    // const mergeCells = Object.keys(groupData).reduce(
    //   (acc: any[], orderCode) => {
    //     const orderNumber = groupData[orderCode].length;
    //     startIndex = lastIndex + 1;
    //     lastIndex = startIndex + orderNumber - 1;

    //     acc = [
    //       ...acc,
    //       ...[
    //         { s: { r: startIndex, c: 0 }, e: { r: lastIndex, c: 0 } },
    //         { s: { r: startIndex, c: 1 }, e: { r: lastIndex, c: 1 } },
    //         { s: { r: startIndex, c: 2 }, e: { r: lastIndex, c: 2 } },
    //         { s: { r: startIndex, c: 3 }, e: { r: lastIndex, c: 3 } },
    //         { s: { r: startIndex, c: 4 }, e: { r: lastIndex, c: 4 } },
    //         { s: { r: startIndex, c: 5 }, e: { r: lastIndex, c: 5 } },
    //         { s: { r: startIndex, c: 6 }, e: { r: lastIndex, c: 6 } },
    //         { s: { r: startIndex, c: 11 }, e: { r: lastIndex, c: 11 } },
    //       ],
    //     ];

    //     return acc;
    //   },
    //   []
    // );

    // console.log("groupData", groupData);

    const worksheetData = [
      headers,
      ...Object.values(groupData).reduce((acc: any, item: any[]) => {
        const orderItemData = item.map((orderItem, index) => {
          const option = orderItem?.itemData?.product?.options?.find(
            (_option: any) => _option.id == orderItem.itemData.optionId
          );

          console.log("orderItemxxxx", orderItem);

          if (index === 0) {
            return [
              orderItem.orderCode,
              orderItem.paymentMethod,
              dayjs(orderItem.createdAt).format("DD/MM/YYYY"),
              dayjs(orderItem.updatedAt).format("DD/MM/YYYY"),
              orderItem?.user?.username,
              orderItem?.user?.email,
              MapShippingUnit[orderItem.shippingUnit],
              ORDER_STATUS[orderItem.status]?.label,
              orderItem?.itemData?.product?.name ?? "**Sản phẩm đã bị xóa",
              option?.name ?? "",
              orderItem.itemData.price,
              orderItem.itemData.quantity,
              // orderItem.totalValue,
              orderItem.itemData.price * orderItem.itemData.quantity,
            ];
          }
          return [
            orderItem.orderCode,
            orderItem.paymentMethod,
            dayjs(orderItem.createdAt).format("DD/MM/YYYY"),
            dayjs(orderItem.updatedAt).format("DD/MM/YYYY"),
            orderItem?.user?.username,
            orderItem?.user?.email,
            MapShippingUnit[orderItem.shippingUnit],
            ORDER_STATUS[orderItem.status]?.label,
            orderItem?.itemData?.product?.name ?? "**Sản phẩm đã bị xóa",
            option?.name ?? "",
            orderItem.itemData.price,
            orderItem.itemData.quantity,
            // orderItem.totalValue,
            orderItem.itemData.price * orderItem.itemData.quantity,
          ];
        });
        acc.push(...orderItemData);

        return acc;
      }, []),
    ];

    // Create worksheet
    const worksheet = XLSXUtils.aoa_to_sheet(worksheetData);

    // Apply the column widths to the worksheet
    worksheet["!cols"] = columnWidths;
    // worksheet["!merges"] = mergeCells;

    // Create workbook and add the worksheet
    const workbook = XLSXUtils.book_new();

    XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to an Excel file
    writeFile(
      workbook,
      `danh_sach_don_hang_${dayjs(startDate).format("DD/MM/YYYY")}_den_${dayjs(
        endDate
      ).format("DD/MM/YYYY")}.xlsx`
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      // onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
            Export Excel
          </Typography>

          <DialogContentText sx={{ mx: 2, mt: 2 }}>
            Xuất excel các đơn hoàn thành từ{" "}
            {dayjs(startDate).format("DD/MM/YYYY")} đến{" "}
            {dayjs(endDate).format("DD/MM/YYYY")}
            <Box sx={{ mt: 5, display: "flex", columnGap: "20px" }}>
              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                label="Từ ngày"
                value={dayjs(startDate)}
                onChange={(date) => {
                  setStartDate(date ?? dayjs(new Date()));
                }}
                format="DD/MM/YYYY"
              />

              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                label="Đến ngày"
                value={dayjs(endDate)}
                onChange={(date) => {
                  setEndDate(date ?? dayjs(new Date()));
                }}
                format="DD/MM/YYYY"
              />
            </Box>
          </DialogContentText>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleExportExcel}
          // type="submit"
          loading={loading}
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
      <Box
        sx={{
          position: "absolute",
          padding: "15px",
          right: "0",
          top: "0",
        }}
      >
        <UserIcon onClick={onClose} icon="mdi:close" />
      </Box>
    </Dialog>
  );
};

export default ExportExcelDialog;
