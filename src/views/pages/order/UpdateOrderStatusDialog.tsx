import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useUpdateOrderStatus from "src/hooks/api/order/useUpdateOrderStatus";
import UserIcon from "src/layouts/components/UserIcon";
import { Order, OrderStatus } from "src/types/order";
import { ORDER_STATUS } from "./TableOrder";

interface Props {
  open: boolean;
  onClose: () => void;
  orderSelected: Order | null;
  forceUpdateStatus?: OrderStatus;
  onSuccess?: () => void;
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

const UpdateOrderStatusDialog = ({
  open,
  onClose,
  orderSelected,
  forceUpdateStatus,
  onSuccess,
}: Props) => {
  const [{ data, loading }, handleUpdateOrderStatus] = useUpdateOrderStatus({
    onSuccess,
  });
  const [newStatus, setNewStatus] = useState<string>("");

  const handleUpdate = async () => {
    if (!orderSelected) return;

    await handleUpdateOrderStatus({
      orderId: `${orderSelected.id}`,
      status: newStatus as OrderStatus,
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
  }, [open]);

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
      <DialogContent>
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
            Cập nhật trạng thái đơn hàng
          </Typography>
          {/* {orderSelected.status} */}

          <DialogContentText sx={{ mx: 2, mt: 2 }}>
            Bằng cách cập nhật trạng thái đơn hàng, người dùng có thể theo giõi
            trạng thái đơn hàng và đánh giá sản phẩm nếu đơn hàng thành công
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
          </DialogContentText>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          onClick={handleUpdate}
          // loading={loading || addLoading}
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

export default UpdateOrderStatusDialog;
