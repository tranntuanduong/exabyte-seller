import {
  DELETE_PRODUCT,
  DELETE_PRODUCT_SHOP_CATEGORY,
} from "src/constants/api/product";
import useHttpClient from "../useHttpClient";

const useDeleteProdShopCategory = () => {
  const [{}, _handleDeleteProdShopCategory] = useHttpClient<any>(
    {
      ...DELETE_PRODUCT_SHOP_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const handleDeleteProdShopCategory = async (
    id: number,
    productId: number[]
  ) => {
    try {
      await _handleDeleteProdShopCategory({
        param: String(id),
        data: {
          productIds: productId,
        },
      });
      console.log("vafp1");
    } catch (error) {
      console.log(error);
    }
  };
  return [{}, handleDeleteProdShopCategory] as const;
};

export default useDeleteProdShopCategory;
