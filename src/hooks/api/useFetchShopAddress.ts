import React from "react";
import useHttpClient from "./useHttpClient";
import { GET_LIST_SHOP_ADDRESS } from "src/constants/api/address";
import { Address } from "src/types/address";

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

export interface IListSelectAddressProps {
  id: string;
  ten: string;
  diaChinhChaId: null;
  capDiaChinh: string;
  maTraCuu: string;
  slug: string;
}

const useFetchShopAddress = () => {
  const [{ data, loading }, _addAddress] = useHttpClient<Address[]>(
    {
      ...GET_LIST_SHOP_ADDRESS,
    },
    {
      manual: false,
      dataPath: "data",
    }
  );

  const fetchAdress = async () => {
    try {
      console.log("vaoxxxxxxx");

      await _addAddress();
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data: data ?? [], loading }, fetchAdress] as const;
};

export default useFetchShopAddress;
