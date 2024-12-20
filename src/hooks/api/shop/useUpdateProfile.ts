import { SHOP_PROFILE, SHOP_UPDATE_PROFILE } from "src/constants/api/profile";
import useHttpClient from "../useHttpClient";
import { UpdateProfileForm } from "src/pages/shop/profile";
import { toast } from "react-hot-toast";

const useUpdateProfile = () => {
  const [{ data, loading }, _update] = useHttpClient<any>(
    {
      ...SHOP_UPDATE_PROFILE,
      headers: { "Content-Type": "multipart/form-data" },
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
          // link: "test",
          // avatar: "test",
        },
      });

      toast.success("Cập nhật dữ liệu thành công");


    } catch (error: any) {
      // console.log(error, "xxxxssdsds");
      toast.error(error.response.data.message || "Cập nhật thất bại");
    }
  };

  return [{ data, loading }, handleUpdate] as const;
};

export default useUpdateProfile;
