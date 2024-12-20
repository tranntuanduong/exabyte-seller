import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { GET_SHOP_CATEGORY_DETAIL } from "src/constants/api/shop";

const useFetchShopCategoryDetail = () => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...GET_SHOP_CATEGORY_DETAIL,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchShopCategoryDetail = async (categoryId: string) => {
    try {
      await _fetch({
        param: `${categoryId}/detail`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return [
    { data, loading, count: data?.count ?? 0 },
    fetchShopCategoryDetail,
  ] as const;
};

export default useFetchShopCategoryDetail;
