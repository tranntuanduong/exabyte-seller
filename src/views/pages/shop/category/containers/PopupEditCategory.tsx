import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useAddShopCategory from "src/hooks/api/shop/useAddShopCategory";
import useEditShopCategory from "src/hooks/api/shop/useEditShopCategory";
import { useAuth } from "src/hooks/useAuth";
import { stringArrToSlug } from "src/utils/string";

interface PopupEditCategoryProps {
  idCategory: number;
  value: string;
  open: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
}

const PopupEditCategory = ({
  idCategory,
  value,
  open,
  handleClose,
  onSuccess,
}: PopupEditCategoryProps) => {
  const {
    query: { id },
  } = useRouter();
  console.log("valuexxx", id);

  const [nameCategory, setNameCategory] = useState("");

  const [{}, handleEditShopCategory] = useEditShopCategory({
    onSuccess,
  });

  const handleEditCategory = async () => {
    if (idCategory) {
      const newCategory = {
        name: nameCategory,
        slug: stringArrToSlug([nameCategory]),
      };
      await handleEditShopCategory(newCategory, idCategory);
    }
    handleClose();
  };
  useEffect(() => {
    setNameCategory(value);
  }, [value, open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <p
            style={{
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Chỉnh sửa thư mục
          </p>
          <TextField
            sx={{
              width: "500px",
            }}
            value={nameCategory}
            id="outlined-basic"
            label="Nhập vào tên danh mục mới"
            variant="outlined"
            onChange={(e) => {
              setNameCategory(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleEditCategory} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupEditCategory;
