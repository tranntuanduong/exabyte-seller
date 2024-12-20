import { Box, Button, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { DEFAULT_PRODUCT_IMAGE } from "src/constants/image";
import useFetchCategoryKiot from "src/hooks/api/connect-app/useFetchCategoryKiot";
import useFetchProductKiot from "src/hooks/api/connect-app/useFetchProductKiot";
import useAddProduct from "src/hooks/product/useAddProduct";
import { LoadingButton } from "@mui/lab";

const ListProdConnect = () => {
  const [{ data }, fetchCategoryKiot] = useFetchCategoryKiot();
  const [{ data: dataProduct }, fetchProductKiot] = useFetchProductKiot();
  const [selectSyncProduct, setSelectSyncProduct] = useState<number[]>([]);
  const [checkCategory, setCheckCategory] = useState<number>(0);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [{ loading }, handleAddProduct] = useAddProduct();

  const dataSearch = useMemo(() => {
    return dataProduct?.filter((item) =>
      item.fullName.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [dataProduct, searchProduct]);

  const dataCategory = useMemo(() => {
    return data?.filter((item) =>
      item.categoryName.toLowerCase().includes(searchCategory.toLowerCase())
    );
  }, [data, searchCategory]);
  useEffect(() => {
    const query = {
      pageSize: 12,
      currentItem: 0,
    };
    fetchCategoryKiot(query);
    fetchProductKiot();
  }, []);

  const handleCheckCategory = (e: any) => {
    setCheckCategory(e.target.value);
  };

  const handleSync = async () => {
    if (!dataProduct) return;
    const listProd = dataProduct
      .filter((item) => {
        return selectSyncProduct.includes(item.id);
      })
      .map((i) => ({
        images: i.images,
        name: i.fullName,
        description: i.description,
        price: i.basePrice,
        stock: i.inventories[0].onHand,
        sku: i.barCode,
        shippingInfo: {
          weight: i.weight,
          length: 0,
          height: 0,
          width: 0,
        },
        status: "UNLISTED",
        options: [],
        tierVariantion: [],
      }));
    console.log("123x", listProd);
    Promise.allSettled(
      listProd.map(async (item) => await handleAddProduct(item))
    )
      .then(() => toast.success("Đồng bộ thành công"))
      .catch(() => toast.success("Đồng bộ thất bại"));
  };

  const handleSelected = (idSelect: number) => {
    if (selectSyncProduct.includes(idSelect)) {
      const newSelect = selectSyncProduct.filter((item) => item !== idSelect);
      setSelectSyncProduct(newSelect);
    } else {
      setSelectSyncProduct((prev) => [...prev, idSelect]);
    }
  };

  const handleSelectedAll = () => {
    if (!dataProduct) return;
    if (selectSyncProduct.length === dataProduct.length) {
      setSelectSyncProduct([]);
    } else {
      const newSelect = dataProduct?.map((item) => item.id);
      setSelectSyncProduct(newSelect);
    }
  };

  useEffect(() => {
    if (checkCategory === 0) return;
    fetchProductKiot({ categoryId: checkCategory });
  }, [checkCategory]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={3}
          sx={{
            margin: 0,
            height: "100%",
          }}
        >
          {/* Header Category */}
          <div
            style={{
              background: "#ccc",
              textAlign: "center",
              borderRadius: "6px",
              padding: "10px 0px",
            }}
          >
            <div>Danh mục sản phẩm</div>
          </div>
          <div>
            <TextField
              id="input-with-icon-textfield"
              label="Tìm kiếm danh mục"
              size="small"
              fullWidth
              sx={{ mt: 2 }}
              variant="outlined"
              onChange={(e) => setSearchCategory(e.target.value)}
            />

            <RadioGroup
              name="mapOptions"
              value={checkCategory}
              onChange={handleCheckCategory}
            >
              <FormControlLabel value={0} control={<Radio />} label="Tất cả" />
              {dataCategory?.map((item) => (
                <FormControlLabel
                  value={item.categoryId}
                  control={<Radio />}
                  label={item.categoryName}
                  key={item.categoryId}
                />
              ))}
            </RadioGroup>
          </div>
        </Grid>
        <Grid item xs={9}>
          {/* Header Product */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              background: "#ccc",
              borderRadius: "6px",
              padding: "10px 0px",
              height: "44px",
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <Checkbox
                checked={selectSyncProduct.length === dataProduct?.length}
                onClick={handleSelectedAll}
              />
            </div>
            <div
              style={{
                flex: 3,
              }}
            >
              Sản phẩm
            </div>

            <div
              style={{
                flex: 3,
              }}
            >
              Kho hàng
            </div>
            <div
              style={{
                flex: 3,
              }}
            >
              Giá
            </div>
          </div>
          <div>
            <TextField
              id="input-with-icon-textfield"
              label="Tìm kiếm sản phẩm"
              size="small"
              fullWidth
              sx={{ mt: 2 }}
              variant="outlined"
              onChange={(e) => setSearchProduct(e.target.value)}
            />
            {dataSearch?.map((item, idx) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: "6px",
                  padding: "10px 0px",
                }}
                key={idx}
              >
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <Checkbox
                    checked={selectSyncProduct.includes(item.id)}
                    onChange={() => handleSelected(item.id)}
                  />
                </div>
                <div
                  style={{
                    flex: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      width: "60px",
                      height: "60px",
                      marginRight: "10px",
                    }}
                    src={item?.images?.[0] ?? DEFAULT_PRODUCT_IMAGE}
                    alt=""
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <p
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.fullName}
                    </p>
                    <p>Xem chi tiết</p>
                  </div>
                </div>
                <div
                  style={{
                    flex: 3,
                  }}
                >
                  {item.inventories[0].onHand}
                </div>
                <div
                  style={{
                    flex: 3,
                  }}
                >
                  {item.basePrice}
                </div>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          columnGap: "10px",
          float: "right",
          padding: "20px 0",
        }}
      >
        <LoadingButton
          variant="contained"
          onClick={handleSync}
          loading={loading}
        >
          Đồng bộ ({selectSyncProduct.length})
        </LoadingButton>
        <Button variant="outlined">Quay lại</Button>
      </Box>
    </Box>
  );
};

export default ListProdConnect;
