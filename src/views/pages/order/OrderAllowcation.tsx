import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { DEFAULT_PRODUCT_IMAGE } from "src/constants/image";
import useCheckWarehouseEnable from "src/hooks/api/warehouse/useCheckWarehouseEnable";
import { Order, OrderItem } from "src/types/order";
import { Warehouse } from "src/types/warehouse";
import { getImageCheck } from "src/utils/image";

interface Props {
  orderDetails?: Order;
  warehouseSelected?: Warehouse;
  separateOrders: SeparateOrders;
  warehouses: Warehouse[];
  warehouseIds: any;
  setWarehouseIds: any;
  isSeparateOrders: any;
  setIsSeparateOrders: any;
}

export interface SeparateOrders {
  allOrderItemInSelectedWarehouse: OrderItem[];
  anotherOrderItem: OrderItem[];
}

const OrderAllowcation = ({
  orderDetails,
  warehouseSelected,
  separateOrders,
  warehouses,
  warehouseIds,
  setWarehouseIds,
  isSeparateOrders,
  setIsSeparateOrders
}: Props) => {

  const { allOrderItemInSelectedWarehouse, anotherOrderItem } = separateOrders;

  const {
    checkProductExistInWarehouse,
    checkWarehouseDisable,
    isAllProductExistInWarehouse,
  } = useCheckWarehouseEnable({
    orderDetails,
    warehouseSelected,
  });

  return (
    <Box
      sx={{
        marginTop: "6px",
      }}
    >
      <Box
        sx={{
          fontSize: "12px",
        }}
      >
        <Box>
          1. Một số sản phẩm không nằm trong kho {warehouseSelected?.name}.
        </Box>
        <Box>
          2. Bạn có thể tách đơn hoặc tiếp tục gửi hàng trong cùng 1 kiện hàng.
          (trong trường hợp gửi cùng kiện hàng, bạn đảm bảo có sẵn hàng để gửi
          cùng một đơn cho người mua)
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        sx={{
          mt: 2,
        }}
        onClick={() => {
          setIsSeparateOrders(!isSeparateOrders);
        }}
      >
        {isSeparateOrders ? "Hủy tách" : "Tách đơn"}
      </Button>
      {isSeparateOrders && (
        <Box
          sx={{
            mt: 5,
          }}
        >
          <Box>Sản phẩm gửi từ {warehouseSelected?.name}:</Box>

          {allOrderItemInSelectedWarehouse.map((orderItem) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
              }}
            >
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                }}
                src={
                  orderItem.product?.images?.[0]?.url
                    ? getImageCheck(orderItem.product?.images?.[0]?.url)
                    : DEFAULT_PRODUCT_IMAGE
                }
                alt="ff"
              />

              <Box>
                {orderItem.product?.name}{" "}
                <span
                  style={{
                    fontSize: "12px",
                  }}
                >
                  x
                </span>{" "}
                {orderItem.quantity}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {isSeparateOrders && (
        <Box sx={{ mt: 5 }}>
          <Box>Sản phẩm muốn tách đơn:</Box>
          {anotherOrderItem.map((orderItem) => (
            <Box
              sx={{
                display: "flex",
                columnGap: "20px",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "4px",
                  flex: 1,
                  maxWidth: "400px",
                }}
              >
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                  }}
                  src={
                    orderItem.product?.images?.[0]?.url
                      ? getImageCheck(orderItem.product?.images?.[0]?.url)
                      : DEFAULT_PRODUCT_IMAGE
                  }
                  alt="ff"
                />

                <Box>
                  {orderItem.product?.name}{" "}
                  <span
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    x
                  </span>{" "}
                  {orderItem.quantity}
                </Box>
              </Box>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={`${warehouseIds[orderItem.id]}`}
                onChange={(e: SelectChangeEvent) => {
                  // @ts-ignore
                  setWarehouseIds((prev) => ({
                    ...prev,
                    [orderItem.id]: e?.target?.value as string,
                  }));
                }}
                size="small"
              >
                {warehouses.map((option: any, index: number) => {
                  const isDisable = checkWarehouseDisable(option, orderItem);
                  return (
                    <MenuItem
                      key={index}
                      value={option.id}
                      disabled={isDisable}
                    >
                      <Box
                        sx={{
                          // color: ORDER_STATUS[option]?.color,
                          fontWeight: "700",
                        }}
                      >
                        {option.name}{" "}
                        {isDisable && (
                          <span
                            style={{
                              fontWeight: "normal",
                            }}
                          >
                            (Không có trong kho)
                          </span>
                        )}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrderAllowcation;
