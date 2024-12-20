import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";

import React, { useState } from "react";
import { SearchProduct } from "src/hooks/api/shop/useFetchProduct";
import SCascarder from "src/components/form/cascader";
import ControlTextField from "src/components/form/ControlTextField";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetchCategories from "src/hooks/api/category/useFetchCategories";
import useFormatCascaderValue from "src/hooks/useFormatCascaderValue";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

interface FilterProdProps {
  fetchData: (data: SearchProduct) => Promise<void>;
  products: any;
}

const FilterProd = ({ fetchData, products }: FilterProdProps) => {
  const [categories, setCategories] = useState<any[]>(["ALL"]);
  const [{ data: categoryTree, loading }] = useFetchCategories();
  console.log("categoryTree", categoryTree);
  const categoryOptions = useFormatCascaderValue({
    data: categoryTree,
  });

  console.log("products", products);

  const schema = yup.object().shape({
    priceTo: yup
      .number()
      .typeError("Phải nhập số")
      .positive("Phải nhập số dương")
      .nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSearchProd = (data: FieldValues) => {
    {
      console.log(data, "datagthrthrhrxxx");
    }
    fetchData({
      keyword: data.nameProd || data.codeProd,
      minSales: data.priceFrom,
      maxSales: data.priceTo,
      ...(categories[0] !== "ALL"
        ? {
            categoryId: categories[0],
          }
        : {
            categoryId: null,
          }),
    });
  };
  console.log("categoryOptions", categoryOptions);
  const categoryOptionsWithDefaultValue = [
    {
      label: "Tất cả ngành hàng",
      value: "ALL",
    },
    ...categoryOptions,
  ];
  return (
    <div>
      <form onSubmit={handleSubmit((data) => handleSearchProd(data))}>
        <Grid container spacing={5} columnSpacing={10}>
          <Grid item xs={6}>
            <SCascarder
              options={categoryOptionsWithDefaultValue}
              label="Ngành hàng"
              onSelect={(value) => {
                console.log("valuevaluevalue", value);
                const categoryId = value.value;
                if (!categoryId) return;
                setCategories([categoryId]);
              }}
              value={categories[0]}
              direction="column"
            />
          </Grid>
          <Grid item xs={6}>
            <ControlTextField
              control={control}
              name="nameProd"
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              ditaction="column"
            />
          </Grid>
          <Grid item xs={6}>
            <ControlTextField
              control={control}
              name="codeProd"
              label="Mã sản phẩm"
              placeholder="Nhập mã sản phẩm"
              ditaction="column"
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
                  name="priceFrom"
                  label="Giá"
                  placeholder="Từ"
                  type="number"
                  pattern="[0-9]*[.,]?[0-9]+"
                  ditaction="column"
                />
              </Grid>
              <Grid item xs={6}>
                <ControlTextField
                  control={control}
                  name="priceTo"
                  placeholder="Đến"
                  type="number"
                  ditaction="column"
                  label=""
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                gap: 5,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button variant="contained" size="large" type="submit">
                Tìm
              </Button>
              <Button
                onClick={() => {
                  setCategories(["ALL"]);
                  fetchData({});
                  reset({
                    nameProd: "",
                    codeProd: "",
                    priceFrom: "",
                    priceTo: "",
                  });
                }}
                variant="outlined"
                size="large"
              >
                Nhập lại
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default FilterProd;
