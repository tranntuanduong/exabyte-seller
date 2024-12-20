import {
  SHOP_PROFILE,
  SHOP_UPDATE_PROFILE,
  SHOP_UPDATE_REFERRAL_USER,
} from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { UpdateProfileForm } from "src/pages/shop/profile";
import { toast } from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}

const useUpdateReferalUser = ({ onSuccess }: Props) => {
  const [{ data, loading }, _update] = useHttpClient<any>(
    {
      ...SHOP_UPDATE_REFERRAL_USER,
    },
    {
      dataPath: "data",
      manual: true,
    }
  );

  const handleUpdate = async (data?: UpdateProfileForm) => {
    try {
      await _update({
        data: {
          ...data,
        },
      });
      toast.success("Cập nhật người giới thiệu thành công");
      onSuccess && onSuccess();
    } catch (error: any) {
      toast.error("Cập nhật người giới thiệu thất bại");
    }
  };

  return { data, loading, handleUpdate };
};

export default useUpdateReferalUser;
