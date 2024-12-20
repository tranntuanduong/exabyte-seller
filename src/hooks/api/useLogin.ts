import { SHOP_LOGIN } from "src/constants/api/auth";
import useHttpClient from "./useHttpClient";
import { BaseRes } from "src/types/base.type";
import { AuthResponse } from "src/types/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

interface LoginParams {
  email: string;
  password: string;
}

const useLogin = () => {
  const [{ data, loading }, _login] = useHttpClient<AuthResponse>(
    {
      ...SHOP_LOGIN,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );

  const handleLogin = async (data: LoginParams) => {
    try {
      await _login({
        data: data,
      });
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.response?.data?.message ?? "Đăng nhập thất bại");
    }
  };

  return [{ data, loading }, handleLogin] as const;
};

export default useLogin;
