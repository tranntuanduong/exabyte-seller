import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { GET_SHOP_CATEGORY_PRODUCT_ID } from "src/constants/api/shop";

const useFetchShopCategoryIdProduct = () => {
  const [{ data, loading }, _fetchShopCategoryIdProduct] = useHttpClient<any>(
    {
      ...GET_SHOP_CATEGORY_PRODUCT_ID,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchShopCategoryIdProduct = async (categoryId: string) => {
    try {
      await _fetchShopCategoryIdProduct({
        param: `${categoryId}/products`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data, loading }, fetchShopCategoryIdProduct] as const;
};

export default useFetchShopCategoryIdProduct;
