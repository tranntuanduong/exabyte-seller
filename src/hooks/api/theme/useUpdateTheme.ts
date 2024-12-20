import toast from "react-hot-toast";
import { UPDATE_THEME } from "src/constants/api/theme";
import useHttpClient from "../useHttpClient";

export interface newShopBannerIdProps {
  shopBanners: {
    image: string;
    url: string;
    status: string;
  }[];
  categoryIds: number[];
  themeId: number;
}

const useUpdateShopBanner = (callback: () => void) => {
  const [{ data, loading }, _handleUpdateBannerShop] = useHttpClient(
    {
      ...UPDATE_THEME,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const updateShopBannerId = async (newShopBanner: newShopBannerIdProps) => {
    try {
      await _handleUpdateBannerShop({
        data: newShopBanner,
      });
      toast.success("update thành công");
      callback();
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.log("error", error);
    }
  };
  return [{ data, loading }, updateShopBannerId] as const;
};

export default useUpdateShopBanner;
