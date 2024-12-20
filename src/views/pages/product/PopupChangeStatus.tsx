import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react'
import { Product } from 'src/types/product';
interface PopupChangeStatusProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void
  productSelected: any
  statusLoading: boolean
}
const PopupChangeStatus = ({ open, handleClose, onConfirm, productSelected, statusLoading }: PopupChangeStatusProps) => {
  console.log('productSelected', productSelected)
  return (
    <div>
      {productSelected?.status === "ACTIVE" ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Nhấn xác nhận ẩn sản phẩm</DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="contained" onClick={onConfirm} disabled={statusLoading}>
              Xác nhận
            </Button>
          </DialogActions>

        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Nhấn xác nhận hiển thị sản phẩm</DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="contained" onClick={onConfirm} disabled={statusLoading}>
              Xác nhận
            </Button>
          </DialogActions>

        </Dialog>
      )}


    </div>
  )
}

export default PopupChangeStatus