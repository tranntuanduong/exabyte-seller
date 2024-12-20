import { CHANGE_STATUS_CATEGORY } from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";
import { NewShopCategoryProps } from "src/types/shop.type";
import { toast } from "react-hot-toast";

const useChangeStatusShopCategory = () => {
  const [{ data, loading, error }, _handleChangeStatus] = useHttpClient<any>(
    {
      ...CHANGE_STATUS_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleChangeStatusCategory = async (categoryId: number) => {
    try {
      await _handleChangeStatus({
        param: `${categoryId}/status/change`,
      });
      toast.success("Thay đổi trạng thái thành công");
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
    handleChangeStatusCategory,
  ] as const;
};

export default useChangeStatusShopCategory;
