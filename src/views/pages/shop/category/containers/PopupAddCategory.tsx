import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useAddShopCategory from "src/hooks/api/shop/useAddShopCategory";
import { useAuth } from "src/hooks/useAuth";
import { stringArrToSlug } from "src/utils/string";

interface PopupAddCategoryProps {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const PopupAddCategory = ({
  open,
  handleClose,
  onSuccess,
}: PopupAddCategoryProps) => {
  const [nameCategory, setNameCategory] = useState("");

  const [{ data, error, loading }, handleAddShopCategory] = useAddShopCategory({
    onSuccess,
  });

  const handleAddCategory = async () => {
    if (!nameCategory) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const newCategory = {
      name: nameCategory,
      slug: stringArrToSlug([nameCategory]),
    };
    await handleAddShopCategory(newCategory);
    handleClose();
    setNameCategory("");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thêm danh mục</DialogTitle>
        <DialogContent>
          <p
            style={{
              marginBottom: "10px",
            }}
          >
            Thêm danh mục
          </p>
          <TextField
            sx={{
              width: "500px",
            }}
            id="outlined-basic"
            placeholder="Nhập vào tên danh mục hiển thị "
            variant="outlined"
            onChange={(e) => {
              setNameCategory(e.target.value);
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleAddCategory}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupAddCategory;
