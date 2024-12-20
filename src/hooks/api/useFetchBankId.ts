import { FETCH_GHTQ_BANK_ID } from "src/constants/api/shop";
import React from "react";
import useHttpClient from "./useHttpClient";
import { GET_LIST_SHOP_ADDRESS } from "src/constants/api/address";
import { Address } from "src/types/address";
import { StringLocale } from "yup/lib/locale";

export interface Bank {
  id: string;
  name: string;
  code: string;
}

const useFetchBanksGhtq = () => {
  const [{ data, loading }] = useHttpClient<Bank[]>(
    {
      ...FETCH_GHTQ_BANK_ID,
    },
    {
      manual: false,
      dataPath: "data.data",
    }
  );

  return { data: data ?? [], loading };
};

export default useFetchBanksGhtq;
