import { SHOP_STATUS } from "src/constants/api/establish";
import useHttpClient from "./useHttpClient";

const useFetchShopStatus = () => {
  const [{ data, loading }] = useHttpClient<any>(
    {
      ...SHOP_STATUS,
    },
    {
      dataPath: "data",
      manual: false
    }
  );
  return { data, loading }
};
export default useFetchShopStatus;
