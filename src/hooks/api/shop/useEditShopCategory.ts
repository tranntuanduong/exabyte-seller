import { PRODUCT_LIST } from "src/constants/api/product";
import useHttpClient from "../useHttpClient";
import { NewShopCategoryProps } from "src/types/shop.type";
import { EDIT_SHOP_CATEGORY } from "src/constants/api/shop";

interface Props {
  onSuccess?: () => void;
}

const useEditShopCategory = ({ onSuccess }: Props) => {
  const [{ data, loading }, _handleEditShopCategory] = useHttpClient<any[]>(
    {
      ...EDIT_SHOP_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const handleEditShopCategory = async (
    newCategory: NewShopCategoryProps,
    idCategory: number
  ) => {
    try {
      await _handleEditShopCategory({
        data: newCategory,
        param: `${idCategory}`,
      });
      onSuccess && onSuccess();

    } catch (error) {}
  };
  return [{ data, loading }, handleEditShopCategory] as const;
};

export default useEditShopCategory;
