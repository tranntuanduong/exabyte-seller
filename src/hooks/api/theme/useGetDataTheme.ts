import toast from "react-hot-toast";
import { GET_THEME } from "src/constants/api/theme";
import { ShopTheme } from "src/types/theme";
import useHttpClient from "../useHttpClient";

const useFetchThemeByShopId = () => {
  const [{ data, loading }, _getThemeByShopId] = useHttpClient<ShopTheme>(
    {
      ...GET_THEME,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const getThemeByShopId = async (shopId: string) => {
    console.log("aquan", shopId);
    try {
      await _getThemeByShopId({
        param: `${shopId}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return [{ data, loading }, getThemeByShopId] as const;
};

export default useFetchThemeByShopId;
