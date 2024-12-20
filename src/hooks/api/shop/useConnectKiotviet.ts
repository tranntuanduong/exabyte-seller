import { CONNECT_KIOT_VIET } from "src/constants/api/shop";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";

const useConnectKiotviet = () => {
  const [{ data, loading, error }, _handleConnect] = useHttpClient<any>(
    {
      ...CONNECT_KIOT_VIET,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleChangeStatusCategory = async (data: any) => {
    try {
      const res = await _handleConnect({
        data: data,
      });
      console.log(data, "xxaa");
      if (res.status === 201) {
        localStorage.setItem("accessTokenKiotViet", res.data);
        localStorage.setItem("addressKiotViet", data.address);
        toast.success("Kết nối thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [
    {
      data,
      loading,
      error,
    },
    handleChangeStatusCategory,
  ] as const;
};

export default useConnectKiotviet;
