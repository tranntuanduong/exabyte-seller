import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import useDeleteShopProduct from "src/hooks/api/shop/useDeleteShopProduct";
import { Product } from "src/types/product";
interface PopupDeleteProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
}
const DeleteDialog = ({
  open,
  handleClose,
  onConfirm,
  loading,
  title = "Nhấn xác nhận để xóa",
}: PopupDeleteProps) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={onConfirm} disabled={loading}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
