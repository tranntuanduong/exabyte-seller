import styled from "@emotion/styled";

// Import Swiper React components
import Autocomplete from "@mui/material/Autocomplete";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useFetchShopCategory from "src/hooks/api/shop/useFetchShopCategory";
import useAddTheme, { AddThemeProps } from "src/hooks/api/theme/useAddTheme";
import useFetchListTheme, {
  LayOutProps,
} from "src/hooks/api/theme/useFetchListTheme";
import useFetchThemeByShopId from "src/hooks/api/theme/useGetDataTheme";
import { useAuth } from "src/hooks/useAuth";
import "swiper/css";
import "swiper/css/pagination";
import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { IMAGE_BASE_URL } from "src/constants/aws";
import toast from "react-hot-toast";
import useUpdateShopBanner, {
  newShopBannerIdProps,
} from "src/hooks/api/theme/useUpdateTheme";
import { LoadingButton } from "@mui/lab";
import { getImageCheck } from "src/utils/image";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface UpdateShopBanner {
  shopBannerId: number;
}
interface ImagePreviewProps {
  id: string;
  image: string;
}
const ThemePage = () => {
  const { user } = useAuth();
  console.log(user, "userxxx");
  const [saveImageBanner, setSaveImageBanner] = useState();

  const { data: listTheme, loading } = useFetchListTheme();
  console.log("listTheme", listTheme);

  const [selectedTheme, setSelectedTheme] = useState<LayOutProps | null>(null);
  console.log(selectedTheme, "selectedThemexxx");
  const [saveCategoryIds, setSaveCategoryIds] = useState<number[]>([]);
  const [bannerId, setBannerId] = useState<string | null>(null);
  console.log(bannerId, "banneriddd");
  const [openUploadImgDialog, setOpenUploadImgDialog] =
    useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [listBanner, setListBanner] = useState<
  //   Record<string, ImagePreviewProps>
  // >({});

  const [productImages, setProductImages] = useState<Record<string, File>>({});

  const {
    handleUploadImage,
    data,
    loading: uploadImageLoading,
  } = useUploadImage({
    multiple: true,
  });

  const [swiper, setSwiper] = useState<any>();

  const router = useRouter();
  //api create new theme
  const [{ data: addThemeRes, loading: addThemeLoading }, addTheme] =
    useAddTheme(() => {
      getThemeByShopId(user?.id);
    });

  const [{ loading: updateThemeLoading }, updateTheme] = useUpdateShopBanner(
    () => {}
  );

  // get list category
  const [
    { data: listThemeCategory, loading: loadingThemeCategory },
    fetchShopCategory,
  ] = useFetchShopCategory();

  console.log(listThemeCategory, "listThemeCategoryxxx");

  // current theme
  const [{ data: currentTheme }, getThemeByShopId] = useFetchThemeByShopId();
  console.log(user.id, "asjklfhjkdsbfjkds");
  useEffect(() => {
    if (!user.id) return;
    getThemeByShopId(user?.id);
  }, [user, router.isReady]);

  // init state
  useEffect(() => {
    if (!currentTheme) return;

    // find theme was selected before
    const findTheme = listTheme.find(
      (theme) => theme.id === currentTheme.theme?.id
    );

    if (!findTheme) return;

    setSelectedTheme(findTheme);

    // init categoryIds
    const categoryIds = currentTheme.categories.map((category) => category.id);
    setSaveCategoryIds(categoryIds);

    console.log("currentTheme", currentTheme);
    // convert array to record value
    const listBanner = currentTheme.shopBanner.reduce(
      (acc: Record<string, ImagePreviewProps>, banner, index) => {
        acc[`${index}`] = {
          id: `${index}`,
          image: banner.image,
        };

        return acc;
      },
      {}
    );

    // setProductImages(productImages);
  }, [currentTheme]);

  useEffect(() => {
    fetchShopCategory();
  }, []);

  const handleAddTheme = async () => {
    if (!selectedTheme) return;

    // tao form data de upload image
    const formData = new FormData();
    console.log(productImages, "productImages");

    Object.values(productImages).forEach((file) => {
      //append tung file vao form data voi key la images (ve doc them upload file voi form-data)
      formData.append("images", file);
    });

    const uploadRes = await handleUploadImage(formData);
    console.log(uploadRes, "uploadRes");

    const images = uploadRes?.data?.data?.map((resItem: any) => resItem.key);

    const shopBanners = images?.map((bannerImage: string) => ({
      status: "ACTIVE",
      image: bannerImage,
      url: "chua co",
    }));

    if (shopBanners.length < selectedTheme.numberBanner) {
      toast.error("vui lòng chọn đủ ảnh");
      return;
    }

    const newTheme: AddThemeProps = {
      shopBanners: shopBanners,
      categoryIds: saveCategoryIds,
      themeId: selectedTheme.id,
    };
    console.log(shopBanners, "shopBannersxxxx");

    console.log("newTheme", newTheme);
    // getThemeByShopId(user?.id);

    await addTheme(newTheme);
  };

  const handleUpdateTheme = async () => {
    if (!selectedTheme) return;
    // tao form data de upload image
    const formData = new FormData();

    Object.values(productImages).forEach((file) => {
      //append tung file vao form data voi key la images (ve doc them upload file voi form-data)
      formData.append("images", file);
    });

    const uploadRes = await handleUploadImage(formData);

    const imagesRes = uploadRes?.data?.data?.map((resItem: any) => resItem.key);

    const images = Object.keys(productImages).reduce((acc: any, key, index) => {
      acc[key] = imagesRes[index];

      return acc;
    }, {});

    console.log("images", images);

    const shopBanners = Array.from({
      length: selectedTheme.numberBanner,
    }).reduce((acc: any[], _, index) => {
      if (images[index]) {
        acc.push({
          status: "ACTIVE",
          image: images[index],
          url: "chua co",
        });
      } else {
        acc.push({
          status: "ACTIVE",
          image: currentTheme?.shopBanner?.[index]?.image,
          url: "chua co",
        });
      }

      return acc;
    }, []);

    const newTheme: any = {
      shopBanners: shopBanners,
      categoryIds: saveCategoryIds,
      themeId: selectedTheme.id,
    };

    console.log("newTheme", newTheme);

    await updateTheme(newTheme);
    await getThemeByShopId(user?.id);
  };

  const handleSelectTheme = (theme: LayOutProps) => {
    console.log(theme, "themexxxxx");
    setSelectedTheme(theme);
    setBannerId(null);
    // setProductImages({});
    // setListBanner({});
    console.log(theme?.id, "bgashjdbahjs");
    // if(selectedTheme?.id === theme.id)
  };

  const handlePreviewImg = (e: any) => {
    if (!bannerId) return;

    const file = e.target.files[0]; //ảnh đầu tiên
    const preview = URL.createObjectURL(file); // url tạm
    file.id = preview;
    file.preview = preview;
    setImagePreview(preview); //re render lại imagePreview có preview
    setProductImages((prev) => ({
      ...prev,
      [bannerId]: file,
    }));
  };

  console.log("filessssxxx", productImages);

  const handleAddBannerToList = () => {
    if (!imagePreview || !bannerId) return;

    // setListBanner((prev) => ({
    //   ...prev,
    //   [bannerId]: {
    //     id: bannerId,
    //     image: imagePreview,
    //   },
    // }));

    //sau khi ấn xác nhận để đẩy ảnh dialog đóng
    setOpenUploadImgDialog(false);
    setImagePreview(null);

    // handleUpdateShopBanner();
  };

  const handleCancelUploadBanner = () => {
    setOpenUploadImgDialog(false);
    setImagePreview(null);
  };

  // const initialSlide = useMemo(() => {
  //   console.log("currentTheme?.theme.id", currentTheme?.theme.id);
  //   return currentTheme?.theme.id;
  // }, [currentTheme?.theme.id, router.isReady]);
  const slideTo = (index: number) => {
    if (swiper?.slideTo) {
      swiper.slideTo(index);
    }
  };

  useEffect(() => {
    if (!currentTheme?.theme?.id) return;
    slideTo(currentTheme?.theme.id - 1);
  }, [currentTheme]);

  useEffect(() => {
    setProductImages({});
  }, [selectedTheme]);

  console.log("productImages", productImages);

  const getBannerByOrder = (orderIndex: number) => {
    // return currentTheme?.shopBanner?.[index]?.image
    const banner = currentTheme?.shopBanner?.find(
      (item) => item.order == orderIndex
    );

    if (!banner) return "";

    return banner.image;
  };
  const isCurrentTheme = currentTheme?.theme?.id === selectedTheme?.id;
  return (
    <Card>
      <SaveTheme>
        {currentTheme?.id ? (
          <LoadingButton
            onClick={handleUpdateTheme}
            variant="contained"
            loading={uploadImageLoading || updateThemeLoading}
          >
            Cập Nhật
          </LoadingButton>
        ) : (
          <LoadingButton
            loading={uploadImageLoading || addThemeLoading}
            onClick={handleAddTheme}
            variant="contained"
          >
            Lưu
          </LoadingButton>
        )}
      </SaveTheme>

      <CardHeader sx={{ padding: 10 }} title="Chọn Layout 🚀"></CardHeader>

      {router.isReady && (
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
        >
          {/* {console.log(
            "testxxx",
            currentTheme?.theme?.id ? currentTheme.theme.id - 1 : 0
          )} */}
          {/* {console.log("testselected", selectedTheme)} */}
          {listTheme.map((item, idx) => (
            <SwiperSlide
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <StyledImages>
                <div
                  className="box-image"
                  //kh chọn layout nào thì sẽ có viền đỏ layout đó

                  style={{
                    ...(selectedTheme?.id === item.id && {
                      backgroundColor: "red",
                      height: "fit-content",
                    }),
                  }}
                  onClick={() => handleSelectTheme(item)}
                >
                  <img
                    style={{ width: 200, height: 280 }}
                    src={getImageCheck(item.layoutImg)}
                    // src={`${IMAGE_BASE_URL}/${item.layoutImg}`}
                    // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG4iVezQmtKS7oFq5p5HYwlHkCrChZ-uAZKQ&usqp=CAU"
                    // src={item.layoutImg}
                  />
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    margin: "8px 0",
                  }}
                >
                  Layout {item.id}
                </div>
                <Button variant="contained">Xem Trước</Button>
              </StyledImages>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <CardContent>
        <CardHeader title="Chọn Danh Mục Nổi Bật"></CardHeader>
        <FeaturedCategory>
          <Autocomplete
            multiple
            size="small"
            fullWidth
            sx={{
              mt: 5,
              maxWidth: 600,
              display: "flex",
              justifyContent: "center",
            }}
            options={listThemeCategory} // dữ liệu bên danh mục chuyền vào
            // defaultValue={[...listThemeCategory]}
            value={[
              ...listThemeCategory.filter((_themeCategory) =>
                saveCategoryIds.includes(_themeCategory.id)
              ),
            ]}
            // defaultValue={[listThemeCategory[0]]}
            id="autocomplete-size-small-multi"
            onChange={(e, newValue) => {
              setSaveCategoryIds(newValue.map((item) => item.id)); //onchange lưu vào setSaveCategory
            }}
            getOptionLabel={(option) => option?.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Size small"
                placeholder="Thêm Danh Mục"
              />
            )}
          />

          <div>Được chọn tối đa 3 danh mục nổi bật</div>
        </FeaturedCategory>
      </CardContent>
      <CardContent>
        <CardHeader title="Chỉnh sửa banner 🚀"></CardHeader>
        {/* nếu có selectedTheme thì sẽ in ra các button để thêm banner */}
        {selectedTheme && (
          <AddBanner>
            {/* lặp qua độ dài numberBanner lấy được index */}
            {Array.from({ length: selectedTheme.numberBanner }, (_, index) => {
              return (
                <div>
                  {selectedTheme?.id === selectedTheme.id && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 20,
                      }}
                    >
                      <div>Banner {index + 1}</div>
                      <Button
                        variant="contained"
                        sx={{
                          color: "white",
                          fontWeight: 800,
                        }}
                        onClick={() => {
                          //khi ấn nào button nào có index đó in ra ảnh chỉ ở index đó
                          setBannerId(`${index}`);
                          setOpenUploadImgDialog(true);
                        }}
                      >
                        Thêm banner
                      </Button>
                      {/* in ra đoạn string ảnh */}
                      <div>
                        {/* @ts-ignore */}
                        {productImages?.[`${index}`]?.preview ? (
                          <div>
                            <img
                              // @ts-ignore
                              src={productImages[`${index}`].preview}
                              style={{
                                width: "50px",
                                height: "50px",
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            {currentTheme && isCurrentTheme ? (
                              <div>
                                {selectedTheme.id ===
                                  currentTheme.theme?.id && (
                                  <div>
                                    <img
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                      }}
                                      src={`${IMAGE_BASE_URL}/${getBannerByOrder(
                                        index
                                      )}`}
                                      // src={currentTheme?.shopBanner?.[index]?.image}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              // <div>
                              //   {currentTheme?.shopBanner?.[index]?.image}
                              // </div>
                              <div></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </AddBanner>
        )}

        <Dialog
          onClose={() => setOpenUploadImgDialog(false)}
          open={openUploadImgDialog}
        >
          <EditBanner
          // style={
          //   addTheme === false ? { display: "block" } : { display: "none" }
          // }
          >
            <CardHeader
              sx={{ padding: 0 }}
              title="Tải hình ảnh lên"
            ></CardHeader>
            <Typography sx={{ margin: "6px 0" }}>Hình ảnh:</Typography>
            <Typography sx={{ margin: "6px 0" }}>
              Dung lượng tối đa 2MB;Kích thước:Tối đa 2000 x 2000p
            </Typography>
            <Typography sx={{ margin: "6px 0" }}>
              Định dạng: JPG,JPEG,PNG
            </Typography>
            <Box
              sx={{
                backgroundColor: "#E1DFDF",
                padding: 4,
              }}
            >
              <label htmlFor="dropzone-file" style={{ cursor: "pointer" }}>
                <UploadFile style={{}}>
                  <input
                    onChange={handlePreviewImg}
                    style={{
                      display: "none",
                    }}
                    type="file"
                    name="single-file"
                    accept="image/*"
                    id="dropzone-file"
                    // multiple
                  />
                  {imagePreview && (
                    <img
                      style={{ width: 100, height: 100 }}
                      src={imagePreview}
                      alt=""
                    />
                  )}
                  <Typography sx={{ fontSize: 30 }}>+</Typography>
                  <Typography>Tải ảnh lên </Typography>
                </UploadFile>
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                columnGap: 5,
                marginTop: 10,
              }}
            >
              <Button
                onClick={handleCancelUploadBanner}
                variant="contained"
                sx={{ color: "white" }}
              >
                Huỷ
              </Button>
              <Button
                onClick={handleAddBannerToList}
                variant="contained"
                sx={{ color: "white" }}
              >
                Xác nhận
              </Button>
            </Box>
          </EditBanner>
        </Dialog>
        <StyledImages>
          <img
            style={{ width: 200, height: 280 }}
            src={`${IMAGE_BASE_URL}/${selectedTheme?.themeDemo}`}
          />
        </StyledImages>
      </CardContent>
    </Card>
  );
};

export default ThemePage;
const StyledImages = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  .box-image {
    align-items: center;
    padding: 5px;
    display: flex;
    border-radius: 4px;
  }
`;

const StyledLayout = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 50px;
  align-items: center;
  flex-wrap: wrap;

  .box-image {
    align-items: center;
    padding: 5px;
    display: flex;
    border-radius: 4px;
  }
`;
const StyledTabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const EditBanner = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: fit-content;
  padding: 16px;
`;

const UploadFile = styled.div`
  display: "flex";
  justify-self: center;
  flex-direction: column;
  text-align: center;
  border: 4px dashed #ccc;
  background-color: white;
  padding: 50px 0;
`;

const AddBanner = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  margin-top: 15px;
`;

const FeaturedCategory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;
const SaveTheme = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 20px 0 0;
`;
