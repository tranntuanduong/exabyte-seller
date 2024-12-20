import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { GET_SHOP_CATEGORY } from "src/constants/api/shop";
import { DataCategory } from "src/types/shop.type";

const useFetchShopCategory = () => {
  const [{ data, loading }, _fetch] = useHttpClient<DataCategory[]>(
    {
      ...GET_SHOP_CATEGORY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchShopCategory = async () => {
    try {
      await _fetch();
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data: data ?? [], loading }, fetchShopCategory] as const;
};

export default useFetchShopCategory;
