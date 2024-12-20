import { UPLOAD_IMAGE, MULTIPLE_UPLOAD_IMAGE } from "src/constants/api/upload";
import useHttpClient from "../useHttpClient";
interface Props {
  multiple: boolean;
}

const useUploadImage = ({ multiple = false }: Props) => {
  const [{ data, loading }, uploadImage] = useHttpClient<any>(
    {
      ...(multiple ? MULTIPLE_UPLOAD_IMAGE : UPLOAD_IMAGE),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    {
      manual: true,
      // dataPath: ,
    }
  );

  const handleUploadImage = async (data: any) => {
    try {
      return await uploadImage({
        data: data,
      });
    } catch (error) {}
  };

  return {
    data: data ?? [],
    loading,
    handleUploadImage,
  };
};

export default useUploadImage;
