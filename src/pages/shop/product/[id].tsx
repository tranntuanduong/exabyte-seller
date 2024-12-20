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
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useToaster } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { stringArrToSlug } from "src/utils/string";
import { isEmpty, maxBy, minBy } from "lodash";
import useRandom from "src/hooks/useRandom";
import useAddOrUpdateProduct from "src/hooks/api/shop/useAddOrUpdateProduct";
import SPaper from "src/components/form/SPaper";
import MutipleUploadImage, {
  PreViewVideo,
  PreviewImgs,
} from "src/components/form/MutipleUploadImage";
import ControlTextField from "src/components/form/ControlTextField";
import SCascarder from "src/components/form/cascader";
import { mockCategories } from "src/mockCategory";
import ClassifyInput from "src/components/form/classify-input";
import { shuffleArray } from "src/utils/array";
import FormControlLabel from "@mui/material/FormControlLabel";
import SingleSalesInfomation from "src/views/pages/shop/product/SingleSalesInfomation";
import useFetchCategories from "src/hooks/api/category/useFetchCategories";
import useFormatCascaderValue from "src/hooks/useFormatCascaderValue";
import { Controller } from "react-hook-form";
import Register from "src/pages/register";
import UserIcon from "src/layouts/components/UserIcon";
import useUploadImage from "src/hooks/api/upload/useUploadImage";
import TipTap from "src/components/Tiptap";
import useFetchProductDetail from "src/hooks/api/shop/useFetchProductDetail";
import { useRouter } from "next/router";
import Tiny from "src/components/Tiny";
import useInitProductFormData from "src/hooks/product/useInitProductFormData";
import useValidateAddOrUpdateProductForm from "src/hooks/api/shop/useValidateAddOrUpdateProductForm";
import { LoadingButton } from "@mui/lab";

// import ReactPlayer from "react-player/lazy";
import { IMAGE_BASE_URL } from "src/constants/aws";
import ShippingFeeNote from "src/views/pages/product/ShippingFeeNote";
import { IS_AFFILIATE } from "src/constants/env";

import { PromotionType } from "src/constants";

const defaultValues = {
  shopName: "",
  description: "",
  classifyDesc: "",
  classify: [],
  classifyDesc2: "",
  classify2: [],
};

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
    .matches(
      /^(?!0)(?:[1-9]\d{0,6}|1000000)$/,
      "Vui lòng nhập giá trị hợp lệ "
    ),
  height: yup
    .string()
    .required("Vui lòng nhập chiều cao sản phẩm")
    .matches(
      /^(?!0)(?:[1-9]\d{0,6}|1000000)$/,
      "Vui lòng nhập giá trị hợp lệ "
    ),
});

interface FormInputs {
  name: string;
  description: string;
  productName: string;
}

type VariantType = "single" | "mutiple";

const AddProductPage = () => {
  const { query } = useRouter();
  // const { shopInfo } = useTypedSelector((store) => store.shopInfo);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [variantType, setVariantType] = useState<VariantType>("single");
  const [originPrice, setOriginPrice] = useState<PromotionType>(
    PromotionType.INACTIVE
  );
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productVideo, setProductVideo] = useState<File[]>([]);
  const [optionImages, setOptionImages] = useState<Record<string, File>>({});
  const [viewCategory, setViewCategory] = useState<string>("");
  const [validate, setValidate] = useState(validationSchema);
  const [previewVideo, setPreviewVideo] = useState<any>([]);
  const [isSeperateSize, setIsSeperateSize] = useState<boolean>(false);

  const editorRef = useRef<any>();
  const [{ data: categoryTree }] = useFetchCategories();

  const [previewProductImgs, setPreviewProductImgs] = useState<PreviewImgs[]>(
    []
  );

  const categoryOptions = useFormatCascaderValue({
    data: categoryTree,
  });

  const [{ data, loading }, handleFetchProductDetails] =
    useFetchProductDetail();

  const { handleConvertDataAndPushProduct, loading: updateLoading } =
    useAddOrUpdateProduct({
      categoryIds,
      categoryId,
      editorRef,
      optionImages,
      productImages: productImages,
      oldProductImages: previewProductImgs,
      product: data,
      productVideo,
      isUpdateVideo: data && previewVideo.length === 0,
      isSeperateSize,
      originPrice,
    });
  const [addPrice, setAddPrice] = useState(false);
  const handleAddPrice = () => {
    setAddPrice(!addPrice);
  };

  console.log("dataxxxx", data?.video, previewVideo.length === 0);

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState,
    reset,
    watch,
    unregister,
    setValue,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  //call api get product detail
  useEffect(() => {
    if (!query.id) return;
    handleFetchProductDetails(query.id as string);
  }, [query]);

  // init form data
  useInitProductFormData({
    reset,
    setCategoryId,
    setCategoryIds,
    setOptionImages,
    setValue,
    setVariantType,
    data,
  });

  const submit = async (data: any) => {
    console.log("dataxxxx", data);
    try {
    } catch (error) {}
  };

  //submit them khoang gia //
  const onSubmit = () => console.log("data");

  const handleChangeVariantType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariantType((event.target as HTMLInputElement).value as VariantType);
  };

  const handleChangeOriginPrice = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOriginPrice((event.target as HTMLInputElement).value as PromotionType);
  };

  useEffect(() => {
    setPreviewProductImgs(data?.images ?? []);

    const optionWeight = data?.options?.[0]?.weight;
    console.log("optionWeight", optionWeight);

    if (optionWeight) {
      setIsSeperateSize(true);
    }
    setOriginPrice(data?.originPrice);
  }, [data]);

  const watchPrice = watch("price");
  const watchStock = watch("stock");

  useValidateAddOrUpdateProductForm({
    setValidate,
    unregister,
    validate,
    validationSchema,
    variantType,
    watch,
  });

  useEffect(() => {
    if (!data?.video) return;
    setPreviewVideo([
      {
        url: data?.video,
        isVideo: true,
      },
    ]);
  }, [data]);

  //video

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
              <Grid item xs={12}>
                <MutipleUploadImage
                  label="Ảnh sản phẩm"
                  required
                  files={productImages}
                  setFiles={setProductImages}
                  previewImgs={previewProductImgs}
                  setPreviewImgs={setPreviewProductImgs}
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  columnGap: "20px",
                }}
                item
                xs={12}
              >
                <Grid className="player-wrapper">
                  {/* <ReactPlayer
                    controls={true}
                    className="react-player"
                    url={`${IMAGE_BASE_URL}/${data?.video}`}
                    url={`${IMAGE_BASE_URL}/${"f5902854-6577-4eef-af4d-50e5b48b9c54"}`}
                    width="90px"
                    height="90px"
                  /> */}

                  <MutipleUploadImage
                    label="Video sản phẩm"
                    files={productVideo}
                    setFiles={(files) => {
                      setProductVideo(files);
                      setPreviewVideo([]);
                    }}
                    size={1}
                    isVideoInput={true}
                    previewImgs={previewVideo}
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
                  <li>Độ dài : 10s - 60s</li>
                  <li>Định dạng: MP4</li>
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
                  required
                  control={control}
                  name="productName"
                  fullWidth
                  label="Tên sản phẩm"
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                  }}
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
                  onChange={(value) => {
                    setCategoryId(value);
                  }}
                  value={categoryId}
                />
              </Grid>

              <Grid item xs={12}>
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
                      sx={{
                        opacity: "0.7",
                        color: "red",
                      }}
                    >
                      *
                    </Box>
                  </Box>
                  <Tiny
                    ref={editorRef}
                    initialValue={data?.description ?? ""}
                  />
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
                    onChange={handleChangeOriginPrice}
                  >
                    <FormControlLabel
                      value={PromotionType.ORIGIN_PRICE}
                      control={<Radio />}
                      label="Sản thuộc chương trình giá gốc"
                      disabled={true}
                    />
                    <FormControlLabel
                      value={PromotionType.SUCOSUN_MALL}
                      control={<Radio />}
                      label="Sản thuộc chương trình Exabyte Mall"
                      disabled={true}
                    />
                    <FormControlLabel
                      value={PromotionType.INACTIVE}
                      control={<Radio />}
                      label="Sản phẩm thường"
                      disabled={true}
                    />
                  </RadioGroup>
                </Box>
              </Grid>

              {originPrice === PromotionType.ORIGIN_PRICE && (
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
                      label="Bán sỉ/lẻ 1 loại hàng"
                      disabled={true}
                    />
                    <FormControlLabel
                      value="mutiple"
                      control={<Radio />}
                      label="Bán sỉ/lẻ nhiều loại hàng"
                      disabled={true}
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
                    initUseClassify2={data.tierVariants.length > 1}
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
                          <Box></Box>
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
                            }}
                            variant="outlined"
                            onClick={handleAddPrice}
                          >
                            {addPrice ? (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
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
                                  whiteSpace: "nowrap",
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
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <TableContainer>
                          <Table
                            sx={{ minWidth: 650, marginTop: "15px" }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Khoảng giá</TableCell>

                                <TableCell align="right">
                                  Từ (số lượng)
                                </TableCell>
                                <TableCell align="right">
                                  Đến (số lượng)
                                </TableCell>
                                <TableCell align="right">Đơn giá</TableCell>
                                <TableCell
                                  align="right"
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

                                    <TableCell align="right">
                                      <ControlTextField
                                        type="number"
                                        fullWidth
                                        name={`since.${index}`}
                                        control={control}
                                        hasLabel={false}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <ControlTextField
                                        type="number"
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
                                          type="number"
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
                                append({
                                  //dulieu//
                                });
                              }}
                            >
                              <UserIcon icon="mdi:plus" />
                              Thêm khoảng giá
                            </Button>
                          </Table>
                        </TableContainer>
                      </form>
                    </Grid>
                  )}
                </Fragment>
              )}
            </Grid>
          </Box>
        </SPaper>
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
                    required
                    name="weight"
                    fullWidth
                    type="number"
                    label="Cân nặng (sau khi đóng gói)"
                    placeholder="Cân nặng"
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
                  type="number"
                  label="Kích thước đóng gói"
                  placeholder="Dài"
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
                  type="number"
                  placeholder="Rộng"
                  hasLabel={false}
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
                  type="number"
                  placeholder="Cao"
                  hasLabel={false}
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
            disabled={updateLoading}
            loading={updateLoading}
          >
            Cập nhật
          </LoadingButton>
        </Box>
      </form>
    </Fragment>
  );
};

export default AddProductPage;
