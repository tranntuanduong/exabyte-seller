import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableCategory from "./containers/TableCategory";
import PopupAddCategory from "./containers/PopupAddCategory";
import useFetchShopCategory from "src/hooks/api/shop/useFetchShopCategory";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import SCascarder from "src/components/form/cascader";
import { mockCategories } from "src/mockCategory";
import TableDragCategory from "./containers/TableDragCategory";
import useFetchProductCategory from "src/hooks/api/shop/useFetchProductCategory";
import { AiFillSecurityScan } from "react-icons/ai";

const ListCategory = () => {
  const router = useRouter();
  const [openModalAddCategory, setOpenModalAddCategory] = useState(false);
  const [orderEle, setOrderEle] = useState(false);
  const [{ data, loading }, fetchShopCategory] = useFetchShopCategory();
  const { user } = useAuth();
  const [closeDrag, setCloseDrag] = useState(false);

  console.log("dataxxxx", data);
  useEffect(() => {
    if (user.id) {
      fetchShopCategory();
    }
  }, [router.isReady, user]);
  return (
    <div>
      <Typography sx={{ fontSize: 30, fontWeight: 700, color: "black" }}>
        Danh sách danh mục
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "20px",
          float: "right",
          margin: "20px 0",
        }}
      >
        {/* <Button variant="contained">Xem trước</Button> */}
        <Button onClick={() => setOrderEle(!orderEle)} variant="contained">
          Điều chỉnh thứ tự
        </Button>
        <Button
          onClick={() => setOpenModalAddCategory(true)}
          variant="contained"
        >
          Thêm danh mục
        </Button>
      </Box>

      <PopupAddCategory
        open={openModalAddCategory}
        handleClose={() => setOpenModalAddCategory(false)}
        onSuccess={fetchShopCategory}
      />

      {orderEle ? (
        <TableDragCategory
          fetchShopCategory={fetchShopCategory}
          dataCategory={data}
          onDragSuccess={() => {
            setOrderEle(false);
            fetchShopCategory();
          }}
        />
      ) : (
        <TableCategory
          fetchShopCategory={fetchShopCategory}
          dataCategory={data}
        />
      )}
    </div>
  );
};

export default ListCategory;
