import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import useFetchProfile from "src/hooks/api/useFetchProfile";
import useUpdateProfile from "src/hooks/api/shop/useUpdateProfile";
import * as yup from "yup";
import { useAuth } from "src/hooks/useAuth";
import SingleUploadImageField from "src/components/form/SingleUploadImageField";
import FileDropZone from "src/components/DropZone/FileDropZone";
// import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { IMAGE_BASE_URL } from "src/constants/aws";
import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { DEFAULT_USER_IMAGE } from "src/constants/image";
import MutipleUploadImage, {
  PreviewImgs,
} from "src/components/form/MutipleUploadImage";

import { toast } from "react-hot-toast";
import useFetchShopBusiness from "src/hooks/api/shop/useFetchShopBusiness";
import useAddBusinessImagesShop from "src/hooks/api/shop/useAddBussinessImagesShop";
import { UpdateBusiness } from "src/types/shop.type";
import { getImageCheck } from "src/utils/image";

const schemaValidate = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .default("testemail@gmail.com"),
  phone: yup
    .string()
    .min(10, "Vui lòng nhập đúng số điên thoại")
    .required()
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Vui lòng nhập đúng số điện thoại"
    )
    .default(""),
  name: yup
    .string()
    .required("Vui lòng nhập tên shop")
    .max(30, "Tên shop không dài quá 30 ký tự")
    .default(""),
  description: yup.string().required("Vui lòng nhập mô tả shop").default(""),
});

export interface UpdateProfileForm {
  email: string;
  name: string;
  phone: string;
  link: string;
  description: string;
  avatar: string;
}

const ProfileTab = () => {
  const [{ data: fetchBusiness }, getShopBusiness] = useFetchShopBusiness();
  const [{ data: bussiness, loading: addBusinessLoading }, handleAddBusiness] =
    useAddBusinessImagesShop();
  console.log("bussinessbussiness", bussiness);
  const [profileImages, setProfileImages] = useState<File[]>([]);
  console.log("setProfileImages", setProfileImages);
  const [previewProductImgs, setPreviewProductImgs] = useState<PreviewImgs[]>(
    []
  );

  const { user, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  console.log("setFilesetFile", setFile);
  const [phone, setPhone] = useState("");
  console.log("phonephone", phone);
  const handlePhoneChange = (event: any) => {
    let formattedPhone = event.target.value.replace(/\D/g, "");
    if (formattedPhone.length > 10) {
      formattedPhone = formattedPhone.slice(0, 10);
    }
    // setPhone(formattedPhone);
    setValue("phone", formattedPhone);
  };
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileForm>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const [{ data, loading }, getShopProfile] = useFetchProfile();
  const { handleUploadImage, loading: uploadImgLoading } = useUploadImage({
    multiple: false,
  });

  const {
    handleUploadImage: handleUpdataArrayImage,
    loading: uploadArrayImgLoading,
  } = useUploadImage({
    multiple: true,
  });
  const [{ data: updateRes, loading: updateLoading }, handleUpdateProfile] =
    useUpdateProfile();
  console.log("hhh", updateLoading, updateRes);

  // goi api lay thing tin shop lan dau tien
  useEffect(() => {
    getShopProfile("");
  }, [updateLoading]);

  useEffect(() => {
    const bussinessPaper =
      user.businessPapers?.map((item: any) => ({
        id: item.id,
        url: item.image,
        name: item.name,
      })) ?? [];
    setPreviewProductImgs(bussinessPaper);
  }, [bussiness, user]);
  // lay duoc data thi reset form
  useEffect(() => {
    data &&
      reset({
        name: data?.name,
        email: data?.email,
        description: data?.description,
        phone: data?.phone,
      });
  }, [data]);

  // if (data.name) return toast.error('tên shop đã tồn tại')
  const onSubmit = async (data: UpdateProfileForm) => {
    let avatar = user?.avatar;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await handleUploadImage(formData);
      avatar = res?.data?.data?.key;
    }

    let businissImage: UpdateBusiness[] = [];
    if (profileImages.length > 0) {
      const formData = new FormData();
      profileImages.forEach((file, index) => {
        formData.append("images", file, `file-${index}`);
      });
      const res = await handleUpdataArrayImage(formData);
      console.debug("resresres", res);
      if (!res) {
        console.log("không có dữ liệu");
        // toast.error("Some thing went wrong!");
        return;
      }

      res.data.data.forEach((item: any) => {
        businissImage.push(item.key);
      });
      console.debug(res);
    }
    console.debug("businissImage", businissImage);
    const businissDataPromise = businissImage?.map((item, idx) => ({
      image: item.toString(),
      name: idx.toString(),
    }));

    console.debug({ data: profileImages, businissDataPromise });
    console.log("businissDataPromise", businissDataPromise);
    console.log("previewProductImgs", [
      ...previewProductImgs,
      ...businissDataPromise,
    ]);
    // console.debug('data', { ...data, avatar, link: user.link })
    // @ts-ignore
    await handleAddBusiness({
      data: [...previewProductImgs, ...businissDataPromise],
    });

    await handleUpdateProfile({
      ...data,
      avatar: avatar,
      link: user.link,
    });
  };

  // useEffect(() => {
  //   setValue("phone", phone);
  // }, [phone]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <SingleUploadImageField
            size="100px"
            file={file}
            setFile={setFile}
            direction="column"
            demoImg={
              data?.avatar ? getImageCheck(data?.avatar) : DEFAULT_USER_IMAGE
            }
          />
        </Grid>
        <Grid item xs={12}>
          <MutipleUploadImage
            label="Giấy tờ đăng ký kinh doanh"
            files={profileImages}
            setFiles={setProfileImages}
            previewImgs={previewProductImgs}
            setPreviewImgs={setPreviewProductImgs}
            className={{
              display: "flex",
              flexDirection: "column",
              "& .MuiBox-root#label": {
                textAlign: "start",
                whiteSpace: "nowrap",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="name"
            fullWidth
            label="Tên shop"
            ditaction="column"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="email"
            fullWidth
            label="Email"
            ditaction="column"
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            onChange={handlePhoneChange}
            control={control}
            name="phone"
            fullWidth
            label="Số điện thoại"
            ditaction="column"
            type="text"
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="description"
            fullWidth
            label="Mô tả shop"
            ditaction="column"
            multiline
            minRows={3}
          />
        </Grid>

        <Grid item xs={12} justifyItems="flex-end">
          <LoadingButton
            variant="contained"
            type="submit"
            loading={
              loading ||
              updateLoading ||
              uploadImgLoading ||
              uploadArrayImgLoading ||
              addBusinessLoading
            }
            disabled={
              loading ||
              updateLoading ||
              uploadImgLoading ||
              uploadArrayImgLoading ||
              addBusinessLoading
            }
          >
            LƯU
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProfileTab;
