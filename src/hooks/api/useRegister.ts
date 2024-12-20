import { SHOP_LOGIN, SHOP_REGISTER } from "src/constants/api/auth";
import useHttpClient from "./useHttpClient";
import { BaseRes } from "src/types/base.type";
import { AuthResponse } from "src/types/auth";
import { RegisterParams } from "src/context/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const useRegister = () => {
  const router = useRouter();
  const [{ data, loading }, _register] = useHttpClient<AuthResponse>(
    {
      ...SHOP_REGISTER,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );

  const handleRegister = async (data: RegisterParams) => {
    try {
      await _register({
        data: data,
      });
      toast.success("Đăng ký thành công");
      router.replace("/login");
    } catch (error: any) {
      console.log(error, "kiem tra loi ton tai");
      toast.error(error?.response.data.message ?? "Đăng ký thất bại");
    }
  };

  return [{ data, loading }, handleRegister] as const;
};

export default useRegister;
