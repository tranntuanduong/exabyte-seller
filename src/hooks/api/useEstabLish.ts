import { SHOP_UPDATE_ESTABLISH } from "src/constants/api/establish";
import useHttpClient from "./useHttpClient";
import { toast } from "react-hot-toast";
const useEstabLish = () => {
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...SHOP_UPDATE_ESTABLISH,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );
  const getEstabLish = async () => {
    try {
      await _fetch({});
      toast.success("Cập nhật thành công");
    } catch (error: any) {
      // console.log(error);
      toast.error(error.message || "Cập nhật thất bại");
    }
  };
  return [{ data, loading }, getEstabLish] as const;
};
export default useEstabLish;
