import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Tiny from "src/components/Tiny";
import ControlTextField from "src/components/form/ControlTextField";
import MutipleUploadImage, {
  PreviewImgs,
} from "src/components/form/MutipleUploadImage";
import SPaper from "src/components/form/SPaper";
import useAddOrUpdateNew from "src/hooks/api/new/useAddOrUpdateNew";
import useFetchNewDetail from "src/hooks/api/new/useFetchNewDetail";
import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { stringArrToSlug } from "src/utils/string";
import * as yup from "yup";

interface FormData {
  title: string;
}

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Vui lòng nhập tiêu đề")
    .min(10, "Tối thiểu là 10 ký tự")
    .max(255, "Tối đa là 255 ký tự"),
});

const EditNewPage = () => {
  const [imgs, setImgs] = useState<File[]>([]);

  const editorRef = useRef<any>();

  const { handleUploadImage, loading: uploadImgLoading } = useUploadImage({
    multiple: true,
  });

  const [previewImgs, setPreviewImgs] = useState<PreviewImgs[]>([]);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const { data } = useFetchNewDetail();

  const { handler: handleUpdateNew, loading } = useAddOrUpdateNew({
    isUpdate: true,
  });

  useEffect(() => {
    if (!data) return;

    reset({
      title: data.title,
    });

    console.log("images", data.images);

    setPreviewImgs(
      data?.images?.map((img: string, index: number) => ({
        url: img,
        key: index,
      })) ?? []
    );
  }, [data]);

  const onSubmit = async (submitData: FormData) => {
    const content = editorRef?.current?.getContent() ?? "";

    if (!content && Object.values(imgs).length === 0) {
      toast.error("Bài đăng phải có ảnh hoặc nội dung");
    }

    //upload option images
    const _imgs: Record<string, string> = {};
    if (Object.values(imgs).length > 0) {
      const formData = new FormData();
      Object.values(imgs).forEach((file) => {
        formData.append("images", file);
      });

      const res = await handleUploadImage(formData);

      if (!res) {
        toast.error("Some thing went wrong!");
        return;
      }

      if (res?.data?.data?.length > 0) {
        Object.keys(imgs).forEach((key, index) => {
          _imgs[key] = res?.data?.data[index]?.key;
        });
      }
    }
    

    const updateImgs: any = [...data.images, ...Object.values(_imgs)];

    handleUpdateNew({
      id: data?.id,
      title: submitData.title,
      slug: stringArrToSlug([submitData.title]),
      content: content,
      images: updateImgs,
    });
  };

  return (
    <SPaper>
      <Typography variant="h5">Cập nhật bài đăng</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            mt: 10,
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="title"
                fullWidth
                label="Tiêu đề"
                required
                sx={{}}
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
                  Nội dung
                </Box>
                <Tiny
                  ref={editorRef}
                  toolbar="undo redo | bold italic backcolor | link | bullist numlist checklist outdent indent "
                  initialValue={data?.content}
                />
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                columnGap: "20px",
                alignItems: "center",
              }}
              item
              xs={12}
            >
              <MutipleUploadImage
                label="Ảnh"
                files={imgs}
                setFiles={setImgs}
                previewImgs={previewImgs}
                setPreviewImgs={setPreviewImgs}
                size={4}
              />
            </Grid>
          </Grid>
        </Box>
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
            disabled={loading || uploadImgLoading}
          >
            {loading ? "Đang tải" : "Cập nhật"}
          </LoadingButton>
        </Box>
      </form>
    </SPaper>
  );
};

export default EditNewPage;
