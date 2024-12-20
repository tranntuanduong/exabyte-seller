import { CHANGE_ORDER_CATEGORY } from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { DataOrderProps } from "src/types/shop.type";

const useChangeOrderShopCategory = () => {
  const [{ data, loading, error }, _handleChangeOrder] = useHttpClient<any>(
    {
      ...CHANGE_ORDER_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleChangeOrderCategory = async (
    dataOrder: DataOrderProps[] | any[]
  ) => {
    try {
      await _handleChangeOrder({
        data: {
          data: dataOrder,
        },
      });
      toast.success("Thay đổi vị trí thành công");
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
    handleChangeOrderCategory,
  ] as const;
};

export default useChangeOrderShopCategory;
