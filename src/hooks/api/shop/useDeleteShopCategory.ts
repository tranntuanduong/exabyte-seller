import {
  ADD_SHOP_CATEGORY,
  DELETE_SHOP_CATEGORY,
} from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";
import { NewShopCategoryProps } from "src/types/shop.type";
import { toast } from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}

const useDeleteShopCategory = ({ onSuccess }: Props) => {
  const [{ data, loading, error, response }, _handleDeleteShopCategory] =
    useHttpClient<any>(
      {
        ...DELETE_SHOP_CATEGORY,
      },
      {
        manual: true,
        dataPath: "data",
      }
    );

  const handleDeleteShopCategory = async (categoryId: number) => {
    try {
      await _handleDeleteShopCategory({
        param: `${categoryId}`,
      });
      toast.success("Xoá danh mục thành công");
      onSuccess && onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return [
    {
      data,
      loading,
      error,
      response,
    },
    handleDeleteShopCategory,
  ] as const;
};

export default useDeleteShopCategory;
