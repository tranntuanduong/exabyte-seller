import React from "react";
import { UPDATE_SHOP_ADDRESS } from "src/constants/api/address";
import useHttpClient from "./useHttpClient";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";

export interface AddressShopData {
  name: string;
  phone: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
  status: string;
}

const useUpdateShopAddress = (callback: () => void) => {
  const [{ data, loading }, _updateAddress] = useHttpClient(
    {
      ...UPDATE_SHOP_ADDRESS,
    },
    {
      manual: true,
    }
  );
  const updateShopAddress = async (data: AddressShopData, id: string) => {
    try {
      await _updateAddress({
        data: data,
        param: id,
      });
      toast.success("Cập nhật dữ liệu thành công");
      callback();
      console.log("vaoxxxxxxx22");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      //
    }
  };
  return [{ data: data?.data || [], loading }, updateShopAddress] as const;
};

export default useUpdateShopAddress;
