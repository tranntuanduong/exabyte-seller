import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useAddShopCategory from "src/hooks/api/shop/useAddShopCategory";
import { useAuth } from "src/hooks/useAuth";
import { stringArrToSlug } from "src/utils/string";
import FilterProd from "./FilterProd";
import useFetchProduct from "src/hooks/api/shop/useFetchProduct";
import TabPosted from "./TabPosted";
import useAddProductShopCategory from "src/hooks/api/shop/useAddProductShopCategory";
import { useRouter } from "next/router";

interface PopupAddProductCategoryProps {
  idCategory: number;
  open: boolean;
  handleClose: () => void;
  fetchShopCategoryDetail?: (categoryId: string) => Promise<void>;
  onSuccess?: () => void;
}

const PopupAddProductCategory = ({
  fetchShopCategoryDetail,
  idCategory,
  open,
  handleClose,
  onSuccess,
}: PopupAddProductCategoryProps) => {
  const [nameCategory, setNameCategory] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  const [listProdCheck, setListProdCheck] = useState<string[]>([]);

  const [{ loading: loadingProd, products, count }, fetchProduct] =
    useFetchProduct({
      manual: open ? false : true,
    });
  const handleFetchDetail = async () => {
    if (router.query.id) {
      fetchShopCategoryDetail &&
        fetchShopCategoryDetail(String(router.query.id));
    }
  };

  const [{}, handleAddProductShopCategory] = useAddProductShopCategory({
    onSuccess: () => {
      handleFetchDetail();
      onSuccess && onSuccess();
    },
  });

  console.log("listProdCheck", listProdCheck);

  const [{ data, error, loading }, handleAddShopCategory] = useAddShopCategory(
    {}
  );

  const handleAddCategory = () => {
    handleAddProductShopCategory({ productIds: listProdCheck }, idCategory);
    handleFetchDetail();
    handleClose();
  };

  // useEffect(() => {

  //   fetchProduct({});
  // }, []);

  console.log("prodxx", products);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">Chọn sản phẩm</DialogTitle>
        <DialogContent>
          <FilterProd fetchData={fetchProduct} products={products} />
          <TabPosted
            idCategory={idCategory}
            handleChangeCheckProd={setListProdCheck}
            dataProd={products}
            fetchProduct={fetchProduct}
            count={count}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleAddCategory} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupAddProductCategory;
