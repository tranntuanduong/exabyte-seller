import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  Switch,
  Tab,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import useChangeStatusShopCategory from "src/hooks/api/shop/useChangeStatusShopCategory";
import useDeleteProdShopCategory from "src/hooks/api/shop/useDeleteProdShopCategory";
import useFetchShopCategoryDetail from "src/hooks/api/shop/useFetchShopCategoryDetail";
import PopupAddProductCategory from "./containers/PopupAddProductCategory";
import PopupEditCategory from "./containers/PopupEditCategory";
import TabPosted from "./containers/TabPosted";

const DetailCategory = () => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false);
  const [valueTab, setValueTab] = useState("1");
  const [valueEdit, setValueEdit] = useState("");
  const [idCategory, setIdCategory] = useState<number>();
  const [{}, handleChangeStatusCategory] = useChangeStatusShopCategory();
  const [{}, handleDeleteProdShopCategory] = useDeleteProdShopCategory();
  const [productIdDele, setProductIdDele] = useState<string[]>([]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  const [{ data, loading, count }, fetchShopCategoryDetail] =
    useFetchShopCategoryDetail();

  console.log(data, "dataxxx");

  const handleDeleteProd = async () => {
    const newProd = productIdDele.map((item) => +item);
    if (router.query.id) {
      console.log("vafp");
      await handleDeleteProdShopCategory(
        Number(String(router.query.id)),
        newProd
      );
      fetchShopCategoryDetail(String(router.query.id));
    }
  };
  const dataDetail: any = data;
  useEffect(() => {
    if (router.query.id) {
      console.log("router.query.id", router.query.id);
      fetchShopCategoryDetail(String(router.query.id));
    }
  }, [router.isReady, router.query.id, openModalEdit]);
  const handleUpdateStatusCategory = async () => {
    if (router.query.id) {
      await handleChangeStatusCategory(Number(String(router.query.id)));
      fetchShopCategoryDetail &&
        fetchShopCategoryDetail(String(router.query.id));
    }
  };

  return (
    <div>
      {dataDetail && (
        <div>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 30, fontWeight: 700, color: "black" }}
                    >
                      {dataDetail.name}
                    </Typography>
                    <AiFillEdit
                      onClick={() => {
                        setIdCategory(dataDetail.id);
                        setValueEdit(dataDetail.name);
                        setOpenModalEdit(true);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      marginTop: "10px",
                    }}
                  >
                    Tổng sản phẩm: {dataDetail?.products?.length ?? 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    Danh mục sẽ hiển thị trong trang Shop
                    <Switch
                      checked={dataDetail.status === "ON" ? true : false}
                      onChange={() => handleUpdateStatusCategory()}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              marginTop: 10,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 18,
                  }}
                >
                  Danh sách sản phẩm
                </Typography>
                <div
                  style={{
                    columnGap: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button onClick={handleDeleteProd} variant="contained">
                    Xoá
                  </Button>
                  <Button
                    onClick={() => setOpenModalAddProduct(true)}
                    variant="contained"
                  >
                    Thêm sản phẩm
                  </Button>
                </div>
              </Box>

              <TabContext value={valueTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Đã đăng" value="1" />
                    <Tab label="Không hợp lệ" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <TabPosted
                    idCategory={idCategory}
                    dataProd={dataDetail?.products}
                    handleChangeCheckProd={setProductIdDele}
                    count={count}
                  />
                </TabPanel>
                <TabPanel value="2">Phần này chưa có gì cả</TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </div>
      )}
      <PopupEditCategory
        idCategory={idCategory ?? 0}
        value={valueEdit}
        open={openModalEdit}
        handleClose={() => setOpenModalEdit(false)}
      />
      <PopupAddProductCategory
        fetchShopCategoryDetail={fetchShopCategoryDetail}
        idCategory={data?.id ?? 0}
        open={openModalAddProduct}
        handleClose={() => setOpenModalAddProduct(false)}
      />
    </div>
  );
};

export default DetailCategory;
