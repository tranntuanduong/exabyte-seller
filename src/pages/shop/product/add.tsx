import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Fragment, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Tiny from "src/components/Tiny";
import ControlTextField from "src/components/form/ControlTextField";
import MutipleUploadImage from "src/components/form/MutipleUploadImage";
import SPaper from "src/components/form/SPaper";
import SCascarder from "src/components/form/cascader";
import ClassifyInput from "src/components/form/classify-input";
import { PromotionType } from "src/constants";
import { IS_AFFILIATE } from "src/constants/env";
import useFetchCategories from "src/hooks/api/category/useFetchCategories";
import useAddOrUpdateProduct from "src/hooks/api/shop/useAddOrUpdateProduct";
import useValidateAddOrUpdateProductForm from "src/hooks/api/shop/useValidateAddOrUpdateProductForm";
import useFormatCascaderValue from "src/hooks/useFormatCascaderValue";
import UserIcon from "src/layouts/components/UserIcon";
import ShippingFeeNote from "src/views/pages/product/ShippingFeeNote";
import SingleSalesInfomation from "src/views/pages/shop/product/SingleSalesInfomation";
import * as yup from "yup";

interface AddProduct {
  id: number;
  name: string;
  description: null;
  thumbnail: string;
  slug: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

const validationSchema = yup.object().shape({
  productName: yup
    .string()
    .required("Vui lòng nhập tên sản phẩm")
    .min(10, "Vui lòng nhập tên sản phẩm ít nhất 10 ký tự")
    .max(120, "Vui lòng nhập tên sản phẩm tối đa 120 ký tự"),

  weight: yup
    .string()
    .required("Vui lòng nhập trọng lượng sản phẩm")
    .matches(
      /^(?!0)(?:[1-9]\d{0,6}|1000000)$/,
      "Vui lòng nhập giá trị hợp lệ "
    ),

  length: yup
    .string()
    .required("Vui lòng nhập chiều dài sản phẩm")
    .matches(
      /^(?!0)(?:[1-9]\d{0,6}|1000000)$/,
      "Vui lòng nhập giá trị hợp lệ "
    ),
  width: yup
    .string()
    .required("Vui lòng nhập chiều rộng sản phẩm")
    .matches(/^(?!0)(?:[1-9]\d{0,6}|1000000)$/, "Vui lòng nhập giá trị hợp lệ"),
  height: yup
    .string()
    .required("Vui lòng nhập chiều cao sản phẩm")
    .matches(
      /^(?!0)(?:[1-9]\d{0,6}|1000000)$/,
      "Vui lòng nhập giá trị hợp lệ "
    ),
});

type VariantType = "single" | "mutiple";
const AddProductPage = () => {
  //state
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [variantType, setVariantType] = useState<VariantType>("single");
  const [originPrice, setOriginPrice] = useState<PromotionType>(
    PromotionType.INACTIVE
  );
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productVideo, setProductVideo] = useState<File[]>([]);
  const [optionImages, setOptionImages] = useState<Record<string, File>>({});
  const [addPrice, setAddPrice] = useState(false);
  const [validate, setValidate] = useState(validationSchema);
  const [isSeperateSize, setIsSeperateSize] = useState<boolean>(false);

  //tity editor
  const editorRef = useRef<any>();

  // category
  const [{ data: categoryTree }] = useFetchCategories();

  // format data for cascader
  const categoryOptions = useFormatCascaderValue({
    data: categoryTree,
  });

  // hook add product
  const { loading, handleConvertDataAndPushProduct } = useAddOrUpdateProduct({
    categoryIds,
    categoryId,
    editorRef,
    optionImages,
    productImages,
    productVideo,
    isSeperateSize,
    originPrice,
  });

  const handleAddPrice = () => {
    setAddPrice(!addPrice);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    unregister,
    getValues,
    setValue,
  } = useForm<any>({
    resolver: yupResolver(validate),
    defaultValues: validationSchema.getDefault(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  const handleChangeVariantType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariantType((event.target as HTMLInputElement).value as VariantType);
  };

  const handleChangeOriginalPrice = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOriginPrice((event.target as HTMLInputElement).value as PromotionType);
  };

  useValidateAddOrUpdateProductForm({
    setValidate,
    unregister,
    validate,
    validationSchema,
    variantType,
    watch,
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleConvertDataAndPushProduct)}>
        <SPaper>
          <Typography variant="h5">Thông tin cơ bản</Typography>

          <Box
            sx={{
              mt: 10,
              maxWidth: 1000,
              mx: "auto",
            }}
          >
            <Grid container spacing={5}>
              <Grid
                sx={{
                  display: "flex",
                  columnGap: "20px",
                  alignItems: "center",
                }}
                item
                xs={12}
              >
                <Grid>
                  <MutipleUploadImage
                    label="Ảnh sản phẩm"
                    files={productImages}
                    setFiles={setProductImages}
                    required
                    // previewImages={}
                  />
                </Grid>
                <Grid
                  sx={{
                    opacity: 0.7,
                    fontSize: "13px",
                  }}
                >
                  <li>Kích thước file tối đa : 2.0 MB</li>
                  <li>Định dạng ảnh chấp nhận : JPG , JPEG , PNG</li>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  columnGap: "20px",
                }}
                item
                xs={11}
              >
                <Grid>
                  <MutipleUploadImage
                    label="Video sản phẩm"
                    files={productVideo}
                    setFiles={setProductVideo}
                    size={1}
                    isVideoInput={true}
                    // previewImages={}
                  />
                </Grid>
                <Grid
                  sx={{
                    opacity: 0.7,
                    fontSize: "13px",
                  }}
                >
                  <li>
                    Kích thước : Tối đa 5MB , độ phân giải không vượt quá 1280 x
                    1280px
                  </li>
                  <li>Độ dài: 10s - 60s</li>
                  <li>Định dạng: MP4 </li>
                  <li
                    style={{
                      listStyle: "none",
                      color: "red",
                    }}
                  >
                    Lưu ý : Sản phẩm có thể hiển thị trong khi video đang được
                    xử lý . Video sẽ tự động hiển thị sau khi đã sử lý thành
                    công
                  </li>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <ControlTextField
                  control={control}
                  name="productName"
                  fullWidth
                  label="Tên sản phẩm"
                  required
                  sx={{}}
                />
              </Grid>

              <Grid item xs={12}>
                <SCascarder
                  required
                  options={categoryOptions}
                  label="Ngành hàng"
                  onSelect={(_, selectedPaths) => {
                    const ids = selectedPaths.map((item) => item.value);
                    setCategoryIds((ids as number[]) ?? []);
                  }}
                  placeholder="Chọn ngành hàng"
                  onChange={(value) => {
                    setCategoryId(value);
                  }}
                  value={categoryId}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <ControlTextField
                  control={control}
                  name="description"
                  fullWidth
                  multiline
                  minRows={3}
                  label="Mô tả sản phẩm"
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                  }}
                /> */}

                <Box
                  sx={{
                    display: "flex",
                    columnGap: "20px",
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      width: "200px",
                      textAlign: "right",
                    }}
                  >
                    Mô tả sản phẩm
                    <Box
                      component="span"
                      style={{ color: "red", opacity: "0.7" }}
                    >
                      *
                    </Box>
                  </Box>
                  {/* <TipTap getContent={(html: any) => setProductDescription(html)} />
                   */}
                  <Tiny ref={editorRef} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: "220px",
                    }}
                  ></Box>

                  <RadioGroup
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    sx={{
                      flex: 1,
                    }}
                    value={originPrice}
                    onChange={handleChangeOriginalPrice}
                  >
                    <FormControlLabel
                      value={PromotionType.ORIGIN_PRICE}
                      control={<Radio />}
                      label="Sản thuộc chương trình giá gốc"
                    />
                    <FormControlLabel
                      value={PromotionType.SUCOSUN_MALL}
                      control={<Radio />}
                      label="Sản thuộc chương trình Exabyte Mall"
                    />
                    <FormControlLabel
                      value={PromotionType.INACTIVE}
                      control={<Radio />}
                      label="Sản phẩm thường"
                    />
                  </RadioGroup>
                </Box>
                <Box
                  sx={{
                    ml: "220px",
                    mt: 1,
                    color: "red",
                    opacity: "0.8",
                    fontSize: "13px",
                  }}
                >
                  Lưu ý: Khi đã tham gia trương trình, không thể đổi chương
                  trình được
                </Box>
              </Grid>

              {originPrice === "ACTIVE" && (
                <Grid item xs={12}>
                  <ControlTextField
                    // required
                    control={control}
                    name="promotionalPercent"
                    fullWidth
                    label="Giảm giá(%)"
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      columnGap: "20px",
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      sx={{
                        width: "200px",
                        textAlign: "right",
                        height: "fit-content",
                        minHeight: "30px",
                        minWidth: "max-content",
                      }}
                    />
                    <Box
                      sx={{
                        fontSize: "12px",
                        flex: 1,
                        mt: 2,
                        color: "red",
                        opacity: 0.8,
                      }}
                    >
                      Lưu ý: Phần trăm giảm giá chỉ có tác dụng đối với những
                      khách hàng đăng ký gói khuyến mãi, với những khách hàng
                      không đăng ký thì hệ thống sẽ mặc định phần trăm khuyến
                      mãi là 0%
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </SPaper>
        <SPaper sx={{ mt: 5 }}>
          <Typography variant="h5">Thông tin bán hàng</Typography>
          {/* <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "red",
              opacity: "0.7",
            }}
          >
            Lưu ý : Giá sản phẩm sẽ là giá đến tay người tiêu dùng
          </div> */}

          <Box
            sx={{
              mt: 10,
              maxWidth: 1000,
              mx: "auto",
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: "220px",
                    }}
                  ></Box>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    sx={{
                      flex: 1,
                    }}
                    value={variantType}
                    onChange={handleChangeVariantType}
                  >
                    <FormControlLabel
                      value="single"
                      control={<Radio />}
                      label="Một phân loại hàng"
                    />
                    <FormControlLabel
                      value="mutiple"
                      control={<Radio />}
                      label="Nhiều loại hàng"
                    />
                  </RadioGroup>
                </Box>
              </Grid>
              {variantType === "mutiple" && (
                <Grid item xs={12}>
                  <ClassifyInput
                    label="Phân loại hàng"
                    control={control}
                    watch={watch}
                    name="classify"
                    desc="classifyDesc"
                    unregister={unregister}
                    optionImages={optionImages}
                    setOptionImages={setOptionImages}
                    isSeperateSize={isSeperateSize}
                    handleChangeSeperateSize={setIsSeperateSize}
                  />
                </Grid>
              )}
              {variantType === "single" && (
                <Fragment>
                  <SingleSalesInfomation control={control} />
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            display: "flex",
                            columnGap: "20px",
                            marginTop: "10px",
                          }}
                        >
                          {/* <Box
                            sx={{
                              mb: 2,
                              width: "200px",
                              textAlign: "right",
                            }}
                          >
                            Mua nhiều giảm giá
                          </Box>
                          <Button
                            style={{
                              border: "1px dashed #ccc",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                            variant="outlined"
                            onClick={handleAddPrice}
                            //disable ẩn / thêm khoảng giá
                            disabled={watchPrice && watchStock ? false : true}
                          >
                            {addPrice ? (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <UserIcon icon="mdi:plus" />
                                Ẩn khoảng giá
                              </Box>
                            ) : (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <UserIcon icon="mdi:plus" />
                                Thêm khoảng giá
                              </Box>
                            )}
                          </Button> */}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  {addPrice && (
                    <Grid>
                      <TableContainer>
                        <Table
                          sx={{ minWidth: 650, marginTop: "15px" }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Khoảng giá</TableCell>
                              <TableCell align="center">
                                Từ (số lượng)
                              </TableCell>
                              <TableCell align="center">
                                Đến (số lượng)
                              </TableCell>
                              <TableCell align="center">Đơn giá</TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Thao tác
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          {fields.map((item, index) => {
                            return (
                              <TableBody key={item.id}>
                                <TableRow
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    Khoảng giá {index + 1}
                                  </TableCell>

                                  <TableCell align="center">
                                    <ControlTextField
                                      fullWidth
                                      name={`since.${index}`}
                                      control={control}
                                      hasLabel={false}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <ControlTextField
                                      fullWidth
                                      name={`arrive.${index}`}
                                      control={control}
                                      hasLabel={false}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <Grid
                                      style={{
                                        position: "relative",
                                      }}
                                    >
                                      <ControlTextField
                                        fullWidth
                                        name={`price.${index}`}
                                        control={control}
                                        hasLabel={false}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="start">
                                              | đ
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Grid onClick={() => remove(index)}>
                                      <UserIcon icon="ic:baseline-delete" />
                                    </Grid>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            );
                          })}
                          <Button
                            style={{
                              marginTop: "10px",
                              border: "1px dashed #ccc",
                              whiteSpace: "nowrap",
                            }}
                            variant="outlined"
                            onClick={() => {
                              append({});
                            }}
                          >
                            <UserIcon icon="mdi:plus" />
                            Thêm khoảng giá
                          </Button>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )}
                </Fragment>
              )}
            </Grid>
          </Box>
        </SPaper>
        {/* bottom */}
        <SPaper sx={{ mt: 5 }}>
          <Typography variant="h5">Vận chuyển</Typography>
          <Box
            sx={{
              maxWidth: 1000,
              mx: "auto",
            }}
          >
            <Grid
              spacing={5}
              sx={{
                mt: 8,
              }}
              container
            >
              <Grid item xs={6}>
                {!isSeperateSize && (
                  <ControlTextField
                    control={control}
                    name="weight"
                    fullWidth
                    label="Cân nặng (sau khi đóng gói)"
                    placeholder="Cân nặng"
                    type="number"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">| gram</InputAdornment>
                      ),
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={6}></Grid>

              <Grid item xs={6} style={{ paddingLeft: "44px" }}>
                <ControlTextField
                  control={control}
                  name="length"
                  fullWidth
                  label="Kích thước đóng gói"
                  placeholder="Dài"
                  type="number"
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">| cm</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <ControlTextField
                  control={control}
                  name="width"
                  fullWidth
                  placeholder="Rộng"
                  hasLabel={false}
                  type="number"
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">| cm</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <ControlTextField
                  control={control}
                  name="height"
                  fullWidth
                  placeholder="Cao"
                  hasLabel={false}
                  type="number"
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">| cm</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {!IS_AFFILIATE && <ShippingFeeNote />}
        </SPaper>

        <Box
          sx={{
            marginLeft: "auto",
            width: "fit-content",
            mt: 5,
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            disabled={loading}
          >
            {loading ? "Đang tải" : "Thêm sản phẩm"}
          </LoadingButton>
        </Box>
      </form>
    </Fragment>
  );
};

export default AddProductPage;
