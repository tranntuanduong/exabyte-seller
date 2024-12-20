import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { GET_PRODUCT_OWNER_SEARCH } from "src/constants/api/shop";
import { DataCategory } from "src/types/shop.type";

export interface SearchProductCategory {
  keyword?: string;
  page?: number;
  stockFrom?: number;
  stockTo?: number;
}

const useFetchProductCategory = () => {
  const [{ data, loading }, _fetchProductCategory] = useHttpClient<any>(
    {
      ...GET_PRODUCT_OWNER_SEARCH,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchProductCategory = async (data: SearchProductCategory) => {
    try {
      await _fetchProductCategory({
        params: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return [
    { data: data ?? [], loading, count: data?.count ?? 0 },
    fetchProductCategory,
  ] as const;
};

export default useFetchProductCategory;
