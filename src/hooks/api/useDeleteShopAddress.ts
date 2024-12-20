import React from "react";
import useHttpClient from "./useHttpClient";
import { DELETE_SHOP_ADDRESS } from "src/constants/api/address";
import { toast } from "react-hot-toast";

export interface AddressShopData {
  name: string;
  phone: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
}

const useDeleteShopAddress = (callback: () => void) => {
  const [{ data, loading }, _deleteAddress] = useHttpClient(
    {
      ...DELETE_SHOP_ADDRESS,
    },
    {
      manual: true,
    }
  );

  const deleteShopAddress = async (id: string) => {
    try {
      await _deleteAddress({
        param: id,
      });
      toast.success("Xóa dữ liệu thành công !");
      callback();
    } catch (error) {
      toast.error("Xóa dữ liệu thành công !");
    }
  };

  return { data, loading, deleteShopAddress };
};

export default useDeleteShopAddress;
