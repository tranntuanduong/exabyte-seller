import { stringArrToSlug } from "src/utils/string";
import { toast } from "react-hot-toast";
import { TreeCategory } from "src/types/category";
import useHttpClient from "../useHttpClient";
import {
  FETCH_CATEGORIES,
  UPDATE_CATEGORY_ORDER,
} from "src/constants/api/category";

interface Props {
  onSuccess?: () => void;
}

const useUpdateCategoryOrder = ({ onSuccess }: Props) => {
  const [{ data, loading }, _update] = useHttpClient<TreeCategory[]>(
    {
      ...UPDATE_CATEGORY_ORDER,
    },
    {
      manual: false,
      dataPath: "data",
    }
  );

  const handleUpdateCategoryOrder = async (data: any[]) => {
    try {
      await _update({
        data: {
          data,
        },
      });
      toast.success("Điều chỉnh dữ liệu thành công ");

      onSuccess && onSuccess();
    } catch (error) {
      toast.error("Điều chỉnh dữ liệu thất bại ");
    }
  };

  return {
    data,
    loading,
    handleUpdateCategoryOrder,
  };
};

export default useUpdateCategoryOrder;
