import { useRouter } from "next/router";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { ADD_PRODUCT_CATEGORY } from "src/constants/api/shop";

interface Props {
  onSuccess?: () => void;
}

const useAddProductShopCategory = ({ onSuccess }: Props) => {
  const router = useRouter();

  const [{ data, loading, error }, _handleAddProductShopCategory] =
    useHttpClient<any>(
      {
        ...ADD_PRODUCT_CATEGORY,
      },
      {
        manual: true,
        dataPath: "data",
      }
    );

  const handleAddProductShopCategory = async (
    newProduct: { productIds: string[] },
    categoryId: number
  ) => {
    try {
      await _handleAddProductShopCategory({
        param: `${categoryId}/add-products`,
        data: newProduct,
      });
      toast.success("Thêm sản phẩm thành công");
      onSuccess && onSuccess();
    } catch (error: any) {
      toast.error(error?.message ?? "Thêm sản phẩm thất bại");
    }
  };

  return [
    {
      data,
      loading,
      error,
    },
    handleAddProductShopCategory,
  ] as const;
};

export default useAddProductShopCategory;
