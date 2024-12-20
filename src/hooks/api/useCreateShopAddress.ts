import React from "react";
import useHttpClient from "./useHttpClient";
import { CREATE_SHOP_ADDRESS } from "src/constants/api/address";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";

export interface AddressShopData {
  name: string;
  phone: string;
  ward: string | null;
  district: string | null;
  province: string | null;
  desc: string;
  isActive?: string;
  status?: string;
}

const useCreateShopAddress = (callback: () => void) => {
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...CREATE_SHOP_ADDRESS,
    },
    {
      manual: true,
    }
  );

  const createShopAddress = async (data: AddressShopData) => {
    try {
      await _fetch({
        data: data,
      });
      toast.success("Thêm mới dữ liệu thành công");
      callback();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };
  return [{ data: data?.data || [], loading }, createShopAddress] as const;
};

export default useCreateShopAddress;
