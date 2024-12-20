import { SHOP_CHANGE_PASSWORD } from "src/constants/api/password";
import useHttpClient from "./useHttpClient";
import { toast } from "react-hot-toast";

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
const useChangePassword = () => {
  const [{ data, loading }, _changePassword] = useHttpClient(
    {
      ...SHOP_CHANGE_PASSWORD,
    },
    {
      manual: true,
    }
  );

  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      await _changePassword({
        data: data,
      });
      toast.success("Cập nhật thành công");
    } catch (error: any) {
      console.log("error", error);
      toast.error("Mật khẩu cũ chưa chính xác");
    }
  };

  return {
    data,
    loading,
    handleChangePassword,
  };
};
export default useChangePassword;
