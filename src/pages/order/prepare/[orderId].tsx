import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoMdReturnLeft } from "react-icons/io";
import ControlTextField from "src/components/form/ControlTextField";
import useFetchOrderDetail from "src/hooks/api/order/useFetchOrderDetail";
import useUpdateOrderStatus from "src/hooks/api/order/useUpdateOrderStatus";
import useFetchProductDetail from "src/hooks/api/shop/useFetchProductDetail";
import useCheckWarehouseEnable from "src/hooks/api/warehouse/useCheckWarehouseEnable";
import useFetchWarehouseDetails from "src/hooks/api/warehouse/useFetchWarehouseDetails";
import useFetchWarehouses from "src/hooks/api/warehouse/useFetchWarehouses";
import UserIcon from "src/layouts/components/UserIcon";
import { Order, OrderItem, OrderStatus } from "src/types/order";
import { Warehouse } from "src/types/warehouse";
import OrderAllowcation, {
  SeparateOrders,
} from "src/views/pages/order/OrderAllowcation";
import * as yup from "yup";

interface Props {
  open: boolean;
  onClose: () => void;
  orderDetails: Order | null;
  forceUpdateStatus?: OrderStatus;
  onSuccess?: () => void;
  warehouses: Warehouse[];
}

interface DialogContent {
  title: string;
  content: string;
}

const options: any = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const schemaValidate = yup.object().shape({
  length: yup
    .string()
    .required("Trường này là bắt buộc")
    .default("")
    .nullable(),
  width: yup.string().required("Trường này là bắt buộc").default("").nullable(),
  height: yup
    .string()
    .required("Trường này là bắt buộc")
    .default("")
    .nullable(),
  weight: yup
    .string()
    .required("Trường này là bắt buộc")
    .default("")
    .nullable(),
});

const PreareOrderPage = () => {
  const router = useRouter();
  const [{ data, loading }, handleUpdateOrderStatus] = useUpdateOrderStatus({
    onSuccess: () => {
      router.replace("/order");
    },
  });

  const [{ data: orderDetails }, handleFetchOrderDetails] =
    useFetchOrderDetail();

  const { data: warehouses, fetchWarehouse } = useFetchWarehouses();

  const [newStatus, setNewStatus] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<number | null>(null);

  const [warehouseIds, setWarehouseIds] = useState<Record<string, number>>({});

  const [anotherOrder, setAnotherOrder] = useState<Record<string, any>>({});
  const [isSeparateOrders, setIsSeparateOrders] = useState(false);

  // const {
  //   data: warehouseDetails,
  //   fetchWarehouse,
  //   loading: fetchWareghouseDetailsLoading,
  // } = useFetchWarehouseDetails();

  // useEffect(() => {
  //   if (!warehouseId) return;

  //   fetchWarehouse(`${warehouseId}`);
  // }, [warehouseId]);

  useEffect(() => {
    fetchWarehouse();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      handleFetchOrderDetails(router.query.orderId as string);
    }
  }, [router.isReady]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,

    // getInputProps,
    reset,
    getValues,
  } = useForm<any>({
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const warehouseSelected = warehouses?.find((item) => item.id === warehouseId);

  const handleUpdate = async (data: any) => {
    if (!orderDetails) return;

    if (!warehouseId) {
      toast.error("Vui lòng chọn kho xuất hàng");
      return;
    }

    if (!warehouseSelected) {
      toast.error("Kho hàng không hợp lệ");
      return;
    }

    await handleUpdateOrderStatus({
      orderId: `${orderDetails.id}`,
      status: OrderStatus.PROCESSING,
      warehouseId: warehouseId,
      thirthPartyAddress: warehouseSelected?.thirthPartyAddress,
      ...data,
    });

    // onClose();
  };

  const optionsEnable = useMemo(() => {
    if (!orderDetails) return [];
    if (orderDetails.status === OrderStatus.COMPLETED) return [];
    if (orderDetails.status === OrderStatus.CANCELLED) return [];
    if (orderDetails.status === OrderStatus.RETURNED) return [];

    if (orderDetails.status === OrderStatus.PENDING)
      return ["PROCESSING", "CANCELLED"];

    if (orderDetails.status === OrderStatus.PROCESSING)
      return ["SHIPPED", "CANCELLED"];

    if (orderDetails.status === OrderStatus.SHIPPED)
      return ["COMPLETED", "RETURNED"];

    return options.filter((option: any) => option !== orderDetails.status);
  }, [orderDetails]);

  const {
    checkProductExistInWarehouse,
    checkWarehouseDisable,
    isAllProductExistInWarehouse,
  } = useCheckWarehouseEnable({
    orderDetails,
    warehouseSelected,
  });

  // tach don
  const separateOrders: SeparateOrders = useMemo(() => {
    const init = {
      allOrderItemInSelectedWarehouse: [],
      anotherOrderItem: [],
    };

    return (
      orderDetails?.orderItems?.reduce((acc: any, item) => {
        if (checkProductExistInWarehouse(item, warehouseSelected)) {
          acc.allOrderItemInSelectedWarehouse.push(item);
        } else {
          acc.anotherOrderItem.push(item);
        }

        return acc;
      }, init) ?? init
    );
  }, [warehouseSelected, orderDetails]);

  const handlePrepareOrderWithSEparateOrder = () => {
    if (!orderDetails) return;

    const orderInSelectedWarehouse = {
      addressPickId: warehouseSelected?.thirthPartyAddress,
      orderItemIds: separateOrders.allOrderItemInSelectedWarehouse.map(
        (orderItem) => orderItem.id
      ),
    };

    const anotherOrder =
      Object.keys(warehouseIds)
        .reduce((acc: any, key) => {
          // key: orderItemId,
          // value: warehouseId
          const thirthParyAddress =
            warehouses?.find((warehouse) => warehouse.id === warehouseIds[key])
              ?.thirthPartyAddress ?? "";

          if (!thirthParyAddress) {
            toast.error("Kho hàng lỗi");
            return;
          }

          if (acc[thirthParyAddress]) {
            acc[thirthParyAddress].orderItemIds.push(+key);
          } else {
            acc[thirthParyAddress] = {
              addressPickId: thirthParyAddress,
              orderItemIds: [+key],
            };
          }
          return acc;
        }, [])
        ?.filter((item: any) => item) ?? [];

    const seperateOrders = [orderInSelectedWarehouse, ...anotherOrder];

    if (
      separateOrders.anotherOrderItem.length !==
      Object.keys(warehouseIds).length
    ) {
      toast.error("Vui lòng chọn kho xuất hàng cho tất cả sản phẩm");
      return;
    }

    handleUpdateOrderStatus({
      orderId: `${orderDetails.id}`,
      status: OrderStatus.PROCESSING,
      // warehouseId: warehouseId,
      // thirthPartyAddress: warehouseSelected?.thirthPartyAddress,
      seperateOrders: seperateOrders,
    });

    // console.log("prepareOrder", seperateOrder);
  };

  const handlePrepareOrder = () => {
    handlePrepareOrderWithSEparateOrder();
  };

  if (!orderDetails) return <>1</>;

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Box>
            <Box>
              <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
                Chuẩn bị hàng
              </Typography>

              <Box sx={{ mx: 2, mt: 2 }}>
                Xác nhận bạn đã sẵn sàn giao hàng cho đơn vị vận chuyển
                <Box
                  sx={{
                    mt: 5,
                    mb: 2,
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  Kho hàng
                </Box>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={`${warehouseId}`}
                  onChange={(e: SelectChangeEvent) => {
                    // @ts-ignore
                    setWarehouseId(e?.target?.value as string);
                    setWarehouseIds({});
                  }}
                  disabled={optionsEnable.length === 0}
                  size="small"
                  // fullWidth
                >
                  {warehouses?.map((option: any, index: number) => {
                    const isDisable = checkWarehouseDisable(option);
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
                {/* tach don */}
                {!isAllProductExistInWarehouse && (
                  <OrderAllowcation
                    orderDetails={orderDetails}
                    warehouseSelected={warehouseSelected}
                    separateOrders={separateOrders}
                    warehouses={warehouses ?? []}
                    warehouseIds={warehouseIds}
                    setWarehouseIds={setWarehouseIds}
                    isSeparateOrders={isSeparateOrders}
                    setIsSeparateOrders={setIsSeparateOrders}
                  />
                )}
                {/* <Box
                  sx={{
                    marginTop: "30px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Thông tin gói hàng
                </Box>
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <ControlTextField
                      inputProps={{ maxLength: 30 }}
                      control={control}
                      name="length"
                      fullWidth
                      label="Chiều dài (cm)"
                      ditaction="column"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ControlTextField
                      inputProps={{ maxLength: 30 }}
                      control={control}
                      name="width"
                      fullWidth
                      label="Chiều rộng (cm)"
                      ditaction="column"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ControlTextField
                      inputProps={{ maxLength: 30 }}
                      control={control}
                      name="height"
                      fullWidth
                      label="Chiều cao (cm)"
                      ditaction="column"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ControlTextField
                      inputProps={{ maxLength: 30 }}
                      control={control}
                      name="weight"
                      fullWidth
                      label="Tổng cân nặng (g)"
                      ditaction="column"
                    />
                  </Grid>
                </Grid> */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    onClick={handlePrepareOrder}
                    loading={loading}
                  >
                    Chuẩn bị hàng
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PreareOrderPage;
