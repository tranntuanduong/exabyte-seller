import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
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
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ControlTextField from "src/components/form/ControlTextField";
import useUpdateOrderStatus from "src/hooks/api/order/useUpdateOrderStatus";
import UserIcon from "src/layouts/components/UserIcon";
import { Order, OrderStatus } from "src/types/order";
import { Warehouse } from "src/types/warehouse";
import * as yup from "yup";
import { ORDER_STATUS } from "./TableOrder";

interface Props {
  open: boolean;
  onClose: () => void;
  orderSelected: Order | null;
  forceUpdateStatus?: OrderStatus;
  onSuccess?: () => void;
  warehouses: any;
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

const shippingUnits = [
  {
    label: "Vận chuyển ngoài",
    value: "OTHER",
  },
  {
    label: "BEST",
    value: "BEST",
  },
  {
    label: "Giao hàng nhanh",
    value: "GHN",
  },
];

const UpdateOrderStatusDialogSuco = ({
  open,
  onClose,
  orderSelected,
  forceUpdateStatus,
  onSuccess,
  warehouses,
}: Props) => {
  const [{ data, loading }, handleUpdateOrderStatus] = useUpdateOrderStatus({
    onSuccess,
  });
  const [newStatus, setNewStatus] = useState<string>("");
  const [shippingUnit, setShippingUnit] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<number | null>(null);

  const schemaValidate = useMemo(() => {
    if (shippingUnit === "GHN")
      return yup.object().shape({
        length: yup.string().required("Yêu cầu").default("").nullable(),
        width: yup.string().required("Yêu cầu").default("").nullable(),
        height: yup.string().required("Yêu cầu").default("").nullable(),
      });

    return yup.object().shape({
      length: yup.string().default("").nullable(),
      width: yup.string().default("").nullable(),
      height: yup.string().default("").nullable(),
    });
  }, [shippingUnit]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const handleUpdate = async (data: any) => {
    if (!orderSelected) return;

    if (!newStatus) {
      toast.error("Vui lòng chọn trạng thái đơn hàng");
      return;
    }

    if (newStatus === "PROCESSING" && !shippingUnit) {
      toast.error("Vui lòng chọn đơn vị vận chuyển");
      return;
    }

    const warehouseSelected = warehouses?.find(
      (item: any) => item.id == warehouseId
    );

    const orderInSelectedWarehouse = {
      addressPickId: warehouseSelected?.thirthPartyAddress, //not need for best express
      orderItemIds: orderSelected?.orderItems?.map((orderItem) => orderItem.id),
    };

    await handleUpdateOrderStatus({
      orderId: `${orderSelected.id}`,
      status: newStatus as OrderStatus,
      // warehouseId: warehouseId,
      // thirthPartyAddress: warehouseSelected?.thirthPartyAddress,
      seperateOrders: [orderInSelectedWarehouse],
      ...(shippingUnit && {
        forceShippingUnit: shippingUnit,
      }),
      forceDimension: {
        width: +data.width,
        height: +data.height,
        length: +data.length,
      },
    });

    onClose();
  };

  const optionsEnable = useMemo(() => {
    if (!orderSelected) return [];
    if (orderSelected.status === OrderStatus.COMPLETED) return [];
    if (orderSelected.status === OrderStatus.CANCELLED) return [];
    if (orderSelected.status === OrderStatus.RETURNED) return [];

    if (orderSelected.status === OrderStatus.PENDING)
      return ["PROCESSING", "CANCELLED"];

    if (orderSelected.status === OrderStatus.PROCESSING)
      return ["SHIPPED", "CANCELLED"];

    if (orderSelected.status === OrderStatus.SHIPPED)
      return ["COMPLETED", "RETURNED"];

    return options.filter((option: any) => option !== orderSelected.status);
  }, [orderSelected]);

  useEffect(() => {
    setNewStatus("");
    setShippingUnit("");
  }, [open]);

  const totalOrderValue = useMemo(() => {
    return orderSelected?.orderItems?.reduce((total: any, orderItem: any) => {
      return total + orderItem.price * orderItem.quantity;
    }, 0);
  }, [orderSelected]);

  if (!orderSelected) return <></>;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleUpdate)}>
        <DialogContent>
          <Box>
            <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
              Chuẩn bị hàng
            </Typography>
            {/* {orderSelected.status} */}

            <DialogContentText sx={{ mx: 2, mt: 2 }}>
              Xác nhận bạn đã sẵn sàn giao hàng cho đơn vị vận chuyển
              <Box
                sx={{
                  display: "flex",
                  columnGap: "10px",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      fontWeight: 500,
                      mt: 5,
                      mb: 2,
                      color: "#333",
                    }}
                  >
                    Trạng thái
                  </Box>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newStatus}
                    onChange={(e: SelectChangeEvent) =>
                      setNewStatus(e.target.value as string)
                    }
                    disabled={optionsEnable.length === 0}
                  >
                    {optionsEnable.map((option: any, index: number) => (
                      <MenuItem key={index} value={option}>
                        <Box
                          sx={{
                            color: ORDER_STATUS[option]?.color,
                            fontWeight: "700",
                          }}
                        >
                          {ORDER_STATUS[option]?.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                {orderSelected.status === "PENDING" &&
                  newStatus !== "CANCELLED" && (
                    <Box>
                      <Box
                        sx={{
                          fontWeight: 500,
                          mt: 5,
                          mb: 2,
                          color: "#333",
                        }}
                      >
                        Đơn vị vận chuyển
                      </Box>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={shippingUnit}
                        onChange={(e: SelectChangeEvent) =>
                          setShippingUnit(e.target.value as string)
                        }
                        disabled={optionsEnable.length === 0}
                      >
                        {shippingUnits.map((option: any, index: number) => (
                          <MenuItem
                            key={index}
                            value={option.value}
                            disabled={
                              option.value === "BEST" &&
                              totalOrderValue > 5000000
                            }
                          >
                            <Box
                              sx={{
                                fontWeight: "700",
                              }}
                            >
                              {option.label}{" "}
                              {option.value === "BEST" &&
                                totalOrderValue > 5000000 &&
                                "(Chưa hỗ trợ đơn > 5 triệu)"}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  )}
              </Box>
              {shippingUnit === "GHN" && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <Box>Kích thước gói hàng sau đóng gói:</Box>
                  <Grid
                    container
                    gap={2}
                    sx={{
                      mt: 2,
                    }}
                  >
                    <Grid item xs={3}>
                      <ControlTextField
                        control={control}
                        name="length"
                        fullWidth
                        placeholder="Dài"
                        hasLabel={false}
                        type="number"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            alignItems: "baseline",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              | cm
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <ControlTextField
                        control={control}
                        name="width"
                        fullWidth
                        placeholder="Rộng"
                        hasLabel={false}
                        type="number"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            alignItems: "baseline",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              | cm
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <ControlTextField
                        control={control}
                        name="height"
                        fullWidth
                        placeholder="Cao"
                        hasLabel={false}
                        type="number"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            alignItems: "baseline",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              | cm
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <LoadingButton variant="contained" type="submit" loading={loading}>
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
      </form>
    </Dialog>
  );
};

export default UpdateOrderStatusDialogSuco;
