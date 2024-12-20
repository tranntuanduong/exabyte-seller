import toast from "react-hot-toast";
import { ADD_THEME } from "src/constants/api/theme";
import useHttpClient from "../useHttpClient";

// export interface AddThemeProps {
//   numberBanner: number;
//   layoutImg: string;
//   themeDemo: string;
// }

export interface AddThemeProps {
  shopBanners: {
    image: string;
    url: string;
    status: string;
  }[];
  categoryIds: number[];
  themeId: number;
}

const useAddTheme = (callback: () => void) => {
  const [{ data, loading }, _handleAddTheme] = useHttpClient(
    {
      ...ADD_THEME,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const addTheme = async (newTheme: AddThemeProps) => {
    try {
      await _handleAddTheme({
        data: newTheme,
      });
      toast.success("Cập nhật thành công");
      callback();
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.log("error", error);
    }
  };

  return [
    {
      data: data?.data || [],
      loading,
    },
    addTheme,
  ] as const;
};

export default useAddTheme;
