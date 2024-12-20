import { SHOP_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";

const useFetchShopProfile = () => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...SHOP_PROFILE,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  console.log("test", data)

  const fetchShopProfile = async () => {
    try {
      await _fetch();
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data, loading }, fetchShopProfile] as const;
};

export default useFetchShopProfile;
