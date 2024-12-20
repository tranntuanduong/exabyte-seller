import {
  FETCH_USER_BY_REFCODE,
  SHOP_PROFILE,
  SHOP_UPDATE_PROFILE,
  SHOP_UPDATE_REFERRAL_USER,
} from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { UpdateProfileForm } from "src/pages/shop/profile";
import { toast } from "react-hot-toast";

const useFetchUserByRefCode = () => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...FETCH_USER_BY_REFCODE,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );

  const fetchUserByRefCode = async (refCode?: string) => {
    try {
      await _fetch({
        param: refCode,
      });
    } catch (error) {}
  };

  return { data, loading, fetchUserByRefCode };
};

export default useFetchUserByRefCode;
