import { ADD_SHOP_CATEGORY } from "src/constants/api/shop";
import { NewShopCategoryProps } from "src/types/shop.type";
import { toast } from "react-hot-toast";
import useHttpClient from "../api/useHttpClient";
import { ProductConnect } from "src/types/product";
import { ADD_PRODUCT } from "src/constants/api/product";

const useAddProduct = () => {
  const [{ data, loading }, _handleAddProduct] = useHttpClient<any>(
    {
      ...ADD_PRODUCT,
    },
    {
      manual: true,
      dataPath: "data",
      autoCancel: false,
    }
  );

  const handleAddProduct = async (newProduct: ProductConnect) => {
    console.log("newProduct", newProduct);
    try {
      await _handleAddProduct({
        data: newProduct,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [
    {
      data,
      loading,
    },
    handleAddProduct,
  ] as const;
};

export default useAddProduct;
