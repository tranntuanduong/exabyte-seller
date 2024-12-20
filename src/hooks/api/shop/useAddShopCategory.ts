import { ADD_SHOP_CATEGORY } from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";
import { NewShopCategoryProps } from "src/types/shop.type";
import { toast } from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}

const useAddShopCategory = ({ onSuccess }: Props) => {
  const [{ data, loading, error }, _handleAddShopCategory] = useHttpClient<any>(
    {
      ...ADD_SHOP_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleAddShopCategory = async (newCategory: NewShopCategoryProps) => {
    try {
      await _handleAddShopCategory({
        data: newCategory,
      });
      toast.success("Thêm mới dữ liệu thành công");
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
    },
    handleAddShopCategory,
  ] as const;
};

export default useAddShopCategory;
