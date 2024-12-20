import { LIST_THEME } from "src/constants/api/theme";
import useHttpClient from "../useHttpClient";
export interface LayOutProps {
  id: number;
  layoutImg: string;
  numberBanner: number;
  themeDemo: string;
}
const useFetchListTheme = () => {
  const [{ data, loading }] = useHttpClient<LayOutProps[]>(
    {
      ...LIST_THEME,
    },
    {
      manual: false,
      dataPath: "data",
    }
  );
  return {
    data: data ?? [],
    loading,
  };
};

export default useFetchListTheme;
