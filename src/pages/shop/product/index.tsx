import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import TabList from "@mui/lab/TabList";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import useFetchProduct, {
  SearchProduct,
} from "src/hooks/api/shop/useFetchProduct";
import SPaper from "src/components/form/SPaper";
import ProductList from "src/views/pages/product/ProductList";
import useTabList from "src/hooks/useTabList";
import { useAuth } from "src/hooks/useAuth";
import ControlTextField from "src/components/form/ControlTextField";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";
import SCascarder from "src/components/form/cascader";
import { mockCategories } from "src/mockCategory";
import useFormatCascaderValue from "src/hooks/useFormatCascaderValue";
import useFetchCategories from "src/hooks/api/category/useFetchCategories";
import useStatusCount from "src/hooks/product/useStatusCount";
import { ProductStatusCount } from "src/types/product";
import ProductViolate from "src/views/pages/product/ProductViolate";

const validationSchema = yup.object().shape({
  productName: yup
    .string()
    .min(2, "Vui lòng nhập tối thiểu 2 ký tự")
    .matches(/^[^-]+$/, "Vui lòng nhập đúng tên sản phẩm")
    .required("Vui lòng nhập tên sản phẩm")
    .trim(),
  minStock: yup.string().matches(/^(?:\d*|)$/, "Vui lòng không nhập số âm"),
  maxStock: yup.string().matches(/^(?:\d*|)$/, "Vui lòng không nhập số âm"),
  minSales: yup.string().matches(/^(?:\d*|)$/, "Vui lòng không nhập số âm"),
  maximumSales: yup.string().matches(/^(?:\d*|)$/, "Vui lòng không nhập số âm"),
});

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any[]>(["ALL"]);
  console.log("firstcategories", categories);
  const [{ data: categoryTree, loading }] = useFetchCategories();
  console.log("categoryTree", categoryTree);
  const [{ data: statusCount }, handleStatusCount] = useStatusCount();
  console.log("statusCountstatusCount", statusCount);
  const categoryOptions = useFormatCascaderValue({
    data: categoryTree,
  });
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchProduct({
      page: value,
    });
  };

  useEffect(() => {
    handleStatusCount();
  }, []);

  console.log("statusCount", statusCount);

  const countStatus = useMemo(() => {
    const initValue = {
      ACTIVE: 0,
      INACTIVE: 0,
      SOLDOUT: 0,
      REVIEWING: 0,
      BANNED: 0,
      UNLISTED: 0,
      UPDATE: 0,
    };

    return (
      statusCount?.reduce((acc: any, cur: any) => {
        acc[cur.status] = cur.count;
        return acc;
      }, initValue) ?? initValue
    );
  }, [statusCount]);

  const totalCountStatus =
    +countStatus?.ACTIVE +
    +countStatus?.INACTIVE +
    +countStatus?.SOLDOUT +
    +countStatus?.REVIEWING +
    +countStatus?.BANNED +
    +countStatus?.UNLISTED +
    +countStatus?.UPDATE;
  console.log("totalCountStatus", totalCountStatus);
  const totalCountViolate = +countStatus?.BANNED + +countStatus?.UPDATE;
  console.log(totalCountViolate, "totalCountViolate");
  console.log(countStatus?.ACTIVE, "countStatusACTIVE");
  const tabs = [
    {
      label: `Tất cả (${totalCountStatus})`,
      value: "ALL",
    },
    {
      label: `Đang hoạt động (${countStatus?.ACTIVE})`,
      value: "ACTIVE",
    },
    {
      label: `Hết hàng (${countStatus?.SOLDOUT})`,
      value: "SOLDOUT",
    },
    {
      label: `Chờ duyệt (${countStatus?.REVIEWING})`,
      value: "REVIEWING",
    },
    {
      label: `Vi phạm (${totalCountViolate})`,
      value: "BANNED_UPDATE",
    },
    {
      label: `Đã ẩn (${countStatus?.INACTIVE})`,
      value: "INACTIVE",
    },
  ];

  const {
    control,
    handleSubmit,
    formState,
    reset,
    watch,
    unregister,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: validationSchema.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
  });
  const { user } = useAuth();
  const { TabList, TabContext, TabPanel, tabValue, handleUpdateTab } =
    useTabList({
      tabs,
    });
  console.log({ tabValue });
  const [{ products, count }, fetchProduct] = useFetchProduct({});
  console.log("products", products);
  const [filter, setFilter] = useState<SearchProduct | null>(null);

  const onSubmit = (data: any) => {
    console.log(data, "sdhbajkbnjkabsfaui");
    // alert(JSON.stringify(data))
    //neu tab ko phai la vi pham thi goi

    const newFilter = {
      ...filter,
      keyword: data.productName ?? "",
      stockFrom: data.minStock || 0,
      stockTo: data.maxStock || 10000000000,
      minSales: data.minSales || 0,
      maxSales: data.maxSales || null,
      ...(categories[0] !== "ALL"
        ? {
          categoryId: categories[0],
        }
        : {
          categoryId: null,
        }),
    };

    console.log("validateData", newFilter);

    // fetchProduct(newFilter);
    setFilter(newFilter);
    setPage(1);
  };

  const handleDeleteSuccess = () => {
    fetchProduct(filter ? filter : {});
  };
  // click theo status
  useEffect(() => {
    setPage(1);

    if (tabValue === "BANNED_UPDATE") return;

    if (tabValue === "ALL") {
      const newFilter = { ...filter };

      delete newFilter.status;
      setFilter({
        ...newFilter,
      });
      return;
    }
    setFilter({
      ...filter,
      status: tabValue,
    });
  }, [tabValue]);
  //
  useEffect(() => {
    setFilter({
      ...filter,
      page,
    });
  }, [page]);

  useEffect(() => {
    if (tabValue === "BANNED_UPDATE") return;
    fetchProduct({ ...filter });
  }, [filter]);

  console.log("categoryOptions", categoryOptions);

  const categoryOptionsWithDefaultValue = [
    {
      label: "Tất cả ngành hàng",
      value: "ALL",
    },
    ...categoryOptions,
  ];

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    if (!value.startsWith(" ")) {
      setValue("productName", value);
    }
  };
  return (
    <Fragment>
      <SPaper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <ControlTextField
                pattern="^\S.*"
                control={control}
                name="productName"
                placeholder="Vui lòng nhập tối thiểu 2 ký tự"
                fullWidth
                label="Tên sản phẩm"
                ditaction="column"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              {/* <ControlTextField
                control={control}
                name="industry"
                placeholder="tối thiểu"
                fullWidth
                label="Ngành hàng"
                ditaction="column"

              /> */}
              <SCascarder
                options={categoryOptionsWithDefaultValue}
                label="Ngành hàng"
                onSelect={(value) => {
                  console.log("value", value);
                  const categoryId = value.value;
                  if (!categoryId) return;
                  setCategories([categoryId]);
                }}
                value={categories[0]}
                direction="column"
              />
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                spacing={2}
                sx={{
                  alignItems: "start",
                }}
              >
                <Grid item xs={6}>
                  <ControlTextField
                    control={control}
                    name="minStock"
                    placeholder="Tối thiểu"
                    fullWidth
                    label="Kho hàng"
                    ditaction="column"
                    type="number"
                  />
                </Grid>

                <Grid item xs={6}>
                  <ControlTextField
                    control={control}
                    name="maxStock"
                    placeholder="Tối đa"
                    ditaction="column"
                    type="number"
                    label=""
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                spacing={2}
                sx={{
                  alignItems: "start",
                }}
              >
                <Grid item xs={6}>
                  <ControlTextField
                    control={control}
                    name="minSales"
                    placeholder="Tối thiểu"
                    fullWidth
                    label="Đã bán"
                    ditaction="column"
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlTextField
                    control={control}
                    name="maximumSales"
                    placeholder="Tối đa"
                    ditaction="column"
                    type="number"
                    label=""
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={5} direction={"row"} justifyContent={"center"}>
                <Button variant="contained" type="submit" disabled={loading}>
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCategories(["ALL"]);
                    handleUpdateTab(tabs[0].value);
                    reset({
                      productName: "",
                      minStock: "",
                      maxStock: "",
                      minSales: "",
                      maximumSales: "",
                    });
                    fetchProduct({});
                  }}
                >
                  Nhập lại
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </SPaper>
      <SPaper
        sx={{
          mt: 5,
          p: 0,
        }}
      >
        <TabContext value={tabValue}>
          <TabList />
          <TabPanel value="ALL">
            <ProductList
              handleStatusCount={handleStatusCount}
              fetchProduct={fetchProduct}
              products={products}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </TabPanel>
          <TabPanel value="ACTIVE">
            <ProductList
              handleStatusCount={handleStatusCount}
              products={products}
              fetchProduct={fetchProduct}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </TabPanel>
          <TabPanel value="SOLDOUT">
            <ProductList
              handleStatusCount={handleStatusCount}
              fetchProduct={fetchProduct}
              products={products}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </TabPanel>
          <TabPanel value="REVIEWING">
            <ProductList
              handleStatusCount={handleStatusCount}
              fetchProduct={fetchProduct}
              products={products}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </TabPanel>
          <TabPanel value="BANNED_UPDATE">
            <ProductViolate filter={filter} countStatus={countStatus} />
          </TabPanel>
          <TabPanel value="INACTIVE">
            <ProductList
              handleStatusCount={handleStatusCount}
              fetchProduct={fetchProduct}
              products={products}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </TabPanel>
        </TabContext>
        {!(tabValue === "BANNED_UPDATE") && (
          <StyledTableWrap>
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
          </StyledTableWrap>
        )}
      </SPaper>
    </Fragment>
  );
};
export default ProductsPage;
const StyledTableWrap = styled(Box)`
  margin-bottom: 30px;
`;
