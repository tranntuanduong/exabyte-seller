import { ADD_NEW, UPDATE_NEW } from "src/constants/api/new";
import useHttpClient from "../useHttpClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";
import { useRouter } from "next/router";

interface AddProps {
  title: string;
  slug: string;
  content: string;
  images: string[];
  id?: number;
}

const useAddOrUpdateNew = ({ isUpdate }: { isUpdate?: boolean }) => {
  const router = useRouter();
  const [{ data, loading }, _add] = useHttpClient(
    {
      ...(!isUpdate
        ? {
            ...ADD_NEW,
          }
        : {
            ...UPDATE_NEW,
          }),
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handler = async (data: AddProps) => {
    try {
      await _add({
        data: data,
        ...(data.id && {
          param: `${data?.id}`,
        }),
      });

      toast.success(isUpdate ? "Cập nhật thành công" : "Đăng bài thành công");
      router.push("/new");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    data,
    loading,
    handler,
  };
};

export default useAddOrUpdateNew;
