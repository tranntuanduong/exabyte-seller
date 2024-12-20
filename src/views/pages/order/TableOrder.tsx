import styled from "@emotion/styled";
import { Box, Chip, Pagination, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState
} from "react";
import PriceBox from "src/components/PriceBox";
import ScrollTable from "src/components/ScrollTableBody";
import { PromotionType, urlPrintGhn } from "src/constants";
import { IS_AFFILIATE } from "src/constants/env";
import { DEFAULT_PRODUCT_IMAGE } from "src/constants/image";
import useLogCod from "src/hooks/api/order/useLogCod";
import usePrintOrderBill from "src/hooks/api/order/usePrintOrderBill";
import usePrintOrderCod247 from "src/hooks/api/order/usePrintOrderCod247";
import usePrintOrderGhn from "src/hooks/api/order/usePrintOrderGhn";
import useFetchWarehouses from "src/hooks/api/warehouse/useFetchWarehouses";
import UserIcon from "src/layouts/components/UserIcon";
import { Order, OrderItem, OrderStatus } from "src/types/order";
import { getImageCheck } from "src/utils/image";
import UpdateOrderStatusDialog from "./UpdateOrderStatusDialog";
import UpdateOrderStatusDialogSuco from "./UpdateOrderStatusDialogSuco";

interface StatusItem {
  label: string;
  color: string;
}

interface OrderProps {
  orderList: Order[];
  fetchShopOrder: (data: any) => void;
  count: number;
  page: number;
  handleChangePage: (value: number) => void;
  filters: any;
}

export const ORDER_STATUS: Record<string, StatusItem> = {
  [OrderStatus.PENDING]: {
    label: "Chuẩn bị hàng",
    color: "#565656",
  },
  [OrderStatus.PROCESSING]: {
    label: "Chờ lấy hàng",
    color: "#fb0101",
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao",
    color: "#feb122",
  },
  [OrderStatus.COMPLETED]: {
    label: "Giao thành công",
    color: "#14bd38",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đơn hủy",
    color: "#c2c2c2",
  },

  [OrderStatus.RETURNED]: {
    label: "Trả hàng",
    color: "#ea3e3e",
  },
  [OrderStatus.WAITING_TRANSFER]: {
    label: "Chờ chuyển khoản",
    color: "#bf6d33",
  },
};

const MapShippingUnit: Record<string, any> = {
  OTHER: {
    label: "Khác",
    color: "success",
  },

  BEST: {
    label: "Best",
    color: "primary",
  },

  COD247: {
    label: "COD247",
    color: "primary",
  },
  GHN: {
    label: "GHN",
    color: "primary",
  },
};

const TableOrder = ({
  orderList,
  fetchShopOrder,
  count,
  page,
  handleChangePage,
  filters,
}: OrderProps) => {
  const router = useRouter();

  const { data: warehouses, fetchWarehouse } = useFetchWarehouses();
  const printOrderBill = usePrintOrderBill();

  const {
    data: billData,
    handlePrintOrder,
    loading: printOrderLoading,
  } = printOrderBill;

  const {
    data: dataPrintGhn,
    handlePrintOrder: handlePrintGhn,
    loading: loadingPrintGhn,
  } = usePrintOrderGhn();

  const {
    data: cod247BillData,
    handlePrintOrder: handlePrintCod247Order,
    loading: printCod247OrderLoading,
  } = usePrintOrderCod247();

  // log
  const { data: logCodData, getLogCod } = useLogCod();

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    handleChangePage(+value);
    fetchShopOrder({
      ...filters,
      page: value,
    });
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const [orderSelected, setOrderSelected] = useState<Order | null>(null);

  const groupByProduct = (orderItems: OrderItem[]) => {
    return groupBy(orderItems, (item) => item?.product?.id);
  };

  const getOption = (orderItem: OrderItem, optionId: number | null) => {
    return orderItem?.product?.options?.find(
      (_option) => _option.id === optionId
    );
  };

  const getTotalPrice = (order: Order) => {
    return order.orderItems.reduce((total, orderItem) => {
      total += orderItem.price * orderItem.quantity;
      return total;
    }, 0);
  };

  const getProductImage = (orderItems: OrderItem[]) => {
    if (orderItems?.[0]?.product?.images?.[0]?.url) {
      if (orderItems?.[0]?.product?.options?.length > 0) {
        const option = orderItems?.[0]?.product?.options?.find(
          (_option) => _option.id == orderItems?.[0]?.optionId
        );

        if (option && option.image) {
          return option?.image
            ? getImageCheck(option?.image)
            : DEFAULT_PRODUCT_IMAGE;
        }
      }

      return getImageCheck(orderItems?.[0]?.product?.images?.[0]?.url);
    }
    return DEFAULT_PRODUCT_IMAGE;
  };

  const checkEnebaleChangeStatus = (order: Order) => {
    if (IS_AFFILIATE) {
      if (order.shippingUnit === "BEST") {
        return order.status === "PENDING";
      }

      if (order.shippingUnit === "GHN") {
        return order.status === "PENDING";
      }

      return (
        order.status !== OrderStatus.COMPLETED &&
        order.status !== OrderStatus.RETURNED &&
        order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.WAITING_TRANSFER
      );
    } else {
      if (order.shippingUnit === "COD247") {
        return order.status === "PENDING";
      }

      return (
        order.status !== OrderStatus.COMPLETED &&
        order.status !== OrderStatus.RETURNED &&
        order.status !== OrderStatus.CANCELLED
      );
    }
  };

  useEffect(() => {
    if (!billData) return;

    const url = billData.Url;

    window.open(url, "_blank");
  }, [billData]);

  useEffect(() => {
    if (!dataPrintGhn) return;

    const url = urlPrintGhn.concat(dataPrintGhn.token);

    window.open(url, "_blank");
  }, [dataPrintGhn]);

  useEffect(() => {
    const divToPrint = document.getElementById("InPhieuGui");
    if (!divToPrint || printCod247OrderLoading) return;
    const newWin = window.open("", `Print-Window${Math.random()}`);
    if (!newWin) return;

    newWin.document.open();
    newWin.document.write(
      '<html><body onload="window.print()">' +
        divToPrint.innerHTML +
        "</body></html>"
    );
    newWin.document.close();

    return () => {
      newWin.close();
    };
  }, [printOrderBill]);

  // const orderCodes = useMemo(() => {
  //   return orderList.reduce((acc: Record<number, string>, order) => {
  //     acc[order.id] = order.thirthPartyOrderCode;
  //     return acc;
  //   }, {});
  // }, [orderList]);

  console.log("orderListL:::::", orderList);

  useEffect(() => {
    if (!orderList || orderList.length === 0) return;

    getLogCod(
      orderList
        .filter((order) => order.thirthPartyOrderCode)
        .map((order) => order.thirthPartyOrderCode)
    );
  }, [orderList]);

  return (
    <TableContainer component={Paper}>
      <div dangerouslySetInnerHTML={{ __html: cod247BillData ?? "" }} />
      <ScrollTable>
        <Table
          sx={{
            minWidth: 650,

            border: "1px solid #ececec",
          }}
          aria-label="simple table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <CustomStyledCell>Sản phẩm</CustomStyledCell>
              <CustomStyledCell>Ngày đặt hàng</CustomStyledCell>
              <CustomStyledCell>Mã đơn hàng</CustomStyledCell>
              <CustomStyledCell align="right">Tổng đơn hàng</CustomStyledCell>
              <CustomStyledCell align="right">Giảm giá</CustomStyledCell>
              <CustomStyledCell align="right">
                Đơn vị vận chuyển
              </CustomStyledCell>
              {!IS_AFFILIATE && (
                <CustomStyledCell align="right">
                  <Tooltip title="Trạng thái thanh toán của đơn hàng">
                    <Box sx={{ display: "flex", gapX: 1 }}>
                      <Box>Thanh toán</Box>
                      <UserIcon icon="mdi:information-slab-circle-outline" />
                    </Box>
                  </Tooltip>
                </CustomStyledCell>
              )}
              <CustomStyledCell align="right">Trạng thái</CustomStyledCell>
              <CustomStyledCell align="right">Thao tác</CustomStyledCell>
            </TableRow>
          </TableHead>

          {orderList.map((_order, idx) => (
            <TableBody key={_order.id}>
              <TableRow
                style={{
                  backgroundColor: "#f3f1f1",
                }}
              >
                <TableCell component="th" scope="row">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    {_order.user?.avatar ? (
                      <img
                        src={
                          _order.user?.avatar
                            ? getImageCheck(_order.user?.avatar)
                            : DEFAULT_PRODUCT_IMAGE
                        }
                        alt=""
                        style={{
                          width: "30px",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <UserIcon
                        icon="mdi:account-circle-outline"
                        fontSize="35px"
                      />
                    )}
                    {_order?.user?.username}
                    <UserIcon
                      style={{
                        color: "red",
                        backgroundColor: "#fff",
                        padding: "2px 2px",
                        borderRadius: "2px",
                      }}
                      icon="mdi:message-bulleted"
                    />
                  </Box>
                </TableCell>

                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                {!IS_AFFILIATE && <TableCell align="right"></TableCell>}
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
              {/* map */}
              {Object.values(groupByProduct(_order.orderItems)).map(
                (_orderItems, index) => {
                  return (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={index}
                    >
                      <CustomStyledCell
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        component="th"
                        scope="row"
                      >
                        <img
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "5px",
                          }}
                          src={getProductImage(_orderItems)}
                          alt="ff"
                        />
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CustomStyledCell
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "10px",
                            }}
                          >
                            {_orderItems?.[0]?.product?.originPrice ===
                              PromotionType.ORIGIN_PRICE && (
                              <Chip
                                label="Giá gốc"
                                color="warning"
                                size="small"
                              />
                            )}
                            {_orderItems?.[0]?.product?.originPrice ===
                              PromotionType.SUCOSUN_MALL && (
                              <Chip
                                label="Exabyte Mall"
                                color="info"
                                size="small"
                              />
                            )}
                            <Box
                              sx={{
                                maxWidth: "400px",
                                overflow: "hidden",
                              }}
                            >
                              {_orderItems?.[0]?.product?.name}
                            </Box>
                            <Box>
                              {_orderItems.map((_orderItem, index) => {
                                const option = getOption(
                                  _orderItems[index],
                                  _orderItem.optionId
                                );
                                return (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "flex",
                                      columnGap: "20px",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        flex: 1,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {option?.name}
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "50px",
                                      }}
                                    >
                                      x{_orderItem?.quantity}
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </CustomStyledCell>
                        </Box>
                      </CustomStyledCell>

                      <CustomStyledCell>
                        {index === 0 &&
                          dayjs(_order.createdAt).format("HH:mm DD/MM/YYYY")}
                      </CustomStyledCell>
                      <CustomStyledCell>
                        {index === 0 && <Fragment>{_order.orderCode}</Fragment>}
                      </CustomStyledCell>
                      <CustomStyledCell
                        align="right"
                        sx={{
                          border: "none",
                        }}
                      >
                        {index === 0 && (
                          <PriceBox price={getTotalPrice(_order)} />
                        )}
                      </CustomStyledCell>
                      <CustomStyledCell
                        align="right"
                        sx={{
                          border: "none",
                        }}
                      >
                        {index === 0 && (
                          <PriceBox
                            price={
                              _order.advanceReward + _order.advanceMallReward
                            }
                          />
                        )}
                      </CustomStyledCell>
                      <CustomStyledCell align="center">
                        {index === 0 && (
                          <Chip
                            label={MapShippingUnit[_order.shippingUnit].label}
                            variant="outlined"
                            size="small"
                            color={MapShippingUnit[_order.shippingUnit].color}
                          />
                        )}
                      </CustomStyledCell>
                      {!IS_AFFILIATE && (
                        <CustomStyledCell
                          style={{
                            // color: ORDER_STATUS[_order.status]?.color,
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                          }}
                          align="right"
                        >
                          {/* @ts-ignore */}
                          {logCodData?.[_order.thirthPartyOrderCode]
                            ?.transaction_status ?? "N/A"}
                        </CustomStyledCell>
                      )}
                      <CustomStyledCell
                        style={{
                          color: ORDER_STATUS[_order.status]?.color,
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                        }}
                        align="right"
                      >
                        {index === 0 && ORDER_STATUS[_order.status]?.label}
                      </CustomStyledCell>
                      <CustomStyledCell align="right">
                        {index === 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-end",
                            }}
                          >
                            {/* <UserIcon
                              icon="bx:hide"
                              onClick={() => router.push(`/order/${_order.id}`)}
                              style={{
                                cursor: "pointer",
                              }}
                            /> */}
                            <Link href={`/order/${_order.id}`} target="_blank">
                              <UserIcon
                                icon="bx:hide"
                                // onClick={() =>
                                //   router.push(`/order/${_order.id}`)
                                // }
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </Link>

                            {checkEnebaleChangeStatus(_order) && (
                              <UserIcon
                                icon="mdi:package-variant-closed-check"
                                onClick={() => {
                                  if (IS_AFFILIATE) {
                                    setOrderSelected(_order);
                                  } else {
                                    if (_order.shippingUnit === "COD247") {
                                      router.replace(
                                        `/order/prepare/${_order.id}`
                                      );
                                    } else {
                                      setOrderSelected(_order);
                                    }
                                  }
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            )}
                            {_order.status === "PROCESSING" &&
                              _order.shippingUnit === "BEST" && (
                                <Fragment>
                                  {!printOrderLoading ? (
                                    <UserIcon
                                      icon="mingcute:print-line"
                                      onClick={() => {
                                        if (!_order.orderCode) return;
                                        handlePrintOrder([_order.orderCode]);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    />
                                  ) : (
                                    <UserIcon icon="line-md:loading-twotone-loop" />
                                  )}
                                </Fragment>
                              )}
                            {_order.status === "PROCESSING" &&
                              _order.shippingUnit === "COD247" &&
                              !IS_AFFILIATE && (
                                <Fragment>
                                  {!printCod247OrderLoading ? (
                                    <UserIcon
                                      icon="mingcute:print-line"
                                      onClick={() => {
                                        if (!_order.orderCode) return;
                                        handlePrintCod247Order([
                                          _order.thirthPartyOrderCode,
                                        ]);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    />
                                  ) : (
                                    <UserIcon icon="line-md:loading-twotone-loop" />
                                  )}
                                </Fragment>
                              )}
                          </Box>
                        )}

                        {index === 0 && _order.status === "PROCESSING" &&
                          _order.shippingUnit === "GHN" && (
                            <Fragment>
                              {!loadingPrintGhn ? (
                                <UserIcon
                                  icon="mingcute:print-line"
                                  onClick={() => {
                                    if (!_order.thirthPartyOrderCode) return;
                                    handlePrintGhn([
                                      _order.thirthPartyOrderCode,
                                    ]);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <UserIcon icon="line-md:loading-twotone-loop" />
                              )}
                            </Fragment>
                          )}
                      </CustomStyledCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          ))}
        </Table>
      </ScrollTable>

      <Pagination
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "end",
        }}
        count={count}
        page={page}
        onChange={handleChange}
      />

      {IS_AFFILIATE && (
        <UpdateOrderStatusDialogSuco
          open={!!orderSelected}
          orderSelected={orderSelected}
          onClose={() => setOrderSelected(null)}
          warehouses={warehouses}
          onSuccess={() =>
            fetchShopOrder({
              page,
            })
          }
        />
      )}

      {!IS_AFFILIATE && (
        <UpdateOrderStatusDialog
          open={!!orderSelected}
          orderSelected={orderSelected}
          onClose={() => setOrderSelected(null)}
          onSuccess={() =>
            fetchShopOrder({
              page,
            })
          }
        />
      )}
    </TableContainer>
  );
};

export default TableOrder;

const CustomStyledCell = styled(TableCell)`
  border: none;
  white-space: nowrap;
`;
