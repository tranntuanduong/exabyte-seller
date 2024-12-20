import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "./useHttpClient";

const useFetchProfile = () => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...SHOP_PROFILE,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );

  const getShopProfile = async (shopId: string) => {
    console.log("shopId", shopId);
    try {
      await _fetch({});
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data, loading }, getShopProfile] as const;
};

export default useFetchProfile;
