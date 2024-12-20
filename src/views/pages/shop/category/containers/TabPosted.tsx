import {
  Box,
  Checkbox,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Stack from "@mui/material/Stack";
import React, { useEffect, useMemo, useState } from "react";
import { formatPrice } from "src/@core/utils/currency-vnd";
import { urlImage } from "src/constants";
import useFetchShopCategory from "src/hooks/api/shop/useFetchShopCategory";
import useFetchShopCategoryIdProduct from "src/hooks/api/shop/useShopCategoryIdProduct";
import { Product } from "src/types/product";

interface TabPostedProps {
  idCategory: any;
  dataProd: Product[];
  fetchProduct?: any;
  count: any;
  handleChangeCheckProd?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TabPosted = ({
  count,
  fetchProduct,
  idCategory,
  dataProd,
  handleChangeCheckProd,
}: TabPostedProps) => {
  console.log(dataProd, "dataProductCategoryxxx");
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  console.log(checkedItems, "xxxggg");
  const [
    { data: dataShopCategory, loading: loadingShopCategory },
    fetchShopCategory,
  ] = useFetchShopCategory();
  useEffect(() => {
    fetchShopCategory();
  }, []);
  const [page, setPage] = useState(1);
  // const [
  //   { data: dataProductCategory, loading: loadingProductCategory, count },
  //   fetchProductCategory,
  // ] = useFetchProductCategory();
  // console.log(dataProductCategory, "dataProductCategoryxxx");

  useEffect(() => {
    fetchShopCategoryIdProduct(String(idCategory));
  }, []);

  const [
    { data: dataShopCategoryIdProduct, loading: loadingShopCategoryIdProduct },
    fetchShopCategoryIdProduct,
  ] = useFetchShopCategoryIdProduct();
  console.log("xxxsdfds", dataShopCategoryIdProduct);

  // useEffect(() => {
  //   fetchProductCategory({});
  // }, []);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(value, "valuetest");
    setPage(value);
    fetchProduct &&
      fetchProduct({
        page: value,
      });
  };

  const handleChangeAll = (event: any) => {
    console.log("event.target.checked", event.target.checked);
    const newCheckedState = dataProd.map((item) => item.id);
    console.log(newCheckedState, "newCheckedState");

    setCheckedAll(event.target.checked);
    // @ts-ignore
    setCheckedItems(event?.target?.checked ? newCheckedState : []);
    handleChangeCheckProd &&
      // @ts-ignore
      handleChangeCheckProd(event?.target?.checked ? newCheckedState : []);
  };

  const handleChangeItem = (event: any, itemId: string) => {
    const currentIndex = checkedItems.indexOf(itemId);
    const newChecked = [...checkedItems];
    console.log(newChecked, "newcheck");

    if (currentIndex === -1) {
      newChecked.push(itemId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedAll(newChecked.length === dataProd.length);
    setCheckedItems(newChecked);
    handleChangeCheckProd && handleChangeCheckProd(newChecked);
  };

  const selectedProductIds = useMemo(() => {
    return dataShopCategoryIdProduct?.products?.map((elm: any) => elm.id);
  }, [dataShopCategoryIdProduct]);

  useEffect(() => {
    if (!selectedProductIds) return;
    setCheckedItems((prev) => [...prev, ...selectedProductIds]);
  }, [selectedProductIds]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                {" "}
                <Checkbox checked={checkedAll} onChange={handleChangeAll} />
              </TableCell>
              <TableCell align="center">Sản phẩm</TableCell>
              <TableCell align="center">Kho hàng</TableCell>
              <TableCell align="center">Giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataProd?.map((row: any, idx: any) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{
                    width: "50px",
                  }}
                  component="th"
                  scope="row"
                >
                  <Checkbox
                    // defaultChecked={dataShopCategoryIdProduct.products.map((elm:any) => elm.id)}
                    key={row.id}
                    checked={checkedItems.includes(`${row.id}`)}
                    onChange={(event) => handleChangeItem(event, `${row.id}`)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    width: "250px",
                  }}
                  align="center"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.images?.[0]?.url && (
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "10px",
                          borderRadius: "6px",
                        }}
                        src={
                          row.images?.[0]?.url
                            ? `${urlImage}/${row.images?.[0]?.url}`
                            : ""
                        }
                        alt=""
                      />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "250px",
                          textAlign: "left",
                        }}
                      >
                        {row.name}
                      </Typography>
                      <Typography>Mã:{row.code}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography>{row.stock}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{formatPrice(parseInt(row.price))}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        sx={{
          float: "right",
        }}
      >
        Đã chọn {checkedAll ? dataProd.length : checkedItems.length} sản phẩm
      </Typography>
      <div
        style={{
          marginTop: "30px",
        }}
      >
        <Stack>
          <Pagination
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
            count={Math.ceil(count / 5)}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  );
};

export default TabPosted;
