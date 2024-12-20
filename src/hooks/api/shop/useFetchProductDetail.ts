import { GET_PRODUCT_DETAIL } from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";

const useFetchProductDetail = () => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...GET_PRODUCT_DETAIL,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleFetchProductDetails = async (productId: string) => {
    try {
      await _fetch({
        param: productId,
      });
    } catch (error) {}
  };

  return [{ data, loading }, handleFetchProductDetails] as const;
};

export default useFetchProductDetail;
